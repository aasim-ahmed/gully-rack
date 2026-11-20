# GULLY RACK — Storefront Frontend

Curated streetwear & essentials. A frontend-only React storefront for gullyrack.in.

## Stack

React 19 (JavaScript) · Vite · Tailwind CSS v4 · React Router · Framer Motion · Lucide · Sonner

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build
npm run lint
```

## Logo

`public/brand/gully-rack-logo.png` is the official logo, used unmodified. Its artwork sits on a
black canvas, so it is only placed on dark surfaces (navbar, mobile menu, footer). See
`src/components/common/Logo.jsx` for how the artwork area is framed.

## Structure

```
src/
  components/
    common/     Button, Logo, Seo, SmartImage, FormField, Accordion, EmptyState…
    layout/     Navbar, FullMenu, MobileDock, SearchOverlay, Footer, NewsletterForm, Layout
    home/       Hero, BrandStatement, CategoryEditorial, FeaturedDrop, Campaign, ProductRail,
                BrandCulture, SocialGallery
    products/   ProductCard, WishlistButton, ProductGrid, FilterPanel, FilterDrawer, ProductGallery…
    cart/       CartDrawer, CartItem, OrderSummary
    motion/     Reveal, SplitText, ImageReveal, Parallax, Magnetic, CustomCursor,
                ScrollProgress, IntroLoader, easing tokens
  context/      CartContext, WishlistContext (localStorage), UIContext (drawer/menu/search)
  data/         products.js, categories.js, site.js, policies.js  ← all content lives here
  hooks/        useLocalStorage, useLockBodyScroll
  pages/        one file per route
  routes/       AppRoutes (lazy-loaded pages)
  styles/       index.css — brand design tokens
  utils/        format, images, products (filter/sort), validation
```

## Swapping in real data

`src/data/products.js` exports helper functions (`getAllProducts`, `getProductBySlug`,
`getFeaturedProducts`, …). Replace their bodies with API calls and the UI keeps working.
The cart stores only `{ id, size, qty }` and resolves product data from the catalogue.

## Design system

Defined in `src/styles/index.css`. The default Tailwind palette is disabled; only brand
colours exist (`blue`, `ink`, `graphite`, `mist`, `white`, plus `danger` for form errors).
Use opacity modifiers (`text-ink/60`) for shades.

Type: Poppins ExtraBold for display, Instrument Serif italic (`.accent`) for editorial
accents, `.label` for small campaign tags. Display sizes scale with the viewport.

## Motion

All animation is Framer Motion, using shared tokens in `components/motion/easing.js`.
Scroll effects (parallax, drifting headlines, the "Explore the drop" band) are scroll-*linked*
transforms. Native scrolling is never hijacked, so GSAP/ScrollTrigger and Lenis weren't
needed and aren't installed. `<MotionConfig reducedMotion="user">` plus per-component checks
turn motion off for people with "reduce motion" enabled. The custom cursor only renders on
fine-pointer devices, and the native cursor is kept. The intro curtain plays once per session
and can be skipped with a click or key press.

## Simulated features

Checkout, newsletter and the contact form validate fully but do not send data anywhere.
No payment is taken. Hook them up in `pages/Checkout.jsx`, `components/layout/NewsletterForm.jsx`
and `pages/Contact.jsx`.

## Deploying

SPA rewrites are included for Netlify (`public/_redirects`) and Vercel (`vercel.json`).

Product photography is from Unsplash, for development only — replace with real product
shots before launch. Policy pages in `src/data/policies.js` are a starting draft.
# gully-rack
# gully-rack
