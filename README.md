# Mudiwala — Grocery Store

A Grocery-Lite-style online grocery shop for **Mudiwala** (মুদিওয়ালা), built with
React 19, Vite and Tailwind CSS v4.

The UI follows the reference theme's structure — announcement bar, search header,
category mega-menu, hero slider, trust strip, tabbed featured carousel, promo
banners, filterable product grid, newsletter and footer — but with a bespoke
identity, a warm cream/emerald palette and real photographs.

## Run it

```bash
npm install
npm run dev      # http://127.0.0.1:5180
npm run build    # production build into dist/
npm run preview  # serve the production build
```

## What's inside

| Area | Details |
| --- | --- |
| **42 products** | Five categories — vegetables & fruits, dairy & eggs, rice/dal/oil, personal care, snacks & drinks. Each has price, discount price, unit, rating, review count, origin, badge and purchasable variants. |
| **Real photos** | Every product, slide and banner uses a real photograph served from `public/images`. No placeholder art. |
| **Hero slider** | Autoplay (6 s) with progress bar, arrows, dots, keyboard arrows, touch swipe and a Ken Burns drift. Pauses on hover. |
| **Cart** | Sliding drawer with quantity steppers, remove, free-delivery progress meter, subtotal, delivery charge and total. Persists to `localStorage`. |
| **Checkout** | Delivery slot, address form, area picker, three payment methods, then an order-confirmation modal. |
| **Quick view** | Modal with large photo, variant picker, stock badge and quantity controls. |
| **Wishlist** | Toggle from any card or quick view; separate drawer with add-to-cart. |
| **Search** | Live results in the header for both Bengali and English names. |
| **Bilingual** | Full Bengali ⇄ English switch. Bengali copy uses the Hind Siliguri web font. |
| **Responsive** | Desktop mega-menu and grids; mobile bottom navigation, drawers and a floating cart pill. |

## Image pipeline

Product and hero photographs are pulled from **Wikimedia Commons** with
`scripts/fetch-images.mjs` and `scripts/fetch-hero-images.mjs`. Each download
records its author and licence in `public/images/credits.json`, which is what
the footer credits link points at.

```bash
node scripts/fetch-images.mjs        # product catalogue photos
node scripts/fetch-hero-images.mjs   # slides + banners at hero resolution
```

Both scripts are idempotent — re-run them to repair or refresh the photo set.
Every `<img>` in the UI also has an `onError` fallback, so a missing file
degrades to a brand gradient rather than a broken-image icon.

## Layout

```
src/
  App.jsx                 page composition and shared state
  components/
    Header.jsx            announcement bar, logo, area picker, search, cart
    CategoryNav.jsx       inline category bar + mega-menu
    HeroSlider.jsx        the autoplaying hero
    FeatureStrip.jsx      four trust/highlight blocks
    FeaturedTabs.jsx      tabbed "Big Featured Slider" carousel
    ProductRail.jsx       horizontally scrolling product rail
    ProductCard.jsx       product tile with hover actions
    ProductGrid.jsx       filterable, sortable catalogue grid
    PromoBanners.jsx      two promo banners
    CartDrawer.jsx        side cart
    QuickViewModal.jsx    product detail modal
    OrderModal.jsx        checkout form + order confirmation
    MobileNav.jsx         mobile bottom bar, menu and wishlist drawers
    Footer.jsx            newsletter, links, payments
    Toast.jsx             transient notifications
  data/
    catalog.js            products, slides, promo banners
    categories.js         category taxonomy and badges
    copy.js               all bilingual UI copy
  hooks/useCart.js        cart + wishlist state, totals, free-delivery rule
  lib/format.js           Taka formatting and discount maths
```

## Notes

- Prices are in Bangladeshi Taka (৳). Free delivery over ৳500, otherwise ৳60.
- Product photos are licensed under Creative Commons; see
  `public/images/credits.json` for per-image attribution.
