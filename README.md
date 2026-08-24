# Ambika — Indian Traditional Fashion Ecommerce

Frontend build based on the [Ambika Behance design](https://www.behance.net/gallery/224881867/Ambika-Indian-Tradition-Fashion-Ecommerce-Website) by Ruta Vaghela.

## Stack

- React 19 + Vite
- Tailwind CSS v4 (theme tokens in [src/index.css](src/index.css))
- React Router v7
- Cart state via React Context, persisted to `localStorage`

## Getting started

```bash
npm install
npm run dev
```

## Design tokens

Colors and type sourced from the Behance style guide, defined as Tailwind theme tokens in `src/index.css`:

| Token | Hex | Use |
|---|---|---|
| `cream` | `#F4EBE1` | Page background |
| `ivory` | `#FBF7F2` | Cards, form panels |
| `brown` | `#5D350E` | Primary text, buttons |
| `maroon` | `#3E150B` | Headings, footer, dark accents |
| `mauve` | `#AB86A4` | Secondary accent |
| `olive` | `#B7BA5D` | CTA highlight (Shop Now, Buy Now) |
| `stone` | `#9D9D9D` | Muted text |

Fonts: **Judson** (serif, `font-display` — logo/headings) and **Teachers** (sans-serif, `font-body` — everything else), loaded from Google Fonts in `index.html`.

## Pages

| Route | Page |
|---|---|
| `/` | Home (hero, categories, new arrivals, newest collection, bridal banner, newsletter) |
| `/shop/:category` | Category listing with filters (`saree`, `kurti`, `dress`, `lehenga`) |
| `/product/:id` | Product detail (gallery, size/qty, add to cart, related products) |
| `/cart` | Shopping cart |
| `/login`, `/signup` | Auth pages |
| `/account` | Profile, orders, addresses, wishlist |
| `/about`, `/contact` | Info pages |

## Images

The mockups use the designer's own photoshoot, which isn't ours to redistribute. Every image slot in this build is a styled placeholder (`src/components/ui/Placeholder.jsx`) labeled with what should go there — swap in real product photography by replacing `<Placeholder>` with an `<img>` once assets are ready.

## Not yet wired up

- Checkout flow (button is a placeholder — no payment integration)
- Search
- Real authentication (forms redirect to `/account` on submit)
- Backend/API — all product data is mocked in `src/data/products.js`
