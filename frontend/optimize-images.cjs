const sharp = require('sharp')
const path = require('path')

const files = [
  'hero-1',
  'hero-2',
  'hero-3',
  'hero-4',
  'banner-timeless-elegance',
  'banner-sarees-collection',
]

const dir = path.join(__dirname, 'public', 'images')

async function run() {
  for (const name of files) {
    const input = path.join(dir, `${name}.png`)
    const output = path.join(dir, `${name}.webp`)
    const info = await sharp(input).resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 78 }).toFile(output)
    console.log(`${name}.webp — ${(info.size / 1024).toFixed(0)} KB (${info.width}x${info.height})`)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
