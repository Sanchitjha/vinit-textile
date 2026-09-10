/**
 * Bulk-import the 16 saree folders that have photos but no product record.
 * Creates each as HIDDEN (isActive:false) with stock:0 so nothing sells at a
 * placeholder price — details (price/description) copied from the base SKU,
 * then edit + activate in the admin panel.
 *
 * Run:  node bulk-import.mjs           (creates)
 *       node bulk-import.mjs --dry     (prints payloads, no writes)
 */
import fs from 'fs';
import path from 'path';

const API = process.env.API_URL || 'https://vinit-textile.onrender.com/api/v1';
// Pass real working admin credentials:  ADMIN_EMAIL=you@x.com ADMIN_PASS=... node bulk-import.mjs
const EMAIL = process.env.ADMIN_EMAIL || 'admin@vinittextiles.com';
const PASSWORD = process.env.ADMIN_PASS || 'admin123';
const IMG_ROOT = process.argv[2] && !process.argv[2].startsWith('--')
  ? process.argv[2]
  : path.resolve('frontend/public/product-images/categories');
const DRY = process.argv.includes('--dry');
const SAREE_CAT = '6a9b0246b18c7bd17fc10a19'; // "saree" category _id

// folder -> parent category folder (for fabric hints / image path)
const TARGETS = [
  'bridal-saree/VT-1699-brown',
  'bridal-saree/VT-1699-elephant',
  'bridal-saree/VT-1699-flowers',
  'bridal-saree/VT-1855-v2',
  'cotton-saree/VT-1460-v2',
  'georgette-saree/VT-1470-v2',
  'organza-saree/VT-1425-v2',
  'partywear/VT-1499-blue',
  'partywear/VT-1499-green',
  'partywear/VT-1499-purple',
  'partywear/VT-1499-yellow',
  'partywear/VT-2860',
  'silk-saree/VT-12590-v2',
  'silk-saree/VT-1395-purple',
  'silk-saree/VT-1565-v2',
  'silk-saree/VT-1599-v2',
];

const LABELS = {
  brown: 'Brown', elephant: 'Elephant Motif', flowers: 'Floral',
  blue: 'Blue', green: 'Green', purple: 'Purple', yellow: 'Yellow',
  v2: 'Alternate Colourway',
};
const COLOR_SUFFIXES = new Set(['brown', 'blue', 'green', 'purple', 'yellow']);

// fabric fallback per parent folder if there's no base product
const PARENT_FABRIC = {
  'silk-saree': 'Silk', 'bridal-saree': 'Velvet Silk', 'cotton-saree': 'Cotton Silk',
  'georgette-saree': 'Georgette', 'organza-saree': 'Organza', 'partywear': 'Georgette',
};

async function main() {
  // 1. login
  const lr = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  const lj = await lr.json();
  if (!lr.ok) { console.error('LOGIN FAILED', lr.status, lj); process.exit(1); }
  const token = lj.data.accessToken;
  console.log('logged in as', lj.data.user.email, '(', lj.data.user.role, ')\n');

  // 2. existing products -> base map
  const sr = await fetch(`${API}/sarees?limit=200`);
  const sj = await sr.json();
  const bySku = {};
  sj.data.items.forEach((p) => { bySku[p.sku.toUpperCase()] = p; });
  const existing = new Set(Object.keys(bySku));

  let created = 0, skipped = 0, failed = 0;

  for (const rel of TARGETS) {
    const [parent, folder] = rel.split('/');
    const sku = folder.toUpperCase();
    if (existing.has(sku)) { console.log(`skip ${sku} — already in DB`); skipped++; continue; }

    // base SKU = folder minus the last -suffix
    const m = folder.match(/^(VT-[0-9]+)(?:-(.+))?$/i);
    const baseSku = m ? m[1].toUpperCase() : sku;
    const suffix = m && m[2] ? m[2].toLowerCase() : '';
    const base = bySku[baseSku];

    // images
    const dir = path.join(IMG_ROOT, rel);
    const images = fs.readdirSync(dir)
      .filter((f) => /\.webp$/i.test(f))
      .sort()
      .map((f) => `/product-images/categories/${rel}/${f}`);
    if (images.length === 0) { console.log(`skip ${sku} — no webp images`); skipped++; continue; }

    const label = LABELS[suffix] || (suffix ? suffix.replace(/\b\w/g, (c) => c.toUpperCase()) : 'Variant');
    const baseName = base ? base.name.replace(/\s*\(VT-[^)]+\)\s*$/i, '').trim()
      : 'Premium Handwoven Saree';
    const name = `${baseName} - ${label} (${sku})`;

    const color = COLOR_SUFFIXES.has(suffix) ? label
      : (base?.color || 'Assorted');

    const payload = {
      name,
      description: base?.description
        || 'Authentic Surat handloom saree — premium fabric, festive-ready drape. Full details coming soon.',
      category: base?.category?._id || base?.category || SAREE_CAT,
      images,
      price: base?.price ?? 1999,
      compareAtPrice: base?.compareAtPrice ?? 2600,
      discount: base?.discount ?? 0,
      sku,
      stock: 0,               // hidden from sale until reviewed
      fabric: base?.fabric || PARENT_FABRIC[parent] || 'Silk',
      sareeType: base?.sareeType || undefined,
      color,
      colors: COLOR_SUFFIXES.has(suffix) ? [label] : (base?.colors || []),
      isFeatured: false,
      isActive: false,        // draft — activate in admin after setting price
      tags: ['needs-review'],
    };
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

    if (DRY) {
      console.log(`DRY ${sku}: "${name}"  ₹${payload.price}  ${images.length} imgs  fabric=${payload.fabric}  color=${color}`);
      created++;
      continue;
    }

    const cr = await fetch(`${API}/sarees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    if (cr.ok) { console.log(`created ${sku}  "${name}"  (hidden, ₹${payload.price})`); created++; }
    else { console.log(`FAILED ${sku}  ${cr.status}  ${await cr.text()}`); failed++; }
  }

  console.log(`\n${DRY ? '[DRY] ' : ''}created: ${created}  skipped: ${skipped}  failed: ${failed}`);
  if (!DRY && created > 0) {
    console.log('\nAll new products are HIDDEN (isActive:false) with stock 0.');
    console.log('In the admin panel: set the real price + stock for each, then activate.');
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
