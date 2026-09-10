/**
 * Delete the lorem-ipsum seed row from the catalogue.
 *   ADMIN_EMAIL=you@x.com ADMIN_PASS=... node scripts/delete-junk-saree.mjs
 * Add --dry to only print what would be deleted.
 */
const API = process.env.API_URL || 'https://vinit-textile.onrender.com/api/v1';
const EMAIL = process.env.ADMIN_EMAIL || 'admin@vinittextiles.com';
const PASSWORD = process.env.ADMIN_PASS || 'admin123';
const DRY = process.argv.includes('--dry');

async function main() {
  const lr = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  const lj = await lr.json();
  if (!lr.ok) { console.error('LOGIN FAILED', lr.status, lj); process.exit(1); }
  const token = lj.data.accessToken;
  console.log('logged in as', lj.data.user.email);

  const sr = await fetch(`${API}/sarees?limit=200`);
  const sj = await sr.json();
  // "junk" = SKU that isn't the real VT-<number> pattern
  const junk = sj.data.items.filter((p) => !/^VT-\d/i.test((p.sku || '').trim()));
  if (junk.length === 0) { console.log('nothing to delete — all SKUs look real'); return; }

  for (const p of junk) {
    console.log(`${DRY ? 'DRY ' : ''}delete ${p._id}  sku="${p.sku}"  name="${p.name}"`);
    if (DRY) continue;
    const dr = await fetch(`${API}/sarees/${p._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(dr.ok ? '  -> deleted' : `  -> FAILED ${dr.status} ${await dr.text()}`);
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
