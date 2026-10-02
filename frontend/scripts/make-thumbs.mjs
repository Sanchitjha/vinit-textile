// Generates small card/menu thumbnails: public/product-images/thumbs/<folder>-<NN>.webp (480px wide)
// from the first photo of every product folder. Re-run after adding products:
//   npm i --no-save sharp && node scripts/make-thumbs.mjs
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve('public/product-images')
const OUT = path.join(ROOT, 'thumbs')
fs.mkdirSync(OUT, { recursive: true })

let n = 0
for (const cat of fs.readdirSync(path.join(ROOT, 'categories'))) {
  const catDir = path.join(ROOT, 'categories', cat)
  for (const folder of fs.readdirSync(catDir)) {
    const src = path.join(catDir, folder, '01.webp')
    if (!fs.existsSync(src)) continue
    await sharp(src).resize({ width: 480 }).webp({ quality: 78 }).toFile(path.join(OUT, `${folder}-01.webp`))
    n++
  }
}
console.log(`wrote ${n} thumbnails to ${OUT}`)
