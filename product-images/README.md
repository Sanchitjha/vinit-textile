# Product Photos — Staging Area

Drop incoming saree photos here as they arrive from Vinit Textiles. This folder
is **not committed to git** (only this README is) — it's a local handoff point
before photos get uploaded into the real catalogue (via the admin panel's S3
upload, once AWS is configured) or wired into product entries directly.

## Folder convention

One folder per SKU / design code, matching the format from the requirements
checklist (Appendix A):

```
product-images/
  VT-BAN-0142/
    01-front.jpg
    02-pallu.jpg
    03-fabric-closeup.jpg
    04-back.jpg
    05-folded.jpg
    06-blouse.jpg
  VT-ORG-0089/
    01-front.jpg
    ...
```

- **Individual files only** — no composite/collage plates (see the note in
  the requirements doc about why: zoom, mobile display, and image SEO all
  break on a merged multi-shot image).
- Minimum 1500×2000px, portrait, consistent 3:4 aspect ratio across the
  catalogue.
- Name files by shot type so it's obvious which is which without opening
  each one — the numbering above is a suggestion, not a hard requirement.
- If a SKU code doesn't exist yet, use a short working name (e.g. the
  product name) and I'll rename the folder once the SKU is assigned.

Once photos are in a folder, tell me and I'll match them to the right
product entry.
