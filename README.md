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
| **Hero slider** | Autoplay (6 s) with progress bar, arrows, dots, keyboard arrows, touch swipe and a Ken Burns drift. Pauses on hover. Heights scale fluidly from 230 px on a 320 px phone to 520 px on a desktop. Each slide carries a scrim-backed copy overlay with a CTA. |
| **Cart** | Sliding drawer with quantity steppers, remove, free-delivery progress meter, subtotal, delivery charge and total. Persists to `localStorage`. |
| **Checkout** | Delivery slot, address form, area picker, three payment methods, then an order-confirmation modal. |
| **Quick view** | Modal with large photo, variant picker, stock badge and quantity controls. On phones the photo shrinks to a 16:10 band and the add-to-cart button moves into a sticky bar so it is never below the fold. |
| **Wishlist** | Toggle from any card or quick view; separate drawer with add-to-cart. |
| **Search** | Live results in the header for both Bengali and English names. |
| **Bilingual** | Full Bengali ⇄ English switch. Bengali copy uses the self-hosted Nikosh font (see *Fonts* below). |
| **Responsive** | Desktop mega-menu and grids below `lg`; phones get a five-tab app shell. |
| **Checkout** | Delivery slot, address form, area picker, three payment methods, then an order-confirmation modal. The form scrolls under a sticky footer so *Place order* is always in reach. |

## Responsive layout

The layout switches at the `lg` breakpoint (1024 px). Below it the site is a
tabbed app rather than one long page, because scrolling a 42-item catalogue
past a bottom bar is slow on a phone.

| Width | Layout |
| --- | --- |
| `< 1024 px` | Tabbed app shell — Home, Categories, Search, Account and Cart are separate views swapped by the bottom bar. Cart and wishlist become full views instead of drawers. |
| `≥ 1024 px` | Single scrolling page — hero, trust strip, featured tabs, filterable grid, footer — with the cart and wishlist as side drawers. |

`useIsMobile()` (`src/hooks/useMediaQuery.js`) picks the layout, so only one
of the two trees is ever mounted and the two never duplicate element ids.

Supporting details:

- **Touch targets** — every interactive control in the card body, the tab bar
  and the slider dots is at least 30 px tall. Controls that used to be
  hover-only (quick view, wishlist, add to cart) are permanently visible on
  touch layouts, where they move into the card body instead of floating over
  the product photo.
- **Sticky actions** — the quick view and the checkout form both keep their
  primary button pinned to the bottom of the sheet, so nothing important sits
  below the fold on a short screen.
- **Compact forms** — delivery slots and payment methods collapse to a
  single row of three tiles on phones, using short labels (`আজ বিকাল` /
  `৪:০০ – ৬:০০`, `ক্যাশ`) with the full wording kept for wider screens.
- **Fluid grids** — the product grid and rails reflow from 2 columns on a
  320 px phone to 4 on a tablet, and the rail cards track the viewport width
  rather than a fixed pixel size.
- **Safe areas** — the bottom tab bar, floating cart pill, drawers and modal
  sheets clear the iPhone home indicator via `env(safe-area-inset-bottom)`.
- **No sideways scroll** — `scrollWidth` equals `clientWidth` at every
  breakpoint from 320 px to 1536 px; horizontal scrollers are opt-in per
  component.
- **Inputs stay 16 px on mobile** so iOS does not zoom the page on focus.

## Fonts

Bengla copy uses **Nikosh**, self-hosted from `public/fonts` because it is not
served by Google Fonts. The shipped files had a corrupted Windows `name`
table, which made Chrome's OTS sanitiser reject them outright — the browser
silently fell back to a system font and every Bangla string rendered with the
wrong metrics.

`scripts/fix-nikosh-font.py` rebuilds the `name` table from the intact
Macintosh records and regenerates the TTF, WOFF and WOFF2 files:

```bash
pip install fonttools brotli
python scripts/fix-nikosh-font.py
```

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
    ProductCard.jsx       product tile with hover and touch actions
    ProductGrid.jsx       filterable, sortable catalogue grid
    PromoBanners.jsx      two promo banners
    CartDrawer.jsx        side cart
    QuickViewModal.jsx    product detail modal
    OrderModal.jsx        checkout form + order confirmation
    MobileNav.jsx         mobile bottom tab bar, menu and wishlist drawers
    MobileViews.jsx       the five phone tab views + tab router
    Footer.jsx            newsletter, links, payments
    Toast.jsx             transient notifications
  data/
    catalog.js            products, slides, promo banners
    categories.js         category taxonomy and badges
    copy.js               all bilingual UI copy
  hooks/
    useCart.js            cart + wishlist state, totals, free-delivery rule
    useMediaQuery.js      layout switch between desktop page and phone tabs
  lib/format.js           Taka formatting and discount maths
```

## Notes

- Prices are in Bangladeshi Taka (৳). Free delivery over ৳500, otherwise ৳60.
- Product photos are licensed under Creative Commons; see
  `public/images/credits.json` for per-image attribution.
