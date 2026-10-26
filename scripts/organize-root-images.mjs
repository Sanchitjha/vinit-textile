import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const TARGET_BASE = path.join(ROOT_DIR, 'product-images', 'categories');

const SEQ_NUM = {
  a: '01',
  b: '02',
  c: '03',
  d: '04',
  e: '05',
  f: '06',
  ref: '07',
};

function getMapping(f) {
  // Karwachauth special vt1899 a.PNG
  if (/^Karwachauth special vt1899\s+([a-e])\.PNG$/i.test(f)) {
    const m = f.match(/([a-e])\.PNG$/i);
    return { cat: 'bridal-saree', folder: 'VT-1899-karwachauth', seq: m[1].toLowerCase(), ext: '.png', productName: 'Karwa Chauth Special Heavy Saree (VT-1899)' };
  }
  // Vt-11029-A.PNG
  if (/^Vt-11029-([a-e])\.PNG$/i.test(f)) {
    const m = f.match(/([a-e])\.PNG$/i);
    return { cat: 'silk-saree', folder: 'VT-11029-v2', seq: m[1].toLowerCase(), ext: '.png', productName: 'Petrol Blue Gold Zari Silk Saree - Edition 2 (VT-11029)' };
  }
  // Vt-1499-A.PNG
  if (/^Vt-1499-([a-e])\.PNG$/i.test(f)) {
    const m = f.match(/([a-e])\.PNG$/i);
    return { cat: 'partywear', folder: 'VT-1499-v2', seq: m[1].toLowerCase(), ext: '.png', productName: 'Shimmer Embroidered Partywear Saree - Edition 2 (VT-1499)' };
  }
  // Vt-1660-A  light brown.PNG
  if (/^Vt-1660-([a-e])\s+light brown\.PNG$/i.test(f)) {
    const m = f.match(/^Vt-1660-([a-e])/i);
    return { cat: 'georgette-saree', folder: 'VT-1660-light-brown', seq: m[1].toLowerCase(), ext: '.png', productName: 'Light Brown Embroidered Georgette Saree (VT-1660-BRN)' };
  }
  // Vt-1660-A Digital print.PNG
  if (/^Vt-1660-([a-e])\s+Digital print\.PNG$/i.test(f)) {
    const m = f.match(/^Vt-1660-([a-e])/i);
    return { cat: 'georgette-saree', folder: 'VT-1660-digital-print', seq: m[1].toLowerCase(), ext: '.png', productName: 'Digital Floral Print Georgette Saree (VT-1660-DIG)' };
  }
  // Vt-1660-A.PNG
  if (/^Vt-1660-([a-e])\.PNG$/i.test(f)) {
    const m = f.match(/([a-e])\.PNG$/i);
    return { cat: 'georgette-saree', folder: 'VT-1660', seq: m[1].toLowerCase(), ext: '.png', productName: 'Classic Embroidered Georgette Saree (VT-1660)' };
  }
  // Vt-1799-A.PNG
  if (/^Vt-1799-([a-e])\.PNG$/i.test(f)) {
    const m = f.match(/([a-e])\.PNG$/i);
    return { cat: 'silk-saree', folder: 'VT-1799', seq: m[1].toLowerCase(), ext: '.png', productName: 'Designer Handwoven Silk Saree (VT-1799)' };
  }
  // Vt11285 a peacock.PNG
  if (/^Vt11285\s+([a-e])\s+peacock\.PNG$/i.test(f)) {
    const m = f.match(/^Vt11285\s+([a-e])/i);
    return { cat: 'silk-saree', folder: 'VT-11285-peacock', seq: m[1].toLowerCase(), ext: '.png', productName: 'Peacock Blue Zari Border Silk Saree (VT-11285-PCK)' };
  }
  // Vt11285 e peacock.PNG
  if (/^Vt11285\s+e\s+peacock\.PNG$/i.test(f)) {
    return { cat: 'silk-saree', folder: 'VT-11285-peacock', seq: 'e', ext: '.png', productName: 'Peacock Blue Zari Border Silk Saree (VT-11285-PCK)' };
  }
  // Vt11285 digital print ivory a.PNG
  if (/^Vt11285\s+digital print ivory\s+([a-e])\.PNG$/i.test(f)) {
    const m = f.match(/([a-e])\.PNG$/i);
    return { cat: 'georgette-saree', folder: 'VT-11285-ivory', seq: m[1].toLowerCase(), ext: '.png', productName: 'Digital Print Ivory Georgette Saree (VT-11285-IVR)' };
  }
  // Vt11285teal a.PNG
  if (/^Vt11285teal\s+([a-e])\.(PNG|jpg\.jpeg)$/i.test(f)) {
    const m = f.match(/([a-e])\.(PNG|jpg\.jpeg)$/i);
    const e = f.endsWith('.jpeg') ? '.jpeg' : '.png';
    return { cat: 'silk-saree', folder: 'VT-11285-teal', seq: m[1].toLowerCase(), ext: e, productName: 'Teal Blue Zari Weave Silk Saree (VT-11285-TEL)' };
  }
  // Vt11299 malai a.PNG
  if (/^Vt11299\s+malai\s+([a-e])\.PNG$/i.test(f)) {
    const m = f.match(/([a-e])\.PNG$/i);
    return { cat: 'silk-saree', folder: 'VT-11299-malai', seq: m[1].toLowerCase(), ext: '.png', productName: 'Malai Silk Soft Handloom Saree (VT-11299-MLI)' };
  }
  // Vt11599 blush pink a.PNG
  if (/^Vt11599\s+blush pink\s+([a-e])\.PNG$/i.test(f)) {
    const m = f.match(/([a-e])\.PNG$/i);
    return { cat: 'partywear', folder: 'VT-11599-blush-pink', seq: m[1].toLowerCase(), ext: '.png', productName: 'Blush Pink Shimmer Partywear Saree (VT-11599-PNK)' };
  }
  // Vt1699 lady maroon
  if (/^Vt1699\s+lady maroon\s+([a-e])\.PNG$/i.test(f)) {
    const m = f.match(/([a-e])\.PNG$/i);
    return { cat: 'bridal-saree', folder: 'VT-1699-lady-maroon', seq: m[1].toLowerCase(), ext: '.png', productName: 'Lady Maroon Embroidered Bridal Saree (VT-1699-MRN)' };
  }
  if (/^Vt1699\s+lady maroon\.PNG$/i.test(f)) {
    return { cat: 'bridal-saree', folder: 'VT-1699-lady-maroon', seq: 'd', ext: '.png', productName: 'Lady Maroon Embroidered Bridal Saree (VT-1699-MRN)' };
  }
  // Vt1775 green a.PNG
  if (/^Vt1775\s+green\s+([a-e])\.PNG$/i.test(f)) {
    const m = f.match(/([a-e])\.PNG$/i);
    return { cat: 'silk-saree', folder: 'VT-1775-green', seq: m[1].toLowerCase(), ext: '.png', productName: 'Emerald Green Festive Silk Saree (VT-1775-GRN)' };
  }
  // Vt1875 grey
  if (/^Vt1875\s+([a-e])\s+Handwork heavy saree grey\.PNG$/i.test(f)) {
    const m = f.match(/^Vt1875\s+([a-e])/i);
    return { cat: 'bridal-saree', folder: 'VT-1875-grey', seq: m[1].toLowerCase(), ext: '.png', productName: 'Handwork Heavy Bridal Saree - Slate Grey (VT-1875-GRY)' };
  }
  if (/^Vt1875\s+f\s+\(dark tone image\)Handwork heavy saree grey\.PNG$/i.test(f)) {
    return { cat: 'bridal-saree', folder: 'VT-1875-grey', seq: 'f', ext: '.png', productName: 'Handwork Heavy Bridal Saree - Slate Grey (VT-1875-GRY)' };
  }
  // Vt1875 RUST ORANGE
  if (/^Vt1875\s+([a-e])\s+handwork heavy saree RUST ORANGE\.PNG$/i.test(f)) {
    const m = f.match(/^Vt1875\s+([a-e])/i);
    return { cat: 'bridal-saree', folder: 'VT-1875-rust-orange', seq: m[1].toLowerCase(), ext: '.png', productName: 'Handwork Heavy Bridal Saree - Rust Orange (VT-1875-RST)' };
  }
  // Vt1875 TEAL COLOR
  if (/^Vt1875\s+([a-e])\s+handwork heavy saree TEAL COLOR\.PNG$/i.test(f)) {
    const m = f.match(/^Vt1875\s+([a-e])/i);
    return { cat: 'bridal-saree', folder: 'VT-1875-teal', seq: m[1].toLowerCase(), ext: '.png', productName: 'Handwork Heavy Bridal Saree - Royal Teal (VT-1875-TEL)' };
  }
  if (/^Vt1875\s+f\s+\(darktone\)\s+handwork heavy saree TEAL COLOR\.PNG$/i.test(f)) {
    return { cat: 'bridal-saree', folder: 'VT-1875-teal', seq: 'f', ext: '.png', productName: 'Handwork Heavy Bridal Saree - Royal Teal (VT-1875-TEL)' };
  }
  // Vt1875 Blue color
  if (/^Vt1875\s+([a-e])\s+heavy handwork saree Blue color\.PNG$/i.test(f)) {
    const m = f.match(/^Vt1875\s+([a-e])/i);
    return { cat: 'bridal-saree', folder: 'VT-1875-blue', seq: m[1].toLowerCase(), ext: '.png', productName: 'Handwork Heavy Bridal Saree - Midnight Blue (VT-1875-BLU)' };
  }
  // Vt1875 purple color
  if (/^Vt1875\s+([a-e])\s+heavy handwork saree purple color\.PNG$/i.test(f)) {
    const m = f.match(/^Vt1875\s+([a-e])/i);
    return { cat: 'bridal-saree', folder: 'VT-1875-purple', seq: m[1].toLowerCase(), ext: '.png', productName: 'Handwork Heavy Bridal Saree - Regal Purple (VT-1875-PUR)' };
  }
  // Vt1875 reference
  if (/^Vt1875 Original picture for reference/i.test(f)) {
    return { cat: 'bridal-saree', folder: 'VT-1875-grey', seq: 'ref', ext: '.jpeg', productName: 'Reference Photo - VT-1875 Series' };
  }

  return null;
}

const files = fs.readdirSync(ROOT_DIR).filter((f) => /\.(png|jpg|jpeg)$/i.test(f));
console.log(`Found ${files.length} image files in root folder.`);

const productGroups = {};
let movedCount = 0;

for (const file of files) {
  const mapping = getMapping(file);
  if (!mapping) {
    console.warn(`Skipping unmapped file: ${file}`);
    continue;
  }

  const targetDir = path.join(TARGET_BASE, mapping.cat, mapping.folder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const newFileName = `${SEQ_NUM[mapping.seq] || '01'}${mapping.ext}`;
  const targetPath = path.join(targetDir, newFileName);
  const srcPath = path.join(ROOT_DIR, file);

  fs.renameSync(srcPath, targetPath);
  movedCount++;

  const groupKey = `${mapping.cat}/${mapping.folder}`;
  if (!productGroups[groupKey]) {
    productGroups[groupKey] = {
      productName: mapping.productName,
      category: mapping.cat,
      folder: mapping.folder,
      files: [],
    };
  }
  productGroups[groupKey].files.push({ original: file, target: newFileName });
}

console.log(`\nSuccessfully moved and organized ${movedCount} images across ${Object.keys(productGroups).length} product folders:\n`);

for (const [key, group] of Object.entries(productGroups)) {
  console.log(`📁 product-images/categories/${key}/ (${group.productName})`);
  group.files.sort((a, b) => a.target.localeCompare(b.target)).forEach((f) => {
    console.log(`   └─ ${f.target}  <--  [${f.original}]`);
  });
}
