// Generates public/sitemap.xml from the live catalog.
// Run manually with: node scripts/generate-sitemap.mjs
// Re-run and commit whenever categories/products change meaningfully.
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const API_BASE = process.env.VITE_API_BASE || 'https://vinit-textile.onrender.com/api/v1'
const SITE_URL = process.env.VITE_SITE_URL || 'https://vinit-textiles.vercel.app'

const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
  { path: '/contact', priority: '0.5', changefreq: 'monthly' },
  { path: '/size-chart', priority: '0.4', changefreq: 'monthly' },
  { path: '/shipping-delivery', priority: '0.4', changefreq: 'monthly' },
  { path: '/track-order', priority: '0.3', changefreq: 'monthly' },
  { path: '/reviews', priority: '0.5', changefreq: 'weekly' },
  { path: '/returns-policy', priority: '0.4', changefreq: 'monthly' },
  { path: '/faqs', priority: '0.5', changefreq: 'monthly' },
  { path: '/stores', priority: '0.4', changefreq: 'monthly' },
  { path: '/franchise', priority: '0.4', changefreq: 'monthly' },
  { path: '/blog', priority: '0.5', changefreq: 'weekly' },
  { path: '/privacy-policy', priority: '0.2', changefreq: 'yearly' },
  { path: '/terms-conditions', priority: '0.2', changefreq: 'yearly' },
]

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} -> ${res.status}`)
  return res.json()
}

function urlEntry({ loc, priority, changefreq }) {
  return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
}

async function main() {
  const entries = STATIC_ROUTES.map((r) =>
    urlEntry({ loc: `${SITE_URL}${r.path}`, priority: r.priority, changefreq: r.changefreq })
  )

  try {
    const catBody = await fetchJson(`${API_BASE}/categories`)
    const categories = catBody.data || catBody || []
    for (const cat of categories) {
      if (!cat.slug) continue
      entries.push(urlEntry({ loc: `${SITE_URL}/shop/${cat.slug}`, priority: '0.8', changefreq: 'daily' }))
    }
  } catch (err) {
    console.error('Failed to fetch categories, skipping category URLs:', err.message)
  }

  try {
    let page = 1
    const limit = 100
    let total = Infinity
    const productIds = []
    while (productIds.length < total) {
      const body = await fetchJson(`${API_BASE}/sarees?limit=${limit}&page=${page}`)
      const data = body.data || body
      const items = data.items || []
      total = data.total ?? items.length
      for (const item of items) {
        const id = item.id || item._id
        if (id && /^VT-/i.test(item.sku || '')) productIds.push(id)
      }
      if (items.length < limit) break
      page += 1
    }
    for (const id of productIds) {
      entries.push(urlEntry({ loc: `${SITE_URL}/product/${id}`, priority: '0.7', changefreq: 'weekly' }))
    }
    console.log(`Added ${productIds.length} product URLs.`)
  } catch (err) {
    console.error('Failed to fetch products, skipping product URLs:', err.message)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`

  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const outPath = path.join(__dirname, '..', 'public', 'sitemap.xml')
  await writeFile(outPath, xml, 'utf-8')
  console.log(`Wrote ${entries.length} URLs to ${outPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
