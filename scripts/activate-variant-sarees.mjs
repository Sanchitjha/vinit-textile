/**
 * Activate the 16 hidden variant sarees created by import-variant-sarees.mjs.
 * The GET /sarees list hardcodes isActive:true, so hidden rows can only be
 * reached by slug — this looks each up by slug, then PATCHes isActive:true and
 * stock (copied from the base SKU, default 10).
 *
 * Run:  ADMIN_EMAIL=you@x.com ADMIN_PASS=... node scripts/activate-variant-sarees.mjs
 *       add --dry to preview
 */
const API = process.env.API_URL || 'https://vinit-textile.onrender.com/api/v1';
const EMAIL = process.env.ADMIN_EMAIL || 'admin@vinittextiles.com';
const PASSWORD = process.env.ADMIN_PASS || 'admin123';
const DRY = process.argv.includes('--dry');
const DEFAULT_STOCK = 10;

// base name (as created by import-variant-sarees.mjs) + sku + label
const VARIANTS = [
  ['Royal Velvet Border Handwoven Saree', 'VT-1699-BROWN', 'Brown'],
  ['Royal Velvet Border Handwoven Saree', 'VT-1699-ELEPHANT', 'Elephant Motif'],
  ['Royal Velvet Border Handwoven Saree', 'VT-1699-FLOWERS', 'Floral'],
  ['Premium Bridal Trousseau Velvet Saree', 'VT-1855-V2', 'Alternate Colourway'],
  ['Handloom Cotton Silk Floral Saree', 'VT-1460-V2', 'Alternate Colourway'],
  ['Georgette Micro-Sequin Border Saree', 'VT-1470-V2', 'Alternate Colourway'],
  ['Festive Organza Zari Drape Saree', 'VT-1425-V2', 'Alternate Colourway'],
  ['Designer Partywear Embroidered Saree', 'VT-1499-BLUE', 'Blue'],
  ['Designer Partywear Embroidered Saree', 'VT-1499-GREEN', 'Green'],
  ['Designer Partywear Embroidered Saree', 'VT-1499-PURPLE', 'Purple'],
  ['Designer Partywear Embroidered Saree', 'VT-1499-YELLOW', 'Yellow'],
  ['Contemporary Partywear Designer Saree', 'VT-2860', null], // no base/label
  ['Royal Zari Woven Silk Saree', 'VT-12590-V2', 'Alternate Colourway'],
  ['Traditional Banarasi Silk Saree', 'VT-1395-PURPLE', 'Purple'],
  ['Pure Kanjivaram Style Brocade Silk Saree', 'VT-1565-V2', 'Alternate Colourway'],
  ['Festive Chanderi Silk Zari Saree', 'VT-1599-V2', 'Alternate Colourway'],
];

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function main() {
  const lr = await fetch(`${API}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  const lj = await lr.json();
  if (!lr.ok) { console.error('LOGIN FAILED', lr.status, lj); process.exit(1); }
  const token = lj.data.accessToken;
  console.log('logged in as', lj.data.user.email, '\n');

  const listRes = await fetch(`${API}/sarees?limit=100`);
  const listJson = await listRes.json();
  const baseStock = {};
  (listJson?.data?.items || []).forEach((p) => { baseStock[p.sku.toUpperCase()] = p.stock; });

  let done = 0, failed = 0, missing = 0;

  for (const [baseName, sku, label] of VARIANTS) {
    const name = label ? `${baseName} - ${label} (${sku})` : `${baseName} (${sku})`;
    const slug = slugify(name);

    const gr = await fetch(`${API}/sarees/slug/${slug}`);
    const gj = await gr.json();
    const prod = gj?.data;
    if (!gr.ok || !prod?._id) { console.log(`?? ${sku} — slug "${slug}" not found (${gr.status})`); missing++; continue; }

    const baseSku = sku.replace(/-(?:BROWN|ELEPHANT|FLOWERS|BLUE|GREEN|PURPLE|YELLOW|V2)$/i, '');
    const stock = baseStock[baseSku] ?? DEFAULT_STOCK;

    if (prod.isActive) { console.log(`ok   ${sku} — already active`); done++; continue; }
    if (DRY) { console.log(`DRY  ${sku} (${prod._id}) -> isActive:true, stock:${stock}`); done++; continue; }

    const ur = await fetch(`${API}/sarees/${prod._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ isActive: true, stock, tags: [] }),
    });
    if (ur.ok) { console.log(`live ${sku}  (stock ${stock})`); done++; }
    else { console.log(`FAIL ${sku}  ${ur.status}  ${await ur.text()}`); failed++; }
  }

  console.log(`\n${DRY ? '[DRY] ' : ''}activated: ${done}  failed: ${failed}  not found: ${missing}`);
}
main().catch((e) => { console.error(e); process.exit(1); });
