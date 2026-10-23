export const categories = [
  { slug: 'saree', name: 'All Sarees', tone: 'maroon' },
  { slug: 'silk-saree', name: 'Silk Sarees', tone: 'gold' },
  { slug: 'organza-saree', name: 'Organza Sarees', tone: 'mauve' },
  { slug: 'cotton-saree', name: 'Cotton Sarees', tone: 'brown' },
  { slug: 'georgette-saree', name: 'Georgette Sarees', tone: 'teal' },
  { slug: 'partywear', name: 'Partywear Sarees', tone: 'vermillion' },
  { slug: 'bridal-saree', name: 'Bridal Sarees', tone: 'maroon' },
]

export const sareeOccasions = [
  { slug: 'bestsellers', name: 'Bestsellers / New Arrivals', to: '/shop/saree', tone: 'vermillion' },
  { slug: 'partywear', name: 'Partywear Collection', to: '/shop/saree', tone: 'maroon' },
  { slug: 'wedding', name: 'Wedding Edit', to: '/shop/saree', tone: 'gold' },
  { slug: 'silk-saree', name: 'Royal Silk Edit', to: '/shop/saree', tone: 'gold' },
  { slug: 'organza-saree', name: 'Organza Drape', to: '/shop/saree', tone: 'mauve' },
  { slug: 'bridal', name: 'Bridal Edit', to: '/shop/saree', tone: 'teal' },
]

export const occasions = [
  { slug: 'wedding', name: 'Wedding Edit', to: '/shop/saree', image: '/product-images/categories/bridal-saree/VT-1699/01.webp' },
  { slug: 'diwali', name: 'Diwali Collection', to: '/shop/saree', image: '/product-images/categories/partywear/VT-1499/01.webp' },
  { slug: 'bridal', name: 'Bridal Trousseau', to: '/shop/saree', image: '/product-images/categories/bridal-saree/VT-1855/01.webp' },
  { slug: 'festive', name: 'Festive Everyday', to: '/shop/saree', image: '/product-images/categories/silk-saree/VT-12590/01.webp' },
]

const FALLBACK_TONES = ['brown', 'mauve', 'gold', 'teal', 'cream', 'ivory']

export const products = [
  {
    "id": "VT-11029",
    "sku": "VT-11029",
    "name": "Petrol Blue Gold Floral Embroidered Saree (VT-11029)",
    "category": "silk-saree",
    "price": 1500,
    "mrp": 2500,
    "fabric": "Silk Blend",
    "color": "Petrol Blue",
    "colors": [
      "Blue"
    ],
    "ratings": 4.9,
    "isFeatured": true,
    "isBestseller": true,
    "images": [
      "/product-images/categories/silk-saree/VT-11029/01.webp",
      "/product-images/categories/silk-saree/VT-11029/02.webp",
      "/product-images/categories/silk-saree/VT-11029/03.webp",
      "/product-images/categories/silk-saree/VT-11029/04.webp",
      "/product-images/categories/silk-saree/VT-11029/05.webp",
      "/product-images/categories/silk-saree/VT-11029/06.webp"
    ]
  },
  {
    "id": "VT-12590",
    "sku": "VT-12590",
    "name": "Royal Zari Woven Silk Saree (VT-12590)",
    "category": "silk-saree",
    "price": 2590,
    "mrp": 3200,
    "fabric": "Silk",
    "color": "Red & Gold",
    "colors": [
      "Red",
      "Gold"
    ],
    "ratings": 4.9,
    "isFeatured": true,
    "isBestseller": true,
    "images": [
      "/product-images/categories/silk-saree/VT-12590/01.webp",
      "/product-images/categories/silk-saree/VT-12590/02.webp",
      "/product-images/categories/silk-saree/VT-12590/03.webp",
      "/product-images/categories/silk-saree/VT-12590/04.webp"
    ]
  },
  {
    "id": "VT-12590-v2",
    "sku": "VT-12590-V2",
    "name": "Royal Zari Woven Silk Saree - Ruby Red Edition (VT-12590-V2)",
    "category": "silk-saree",
    "price": 2590,
    "mrp": 3200,
    "fabric": "Georgette",
    "color": "Ivory & Multicolour",
    "colors": [
      "Beige",
      "Multicolor"
    ],
    "ratings": 4.9,
    "isFeatured": true,
    "isBestseller": false,
    "images": [
      "/product-images/categories/silk-saree/VT-12590-v2/01.webp",
      "/product-images/categories/silk-saree/VT-12590-v2/02.webp",
      "/product-images/categories/silk-saree/VT-12590-v2/03.webp",
      "/product-images/categories/silk-saree/VT-12590-v2/04.webp"
    ]
  },
  {
    "id": "VT-1395",
    "sku": "VT-1395",
    "name": "Traditional Banarasi Silk Saree - Maroon (VT-1395)",
    "category": "silk-saree",
    "price": 1395,
    "mrp": 1800,
    "fabric": "Banarasi Silk",
    "color": "Maroon",
    "colors": [
      "Maroon"
    ],
    "ratings": 4.8,
    "isFeatured": true,
    "isBestseller": true,
    "images": [
      "/product-images/categories/silk-saree/VT-1395/01.webp",
      "/product-images/categories/silk-saree/VT-1395/02.webp",
      "/product-images/categories/silk-saree/VT-1395/03.webp",
      "/product-images/categories/silk-saree/VT-1395/04.webp",
      "/product-images/categories/silk-saree/VT-1395/05.webp"
    ]
  },
  {
    "id": "VT-1395-purple",
    "sku": "VT-1395-PUR",
    "name": "Traditional Banarasi Silk Saree - Purple Orchid (VT-1395-PUR)",
    "category": "silk-saree",
    "price": 1395,
    "mrp": 1800,
    "fabric": "Georgette",
    "color": "Lavender",
    "colors": [
      "Purple"
    ],
    "ratings": 4.9,
    "isFeatured": true,
    "isBestseller": false,
    "images": [
      "/product-images/categories/silk-saree/VT-1395-purple/01.webp",
      "/product-images/categories/silk-saree/VT-1395-purple/02.webp",
      "/product-images/categories/silk-saree/VT-1395-purple/03.webp",
      "/product-images/categories/silk-saree/VT-1395-purple/04.webp",
      "/product-images/categories/silk-saree/VT-1395-purple/05.webp"
    ]
  },
  {
    "id": "VT-1565",
    "sku": "VT-1565",
    "name": "Pure Kanjivaram Style Brocade Silk Saree (VT-1565)",
    "category": "silk-saree",
    "price": 1565,
    "mrp": 2200,
    "fabric": "Kanjivaram Silk",
    "color": "Purple & Gold",
    "colors": [
      "Purple",
      "Gold"
    ],
    "ratings": 5,
    "isFeatured": true,
    "isBestseller": true,
    "images": [
      "/product-images/categories/silk-saree/VT-1565/01.webp",
      "/product-images/categories/silk-saree/VT-1565/02.webp",
      "/product-images/categories/silk-saree/VT-1565/03.webp",
      "/product-images/categories/silk-saree/VT-1565/04.webp",
      "/product-images/categories/silk-saree/VT-1565/05.webp"
    ]
  },
  {
    "id": "VT-1565-v2",
    "sku": "VT-1565-V2",
    "name": "Pure Kanjivaram Brocade Silk Saree - Temple Motif Edition (VT-1565-V2)",
    "category": "silk-saree",
    "price": 1565,
    "mrp": 2200,
    "fabric": "Georgette",
    "color": "Burnt Orange",
    "colors": [
      "Orange"
    ],
    "ratings": 5,
    "isFeatured": true,
    "isBestseller": false,
    "images": [
      "/product-images/categories/silk-saree/VT-1565-v2/01.webp",
      "/product-images/categories/silk-saree/VT-1565-v2/02.webp",
      "/product-images/categories/silk-saree/VT-1565-v2/03.webp",
      "/product-images/categories/silk-saree/VT-1565-v2/04.webp",
      "/product-images/categories/silk-saree/VT-1565-v2/05.webp"
    ]
  },
  {
    "id": "VT-1599",
    "sku": "VT-1599",
    "name": "Festive Chanderi Silk Zari Saree (VT-1599)",
    "category": "silk-saree",
    "price": 1599,
    "mrp": 2250,
    "fabric": "Chanderi Silk",
    "color": "Royal Blue",
    "colors": [
      "Blue"
    ],
    "ratings": 4.9,
    "isFeatured": true,
    "isBestseller": true,
    "images": [
      "/product-images/categories/silk-saree/VT-1599/01.webp",
      "/product-images/categories/silk-saree/VT-1599/02.webp",
      "/product-images/categories/silk-saree/VT-1599/03.webp",
      "/product-images/categories/silk-saree/VT-1599/04.webp",
      "/product-images/categories/silk-saree/VT-1599/05.webp"
    ]
  },
  {
    "id": "VT-1599-v2",
    "sku": "VT-1599-V2",
    "name": "Festive Chanderi Silk Zari Saree - Peacock Weave (VT-1599-V2)",
    "category": "silk-saree",
    "price": 1599,
    "mrp": 2250,
    "fabric": "Silk Blend",
    "color": "Royal Blue",
    "colors": [
      "Blue"
    ],
    "ratings": 4.9,
    "isFeatured": true,
    "isBestseller": false,
    "images": [
      "/product-images/categories/silk-saree/VT-1599-v2/01.webp",
      "/product-images/categories/silk-saree/VT-1599-v2/02.webp",
      "/product-images/categories/silk-saree/VT-1599-v2/03.webp",
      "/product-images/categories/silk-saree/VT-1599-v2/04.webp",
      "/product-images/categories/silk-saree/VT-1599-v2/05.webp"
    ]
  },
  {
    "id": "VT-1425",
    "sku": "VT-1425",
    "name": "Festive Organza Zari Drape Saree (VT-1425)",
    "category": "organza-saree",
    "price": 1425,
    "mrp": 1900,
    "fabric": "Organza",
    "color": "Blush Pink",
    "colors": [
      "Pink"
    ],
    "ratings": 4.7,
    "isFeatured": true,
    "isBestseller": true,
    "images": [
      "/product-images/categories/organza-saree/VT-1425/01.webp",
      "/product-images/categories/organza-saree/VT-1425/02.webp",
      "/product-images/categories/organza-saree/VT-1425/03.webp",
      "/product-images/categories/organza-saree/VT-1425/04.webp",
      "/product-images/categories/organza-saree/VT-1425/05.webp"
    ]
  },
  {
    "id": "VT-1425-v2",
    "sku": "VT-1425-V2",
    "name": "Festive Organza Zari Drape Saree - Rose Gold Edition (VT-1425-V2)",
    "category": "organza-saree",
    "price": 1425,
    "mrp": 1900,
    "fabric": "Shimmer Georgette",
    "color": "Mustard Green",
    "colors": [
      "Green",
      "Yellow"
    ],
    "ratings": 4.8,
    "isFeatured": true,
    "isBestseller": false,
    "images": [
      "/product-images/categories/organza-saree/VT-1425-v2/01.webp",
      "/product-images/categories/organza-saree/VT-1425-v2/02.webp",
      "/product-images/categories/organza-saree/VT-1425-v2/03.webp",
      "/product-images/categories/organza-saree/VT-1425-v2/04.webp",
      "/product-images/categories/organza-saree/VT-1425-v2/05.webp"
    ]
  },
  {
    "id": "VT-1460",
    "sku": "VT-1460",
    "name": "Handloom Cotton Silk Floral Saree (VT-1460)",
    "category": "cotton-saree",
    "price": 1460,
    "mrp": 1950,
    "fabric": "Cotton Silk",
    "color": "Yellow",
    "colors": [
      "Yellow"
    ],
    "ratings": 4.8,
    "isFeatured": true,
    "isBestseller": true,
    "images": [
      "/product-images/categories/cotton-saree/VT-1460/01.webp",
      "/product-images/categories/cotton-saree/VT-1460/02.webp",
      "/product-images/categories/cotton-saree/VT-1460/03.webp",
      "/product-images/categories/cotton-saree/VT-1460/04.webp",
      "/product-images/categories/cotton-saree/VT-1460/05.webp"
    ]
  },
  {
    "id": "VT-1460-v2",
    "sku": "VT-1460-V2",
    "name": "Handloom Cotton Silk Floral Saree - Mustard Gold (VT-1460-V2)",
    "category": "cotton-saree",
    "price": 1460,
    "mrp": 1950,
    "fabric": "Georgette",
    "color": "Crimson Red",
    "colors": [
      "Red"
    ],
    "ratings": 4.8,
    "isFeatured": true,
    "isBestseller": false,
    "images": [
      "/product-images/categories/cotton-saree/VT-1460-v2/01.webp",
      "/product-images/categories/cotton-saree/VT-1460-v2/02.webp",
      "/product-images/categories/cotton-saree/VT-1460-v2/03.webp",
      "/product-images/categories/cotton-saree/VT-1460-v2/04.webp",
      "/product-images/categories/cotton-saree/VT-1460-v2/05.webp"
    ]
  },
  {
    "id": "VT-12599",
    "sku": "VT-12599",
    "name": "Mint Green Paisley Embroidered Saree (VT-12599)",
    "category": "georgette-saree",
    "price": 3000,
    "mrp": 4500,
    "fabric": "Georgette",
    "color": "Mint Green",
    "colors": [
      "Green"
    ],
    "ratings": 4.9,
    "isFeatured": true,
    "isBestseller": true,
    "images": [
      "/product-images/categories/georgette-saree/VT-12599/01.webp",
      "/product-images/categories/georgette-saree/VT-12599/02.webp",
      "/product-images/categories/georgette-saree/VT-12599/03.webp",
      "/product-images/categories/georgette-saree/VT-12599/04.webp",
      "/product-images/categories/georgette-saree/VT-12599/05.webp"
    ]
  },
  {
    "id": "VT-1470",
    "sku": "VT-1470",
    "name": "Georgette Micro-Sequin Border Saree (VT-1470)",
    "category": "georgette-saree",
    "price": 1470,
    "mrp": 1990,
    "fabric": "Georgette",
    "color": "Emerald Green",
    "colors": [
      "Green"
    ],
    "ratings": 4.9,
    "isFeatured": true,
    "isBestseller": true,
    "images": [
      "/product-images/categories/georgette-saree/VT-1470/01.webp",
      "/product-images/categories/georgette-saree/VT-1470/02.webp",
      "/product-images/categories/georgette-saree/VT-1470/03.webp",
      "/product-images/categories/georgette-saree/VT-1470/04.webp",
      "/product-images/categories/georgette-saree/VT-1470/05.webp"
    ]
  },
  {
    "id": "VT-1470-v2",
    "sku": "VT-1470-V2",
    "name": "Georgette Micro-Sequin Border Saree - Jade Emerald (VT-1470-V2)",
    "category": "georgette-saree",
    "price": 1470,
    "mrp": 1990,
    "fabric": "Georgette",
    "color": "Red",
    "colors": [
      "Red"
    ],
    "ratings": 4.9,
    "isFeatured": true,
    "isBestseller": false,
    "images": [
      "/product-images/categories/georgette-saree/VT-1470-v2/01.webp",
      "/product-images/categories/georgette-saree/VT-1470-v2/02.webp",
      "/product-images/categories/georgette-saree/VT-1470-v2/03.webp",
      "/product-images/categories/georgette-saree/VT-1470-v2/04.webp",
      "/product-images/categories/georgette-saree/VT-1470-v2/05.webp"
    ]
  },
  {
    "id": "VTLR-1499",
    "sku": "VTLR-1499",
    "name": "Grey Printed Saree with Folk Art Border (VTLR-1499)",
    "category": "georgette-saree",
    "price": 1499,
    "mrp": 2100,
    "fabric": "Georgette",
    "color": "Grey",
    "colors": [
      "Grey"
    ],
    "ratings": 4.8,
    "isFeatured": true,
    "isBestseller": true,
    "images": [
      "/product-images/categories/georgette-saree/VTLR-1499/01.webp",
      "/product-images/categories/georgette-saree/VTLR-1499/02.webp",
      "/product-images/categories/georgette-saree/VTLR-1499/03.webp",
      "/product-images/categories/georgette-saree/VTLR-1499/04.webp",
      "/product-images/categories/georgette-saree/VTLR-1499/05.webp"
    ]
  },
  {
    "id": "VT-1499",
    "sku": "VT-1499",
    "name": "Designer Partywear Embroidered Saree - Dusty Rose (VT-1499)",
    "category": "partywear",
    "price": 1499,
    "mrp": 2100,
    "fabric": "Silk Blend",
    "color": "Teal Blue",
    "colors": [
      "Teal"
    ],
    "ratings": 4.8,
    "isFeatured": true,
    "isBestseller": true,
    "images": [
      "/product-images/categories/partywear/VT-1499/01.webp",
      "/product-images/categories/partywear/VT-1499/02.webp",
      "/product-images/categories/partywear/VT-1499/03.webp"
    ]
  },
  {
    "id": "VT-1499-yellow",
    "sku": "VT-1499-YEL",
    "name": "Designer Partywear Embroidered Saree - Sunshine Yellow (VT-1499-YEL)",
    "category": "partywear",
    "price": 1499,
    "mrp": 2100,
    "fabric": "Shimmer Georgette",
    "color": "Olive Green",
    "colors": [
      "Green"
    ],
    "ratings": 4.9,
    "isFeatured": true,
    "isBestseller": false,
    "images": [
      "/product-images/categories/partywear/VT-1499-yellow/01.webp",
      "/product-images/categories/partywear/VT-1499-yellow/02.webp",
      "/product-images/categories/partywear/VT-1499-yellow/03.webp",
      "/product-images/categories/partywear/VT-1499-yellow/04.webp",
      "/product-images/categories/partywear/VT-1499-yellow/05.webp"
    ]
  },
  {
    "id": "VT-1499-blue",
    "sku": "VT-1499-BLU",
    "name": "Designer Partywear Embroidered Saree - Ocean Blue (VT-1499-BLU)",
    "category": "partywear",
    "price": 1499,
    "mrp": 2100,
    "fabric": "Shimmer Georgette",
    "color": "Rose Brown",
    "colors": [
      "Brown"
    ],
    "ratings": 4.8,
    "isFeatured": true,
    "isBestseller": false,
    "images": [
      "/product-images/categories/partywear/VT-1499-blue/01.webp",
      "/product-images/categories/partywear/VT-1499-blue/02.webp",
      "/product-images/categories/partywear/VT-1499-blue/03.webp",
      "/product-images/categories/partywear/VT-1499-blue/04.webp",
      "/product-images/categories/partywear/VT-1499-blue/05.webp"
    ]
  },
  {
    "id": "VT-1499-green",
    "sku": "VT-1499-GRN",
    "name": "Designer Partywear Embroidered Saree - Emerald Green (VT-1499-GRN)",
    "category": "partywear",
    "price": 1499,
    "mrp": 2100,
    "fabric": "Shimmer Georgette",
    "color": "Powder Blue",
    "colors": [
      "Blue"
    ],
    "ratings": 4.9,
    "isFeatured": true,
    "isBestseller": false,
    "images": [
      "/product-images/categories/partywear/VT-1499-green/01.webp",
      "/product-images/categories/partywear/VT-1499-green/02.webp",
      "/product-images/categories/partywear/VT-1499-green/03.webp",
      "/product-images/categories/partywear/VT-1499-green/04.webp",
      "/product-images/categories/partywear/VT-1499-green/05.webp"
    ]
  },
  {
    "id": "VT-1499-purple",
    "sku": "VT-1499-PUR",
    "name": "Designer Partywear Embroidered Saree - Royal Purple (VT-1499-PUR)",
    "category": "partywear",
    "price": 1499,
    "mrp": 2100,
    "fabric": "Shimmer Georgette",
    "color": "Sunshine Yellow",
    "colors": [
      "Yellow"
    ],
    "ratings": 4.9,
    "isFeatured": true,
    "isBestseller": false,
    "images": [
      "/product-images/categories/partywear/VT-1499-purple/01.webp",
      "/product-images/categories/partywear/VT-1499-purple/02.webp",
      "/product-images/categories/partywear/VT-1499-purple/03.webp",
      "/product-images/categories/partywear/VT-1499-purple/04.webp"
    ]
  },
  {
    "id": "VT-1525-blue",
    "sku": "VT-1525-BLUE",
    "name": "Sky Blue Bead & Sequin Stripe Net Saree (VT-1525-BLUE)",
    "category": "partywear",
    "price": 1199,
    "mrp": 2100,
    "fabric": "Net",
    "color": "Sky Blue",
    "colors": [
      "Blue"
    ],
    "ratings": 4.8,
    "isFeatured": true,
    "isBestseller": true,
    "images": [
      "/product-images/categories/partywear/VT-1525-blue/01.webp",
      "/product-images/categories/partywear/VT-1525-blue/02.webp",
      "/product-images/categories/partywear/VT-1525-blue/03.webp",
      "/product-images/categories/partywear/VT-1525-blue/04.webp",
      "/product-images/categories/partywear/VT-1525-blue/05.webp"
    ]
  },
  {
    "id": "VT-1525-green",
    "sku": "VT-1525-GREEN",
    "name": "Sage Green Bead & Sequin Stripe Net Saree (VT-1525-GREEN)",
    "category": "partywear",
    "price": 1199,
    "mrp": 2100,
    "fabric": "Net",
    "color": "Sage Green",
    "colors": [
      "Green"
    ],
    "ratings": 4.8,
    "isFeatured": true,
    "isBestseller": true,
    "images": [
      "/product-images/categories/partywear/VT-1525-green/01.webp",
      "/product-images/categories/partywear/VT-1525-green/02.webp",
      "/product-images/categories/partywear/VT-1525-green/03.webp",
      "/product-images/categories/partywear/VT-1525-green/04.webp"
    ]
  },
  {
    "id": "VT-1525-pink",
    "sku": "VT-1525-PINK",
    "name": "Lilac Pink Bead & Sequin Stripe Net Saree (VT-1525-PINK)",
    "category": "partywear",
    "price": 1199,
    "mrp": 2100,
    "fabric": "Net",
    "color": "Lilac Pink",
    "colors": [
      "Pink",
      "Purple"
    ],
    "ratings": 4.9,
    "isFeatured": true,
    "isBestseller": true,
    "images": [
      "/product-images/categories/partywear/VT-1525-pink/01.webp",
      "/product-images/categories/partywear/VT-1525-pink/02.webp",
      "/product-images/categories/partywear/VT-1525-pink/03.webp",
      "/product-images/categories/partywear/VT-1525-pink/04.webp",
      "/product-images/categories/partywear/VT-1525-pink/05.webp"
    ]
  },
  {
    "id": "VT-1625",
    "sku": "VT-1625",
    "name": "Steel Blue Beaded Net Saree with Scalloped Border (VT-1625)",
    "category": "partywear",
    "price": 1399,
    "mrp": 2300,
    "fabric": "Net",
    "color": "Steel Blue",
    "colors": [
      "Blue",
      "Grey"
    ],
    "ratings": 4.9,
    "isFeatured": true,
    "isBestseller": true,
    "images": [
      "/product-images/categories/partywear/VT-1625/01.webp",
      "/product-images/categories/partywear/VT-1625/02.webp",
      "/product-images/categories/partywear/VT-1625/03.webp",
      "/product-images/categories/partywear/VT-1625/04.webp",
      "/product-images/categories/partywear/VT-1625/05.webp"
    ]
  },
  {
    "id": "VT-1625-green",
    "sku": "VT-1625-GREEN",
    "name": "Sage Green Beaded Net Saree with Scalloped Border (VT-1625-GREEN)",
    "category": "partywear",
    "price": 1399,
    "mrp": 2300,
    "fabric": "Net",
    "color": "Sage Green",
    "colors": [
      "Green"
    ],
    "ratings": 4.9,
    "isFeatured": true,
    "isBestseller": false,
    "images": [
      "/product-images/categories/partywear/VT-1625-green/01.webp",
      "/product-images/categories/partywear/VT-1625-green/02.webp",
      "/product-images/categories/partywear/VT-1625-green/03.webp",
      "/product-images/categories/partywear/VT-1625-green/04.webp",
      "/product-images/categories/partywear/VT-1625-green/05.webp"
    ]
  },
  {
    "id": "VT-1625-orange",
    "sku": "VT-1625-ORANGE",
    "name": "Rust Orange Beaded Net Saree with Scalloped Border (VT-1625-ORANGE)",
    "category": "partywear",
    "price": 1399,
    "mrp": 2300,
    "fabric": "Net",
    "color": "Rust Orange",
    "colors": [
      "Orange",
      "Brown"
    ],
    "ratings": 4.9,
    "isFeatured": true,
    "isBestseller": true,
    "images": [
      "/product-images/categories/partywear/VT-1625-orange/01.webp",
      "/product-images/categories/partywear/VT-1625-orange/02.webp",
      "/product-images/categories/partywear/VT-1625-orange/03.webp",
      "/product-images/categories/partywear/VT-1625-orange/04.webp",
      "/product-images/categories/partywear/VT-1625-orange/05.webp"
    ]
  },
  {
    "id": "VT-1625-pink",
    "sku": "VT-1625-PINK",
    "name": "Orchid Pink Beaded Net Saree with Scalloped Border (VT-1625-PINK)",
    "category": "partywear",
    "price": 1399,
    "mrp": 2300,
    "fabric": "Net",
    "color": "Orchid Pink",
    "colors": [
      "Pink"
    ],
    "ratings": 4.9,
    "isFeatured": true,
    "isBestseller": true,
    "images": [
      "/product-images/categories/partywear/VT-1625-pink/01.webp",
      "/product-images/categories/partywear/VT-1625-pink/02.webp",
      "/product-images/categories/partywear/VT-1625-pink/03.webp",
      "/product-images/categories/partywear/VT-1625-pink/04.webp",
      "/product-images/categories/partywear/VT-1625-pink/05.webp"
    ]
  },
  {
    "id": "VT-1625-purple",
    "sku": "VT-1625-PURPLE",
    "name": "Dusty Lavender Beaded Net Saree with Scalloped Border (VT-1625-PURPLE)",
    "category": "partywear",
    "price": 1399,
    "mrp": 2300,
    "fabric": "Net",
    "color": "Dusty Lavender",
    "colors": [
      "Purple"
    ],
    "ratings": 4.9,
    "isFeatured": true,
    "isBestseller": true,
    "images": [
      "/product-images/categories/partywear/VT-1625-purple/01.webp",
      "/product-images/categories/partywear/VT-1625-purple/02.webp",
      "/product-images/categories/partywear/VT-1625-purple/03.webp",
      "/product-images/categories/partywear/VT-1625-purple/04.webp",
      "/product-images/categories/partywear/VT-1625-purple/05.webp"
    ]
  },
  {
    "id": "VT-1625-yellow",
    "sku": "VT-1625-YELLOW",
    "name": "Mustard Yellow Beaded Net Saree with Scalloped Border (VT-1625-YELLOW)",
    "category": "partywear",
    "price": 1399,
    "mrp": 2300,
    "fabric": "Net",
    "color": "Mustard Yellow",
    "colors": [
      "Yellow"
    ],
    "ratings": 4.9,
    "isFeatured": true,
    "isBestseller": true,
    "images": [
      "/product-images/categories/partywear/VT-1625-yellow/01.webp",
      "/product-images/categories/partywear/VT-1625-yellow/02.webp",
      "/product-images/categories/partywear/VT-1625-yellow/03.webp",
      "/product-images/categories/partywear/VT-1625-yellow/04.webp",
      "/product-images/categories/partywear/VT-1625-yellow/05.webp"
    ]
  },
  {
    "id": "VT-2860",
    "sku": "VT-2860",
    "name": "Plum Purple Designer Partywear Saree (VT-2860)",
    "category": "partywear",
    "price": 1999,
    "mrp": 2600,
    "fabric": "Georgette",
    "color": "Plum Purple",
    "colors": [
      "Purple"
    ],
    "ratings": 4.9,
    "isFeatured": true,
    "isBestseller": true,
    "images": [
      "/product-images/categories/partywear/VT-2860/01.webp",
      "/product-images/categories/partywear/VT-2860/02.webp",
      "/product-images/categories/partywear/VT-2860/03.webp",
      "/product-images/categories/partywear/VT-2860/04.webp"
    ]
  },
  {
    "id": "VT-1699",
    "sku": "VT-1699",
    "name": "Ivory Pink Floral Georgette Saree (VT-1699)",
    "category": "bridal-saree",
    "price": 1299,
    "mrp": 2400,
    "fabric": "Georgette",
    "color": "Ivory & Pink",
    "colors": [
      "White",
      "Pink"
    ],
    "ratings": 5,
    "isFeatured": true,
    "isBestseller": true,
    "images": [
      "/product-images/categories/bridal-saree/VT-1699/01.webp",
      "/product-images/categories/bridal-saree/VT-1699/02.webp",
      "/product-images/categories/bridal-saree/VT-1699/03.webp",
      "/product-images/categories/bridal-saree/VT-1699/04.webp",
      "/product-images/categories/bridal-saree/VT-1699/05.webp"
    ]
  },
  {
    "id": "VT-1699-flowers",
    "sku": "VT-1699-FLW",
    "name": "Royal Velvet Floral Weave Saree (VT-1699-FLW)",
    "category": "bridal-saree",
    "price": 1699,
    "mrp": 2400,
    "fabric": "Silk Velvet",
    "color": "Deep Red",
    "colors": [
      "Red"
    ],
    "ratings": 5,
    "isFeatured": true,
    "isBestseller": false,
    "images": [
      "/product-images/categories/bridal-saree/VT-1699-flowers/01.webp",
      "/product-images/categories/bridal-saree/VT-1699-flowers/02.webp",
      "/product-images/categories/bridal-saree/VT-1699-flowers/03.webp",
      "/product-images/categories/bridal-saree/VT-1699-flowers/04.webp"
    ]
  },
  {
    "id": "VT-1699-brown",
    "sku": "VT-1699-BRN",
    "name": "Royal Velvet Border Silk Saree - Cocoa Brown (VT-1699-BRN)",
    "category": "bridal-saree",
    "price": 1699,
    "mrp": 2400,
    "fabric": "Silk Velvet",
    "color": "Cocoa Brown",
    "colors": [
      "Brown"
    ],
    "ratings": 5,
    "isFeatured": true,
    "isBestseller": false,
    "images": [
      "/product-images/categories/bridal-saree/VT-1699-brown/01.webp",
      "/product-images/categories/bridal-saree/VT-1699-brown/02.webp",
      "/product-images/categories/bridal-saree/VT-1699-brown/03.webp",
      "/product-images/categories/bridal-saree/VT-1699-brown/04.webp",
      "/product-images/categories/bridal-saree/VT-1699-brown/05.webp"
    ]
  },
  {
    "id": "VT-1699-elephant",
    "sku": "VT-1699-ELP",
    "name": "Royal Velvet Heritage Elephant Motif Saree (VT-1699-ELP)",
    "category": "bridal-saree",
    "price": 1699,
    "mrp": 2400,
    "fabric": "Silk Velvet",
    "color": "Maroon",
    "colors": [
      "Maroon"
    ],
    "ratings": 5,
    "isFeatured": true,
    "isBestseller": false,
    "images": [
      "/product-images/categories/bridal-saree/VT-1699-elephant/01.webp",
      "/product-images/categories/bridal-saree/VT-1699-elephant/02.webp",
      "/product-images/categories/bridal-saree/VT-1699-elephant/03.webp",
      "/product-images/categories/bridal-saree/VT-1699-elephant/04.webp"
    ]
  },
  {
    "id": "VT-1855",
    "sku": "VT-1855",
    "name": "Premium Bridal Trousseau Velvet Saree (VT-1855)",
    "category": "bridal-saree",
    "price": 1855,
    "mrp": 2600,
    "fabric": "Velvet Silk",
    "color": "Crimson Maroon",
    "colors": [
      "Maroon"
    ],
    "ratings": 5,
    "isFeatured": true,
    "isBestseller": true,
    "images": [
      "/product-images/categories/bridal-saree/VT-1855/01.webp",
      "/product-images/categories/bridal-saree/VT-1855/02.webp",
      "/product-images/categories/bridal-saree/VT-1855/03.webp",
      "/product-images/categories/bridal-saree/VT-1855/04.webp"
    ]
  },
  {
    "id": "VT-1855-v2",
    "sku": "VT-1855-V2",
    "name": "Mustard Yellow Floral Embroidered Saree - Design 2 (VT-1855-V2)",
    "category": "bridal-saree",
    "price": 1799,
    "mrp": 2600,
    "fabric": "Silk Blend",
    "color": "Mustard Yellow",
    "colors": [
      "Yellow"
    ],
    "ratings": 5,
    "isFeatured": true,
    "isBestseller": false,
    "images": [
      "/product-images/categories/bridal-saree/VT-1855-v2/01.webp",
      "/product-images/categories/bridal-saree/VT-1855-v2/02.webp",
      "/product-images/categories/bridal-saree/VT-1855-v2/03.webp",
      "/product-images/categories/bridal-saree/VT-1855-v2/04.webp",
      "/product-images/categories/bridal-saree/VT-1855-v2/05.webp"
    ]
  }
]

export function getProductsByCategory(slug) {
  if (!slug || slug === 'saree' || slug === 'all') return products
  return products.filter((product) => product.category === slug)
}

export function getProductById(id) {
  if (!id) return undefined
  const target = String(id).toLowerCase()
  return products.find((product) => 
    product.id?.toLowerCase() === target || 
    product.sku?.toLowerCase() === target || 
    (product._id && String(product._id) === target)
  )
}

export function toneFor(id) {
  const product = products.find((p) => p.id === id || p.sku === id)
  if (product?.tone) return product.tone
  const index = products.findIndex((p) => p.id === id || p.sku === id)
  return FALLBACK_TONES[index >= 0 ? index % FALLBACK_TONES.length : 0]
}
