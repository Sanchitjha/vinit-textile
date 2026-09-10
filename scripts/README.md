# Catalogue maintenance scripts

Both talk to the live Render backend API. They need a **working admin login** —
the seeded `admin@vinittextiles.com` / `admin123` currently returns
`INVALID_CREDENTIALS`, so pass real ones:

```bash
# from the repo root
ADMIN_EMAIL="your-admin@email" ADMIN_PASS="your-password" node scripts/<script>.mjs
```

Add `--dry` to any script to preview without writing.

If no admin login works at all, reset one directly in MongoDB: get the Render
service's `MONGODB_URI` from its dashboard → Environment, then run a small
mongoose script (bcrypt-hash a new password, `updateOne({role:'ADMIN'}, ...)`).

## `import-variant-sarees.mjs`

Creates the 16 products that have photo folders in
`frontend/public/product-images/categories/` but no DB record
(`VT-1699-brown`, `VT-1499-blue`, all the `-v2`s, `VT-2860`, …).

- name / SKU / images derived from the folder
- price, description, fabric, sareeType copied from the base SKU
  (`VT-1699-brown` → from `VT-1699`)
- **created hidden**: `isActive:false`, `stock:0`, tag `needs-review`

After running: open each in the admin panel, set the real price + stock, activate.

## `delete-junk-saree.mjs`

Deletes any catalogue row whose SKU isn't a real `VT-<number>` — currently the
one lorem-ipsum seed row (`"Sint ipsam et qui m"`, SKU `ANIMI QUI ANIM DELE`).
