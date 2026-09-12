export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://vinit-textiles.vercel.app').replace(/\/$/, '')
export const SITE_NAME = 'Vinit Textiles'
export const DEFAULT_TITLE = 'Vinit Textiles | Sarees That Celebrate Indian Naree'
export const DEFAULT_DESCRIPTION =
  'Vinit Textiles — premium sarees, lehengas and ethnic wear crafted for every Indian celebration. Shop silk, bridal and partywear sarees. Surat, Gujarat.'
export const DEFAULT_IMAGE = `${SITE_URL}/images/og-default.jpg`

export function absoluteUrl(path = '/') {
  if (/^https?:\/\//i.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
