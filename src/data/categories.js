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
