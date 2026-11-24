/**
 * Category taxonomy. Colours are the produce-stand palette so every row of
 * the shop reads as a different stall rather than one flat green grid.
 */
export const CATEGORIES = [
  {
    id: 'all',
    bn: 'সব পণ্য',
    en: 'All Products',
    accent: 'brand',
    icon: 'grid',
  },
  {
    id: 'vegetables-fruits',
    bn: 'সবজি ও ফল',
    en: 'Vegetables & Fruits',
    accent: 'lime',
    icon: 'carrot',
    blurb: { bn: 'স্থানীয় খামারের তাজা ফসল', en: 'Straight from local farms' },
  },
  {
    id: 'dairy-eggs',
    bn: 'দুধ ও ডিম',
    en: 'Dairy & Eggs',
    accent: 'sky',
    icon: 'milk',
    blurb: { bn: 'প্রতিদিনের দুধ, ডিম ও দুগ্ধজাত', en: 'Daily milk, eggs & dairy' },
  },
  {
    id: 'grocery-staples',
    bn: 'চাল, ডাল ও তেল',
    en: 'Rice, Dal & Oil',
    accent: 'turmeric',
    icon: 'wheat',
    blurb: { bn: 'মূল ভাত ও রান্নার সামগ্রী', en: 'Everyday staples' },
  },
  {
    id: 'personal-care',
    bn: 'পার্সোনাল কেয়ার',
    en: 'Personal Care',
    accent: 'plum',
    icon: 'sparkles',
    blurb: { bn: 'আপনার দৈনন্দিন যত্নের সবকিছু', en: 'Everyday care essentials' },
  },
  {
    id: 'snacks-drinks',
    bn: 'নাস্তা ও পানীয়',
    en: 'Snacks & Drinks',
    accent: 'berry',
    icon: 'cup',
    blurb: { bn: 'খাওয়ার ঝুড়ি ও ঠান্ডা পানীয়', en: 'Bites and cold drinks' },
  },
];

/** Tag shown on the product card corner. */
export const BADGES = {
  fresh: { bn: 'তাজা', en: 'Fresh', tone: 'lime' },
  organic: { bn: 'অর্গানিক', en: 'Organic', tone: 'lime' },
  bestseller: { bn: 'বেস্টসেলার', en: 'Best Seller', tone: 'mango' },
  premium: { bn: 'প্রিমিয়াম', en: 'Premium', tone: 'plum' },
  staple: { bn: 'স্ট্যাপল', en: 'Staple', tone: 'turmeric' },
  new: { bn: 'নতুন', en: 'New', tone: 'sky' },
  chilled: { bn: 'ঠান্ডা', en: 'Chilled', tone: 'sky' },
};

/** Small icon used on the "big featured" tab strip. */
export const CATEGORY_ICONS = {
  carrot: '🥕',
  milk: '🥛',
  wheat: '🌾',
  sparkles: '🧴',
  cup: '☕',
  grid: '🧺',
};

/** Distinct color palette for each category icon badge */
export const CATEGORY_THEMES = {
  all: {
    bg: 'bg-amber-100',
    border: 'border-amber-300/80',
    ring: 'ring-amber-300/60',
    text: 'text-amber-800',
    badge: 'bg-gradient-to-br from-amber-50 to-amber-100/90 text-amber-800 border border-amber-300/70 shadow-xs',
    hoverBg: 'hover:bg-amber-50/80',
  },
  'vegetables-fruits': {
    bg: 'bg-emerald-100',
    border: 'border-emerald-300/80',
    ring: 'ring-emerald-300/60',
    text: 'text-emerald-800',
    badge: 'bg-gradient-to-br from-emerald-50 to-emerald-100/90 text-emerald-800 border border-emerald-300/70 shadow-xs',
    hoverBg: 'hover:bg-emerald-50/80',
  },
  'dairy-eggs': {
    bg: 'bg-sky-100',
    border: 'border-sky-300/80',
    ring: 'ring-sky-300/60',
    text: 'text-sky-800',
    badge: 'bg-gradient-to-br from-sky-50 to-sky-100/90 text-sky-800 border border-sky-300/70 shadow-xs',
    hoverBg: 'hover:bg-sky-50/80',
  },
  'grocery-staples': {
    bg: 'bg-orange-100',
    border: 'border-orange-300/80',
    ring: 'ring-orange-300/60',
    text: 'text-orange-800',
    badge: 'bg-gradient-to-br from-orange-50 to-orange-100/90 text-orange-800 border border-orange-300/70 shadow-xs',
    hoverBg: 'hover:bg-orange-50/80',
  },
  'personal-care': {
    bg: 'bg-pink-100',
    border: 'border-pink-300/80',
    ring: 'ring-pink-300/60',
    text: 'text-pink-800',
    badge: 'bg-gradient-to-br from-pink-50 to-pink-100/90 text-pink-800 border border-pink-300/70 shadow-xs',
    hoverBg: 'hover:bg-pink-50/80',
  },
  'snacks-drinks': {
    bg: 'bg-purple-100',
    border: 'border-purple-300/80',
    ring: 'ring-purple-300/60',
    text: 'text-purple-800',
    badge: 'bg-gradient-to-br from-purple-50 to-purple-100/90 text-purple-800 border border-purple-300/70 shadow-xs',
    hoverBg: 'hover:bg-purple-50/80',
  },
};
