/**
 * Downloads real, freely-licensed photographs from Wikimedia Commons for the
 * Mudiwala catalogue. Every download records its author + licence so the
 * credits file can be shipped with the site.
 *
 * Usage: node scripts/fetch-images.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'public', 'images');
const CREDITS_FILE = path.join(OUT_DIR, 'credits.json');
const API = 'https://commons.wikimedia.org/w/api.php';

const UA = 'MudiwalaDemo/1.0 (local development project; contact: dev@example.com)';

/* ----------------------------------------------------------- catalogue map */
const PRODUCTS = [
  { slug: 'cabbage', q: 'cabbage vegetable fresh', alt: 'cabbage vegetable' },
  { slug: 'peas', q: 'green peas pods vegetable', alt: 'green peas' },
  { slug: 'watermelon', q: 'watermelon whole sliced', alt: 'watermelon' },
  { slug: 'avocado', q: 'avocado fruit halved', alt: 'avocado' },
  { slug: 'potato', q: 'potatoes tuber raw', alt: 'potatoes' },
  { slug: 'grapes', q: 'green grapes bunch', alt: 'grapes' },
  { slug: 'cherries', q: 'cherries red fruit', alt: 'cherries' },
  { slug: 'banana', q: 'bananas bunch yellow', alt: 'bananas' },
  { slug: 'green-chilli', q: 'green chili pepper vegetable', alt: 'green chilli' },
  { slug: 'broccoli', q: 'broccoli vegetable fresh', alt: 'broccoli' },
  { slug: 'capsicum', q: 'bell pepper capsicum vegetable', alt: 'capsicum' },
  { slug: 'lettuce', q: 'lettuce head green salad', alt: 'lettuce' },
  { slug: 'corn', q: 'sweet corn cob', alt: 'sweet corn' },
  { slug: 'tomatoes', q: 'tomatoes red fresh', alt: 'tomatoes' },
  { slug: 'apples', q: 'apples fruit basket tree', alt: 'apples' },
  { slug: 'onion', q: 'onions bulb vegetable', alt: 'onions' },
  { slug: 'carrot', q: 'carrots bunch fresh', alt: 'carrots' },
  { slug: 'ginger', q: 'ginger root fresh', alt: 'ginger' },
  { slug: 'milk-powder', q: 'milk powder glass', alt: 'milk powder' },
  { slug: 'yogurt', q: 'yogurt bowl dairy', alt: 'yogurt' },
  { slug: 'milk', q: 'milk bottle glass dairy', alt: 'milk' },
  { slug: 'butter', q: 'butter block dairy', alt: 'butter' },
  { slug: 'cheese', q: 'cheddar cheese slices', alt: 'cheese' },
  { slug: 'eggs', q: 'chicken eggs basket', alt: 'eggs' },
  { slug: 'rice', q: 'rice grains bowl white', alt: 'rice' },
  { slug: 'mustard-oil', q: 'rapeseed oil bottle', alt: 'mustard oil' },
  { slug: 'lentil', q: 'red lentils dal pulses', alt: 'lentils' },
  { slug: 'sugar', q: 'white sugar bowl', alt: 'sugar' },
  { slug: 'flour', q: 'wheat flour bowl', alt: 'flour' },
  { slug: 'spices', q: 'spices bowls masala', alt: 'spices' },
  { slug: 'soap', q: 'bar soap washing', alt: 'soap' },
  { slug: 'shampoo', q: 'shampoo bottle hair care', alt: 'shampoo' },
  { slug: 'toothpaste', q: 'toothpaste tube dental', alt: 'toothpaste' },
  { slug: 'hair-oil', q: 'coconut oil bottle', alt: 'hair oil' },
  { slug: 'mini-chips', q: 'potato chips snack bag', alt: 'chips' },
  { slug: 'walnuts', q: 'walnuts kernels nuts', alt: 'walnuts' },
  { slug: 'cashews', q: 'cashew nuts kernels', alt: 'cashews' },
  { slug: 'bite-size', q: 'biscuit cookies snack', alt: 'biscuits' },
  { slug: 'juice', q: 'fruit juice glass bottle', alt: 'juice' },
  { slug: 'coco-shake', q: 'chocolate milkshake glass', alt: 'milkshake' },
  { slug: 'tea', q: 'black tea leaves cup', alt: 'tea' },
  { slug: 'honey', q: 'honeycomb honey dipper', alt: 'honey' },
];

const SLIDES = [
  { slug: 'slide-vegetables', q: 'fresh vegetables market stall assortment', alt: 'fresh vegetables' },
  { slug: 'slide-supermarket', q: 'supermarket aisle groceries shelves', alt: 'supermarket aisle' },
  { slug: 'slide-basket', q: 'grocery basket full of food', alt: 'grocery basket' },
];

const BANNERS = [
  { slug: 'banner-farm', q: 'farmers market produce stall colorful', alt: 'farmers market' },
  { slug: 'banner-pantry', q: 'kitchen pantry jars shelves', alt: 'pantry shelves' },
];

const ALL = [...PRODUCTS, ...SLIDES, ...BANNERS];

/* ----------------------------------------------------------------- helpers */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(params) {
  const url = `${API}?${new URLSearchParams({ format: 'json', origin: '*', ...params })}`;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (attempt === 3) throw err;
      await sleep(900 * (attempt + 1));
    }
  }
  return null;
}

function stripHtml(value = '') {
  return value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function scoreCandidate(item, query) {
  const title = item.title.toLowerCase();
  const words = query.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  let score = 0;
  for (const word of words) if (title.includes(word)) score += 2;
  if (/logo|icon|map|diagram|chart|coat of arms|seal|flag/i.test(title)) score -= 6;
  if (item.width && item.height) {
    const ratio = item.width / item.height;
    if (ratio > 0.6 && ratio < 1.9) score += 2;
    if (item.width >= 1200) score += 1;
  }
  return score;
}

async function searchImage(query, limit = 18) {
  const data = await api({
    action: 'query',
    generator: 'search',
    gsrsearch: `filetype:bitmap ${query}`,
    gsrlimit: String(limit),
    gsrnamespace: '6',
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata',
    iiurlwidth: '900',
  });
  const pages = data?.query?.pages ? Object.values(data.query.pages) : [];
  return pages
    .filter((p) => p.imageinfo?.[0]?.thumburl)
    .map((p) => {
      const info = p.imageinfo[0];
      const meta = info.extmetadata || {};
      return {
        title: p.title,
        thumburl: info.thumburl,
        width: info.width,
        height: info.height,
        artist: stripHtml(meta.Artist?.value || meta.Credit?.value || 'Unknown'),
        license: stripHtml(meta.LicenseShortName?.value || meta.UsageTerms?.value || 'See Commons'),
        licenseUrl: meta.LicenseUrl?.value || '',
        page: info.descriptionurl || '',
        score: scoreCandidate(p, query),
      };
    })
    .sort((a, b) => b.score - a.score);
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`download HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length < 3000) throw new Error('suspiciously small file');
  await fs.writeFile(dest, buffer);
  return buffer.length;
}

async function runPool(items, worker, limit = 5) {
  const queue = [...items];
  const results = new Map();
  const runners = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length) {
      const item = queue.shift();
      try {
        results.set(item.slug, await worker(item));
      } catch (err) {
        results.set(item.slug, { error: err.message });
      }
    }
  });
  await Promise.all(runners);
  return results;
}

async function main() {
  await fs.mkdir(path.join(OUT_DIR, 'products'), { recursive: true });
  await fs.mkdir(path.join(OUT_DIR, 'slides'), { recursive: true });
  await fs.mkdir(path.join(OUT_DIR, 'banners'), { recursive: true });

  const credits = {};

  await runPool(
    ALL,
    async (item) => {
      const candidates = await searchImage(item.q);
      const sub = item.slug.startsWith('slide')
        ? 'slides'
        : item.slug.startsWith('banner')
          ? 'banners'
          : 'products';
      for (const candidate of candidates.slice(0, 6)) {
        const ext = candidate.title.toLowerCase().endsWith('.png') ? 'png' : 'jpg';
        const file = path.join(OUT_DIR, sub, `${item.slug}.${ext}`);
        try {
          const bytes = await download(candidate.thumburl, file);
          credits[item.slug] = {
            title: candidate.title,
            artist: candidate.artist,
            license: candidate.license,
            licenseUrl: candidate.licenseUrl,
            source: candidate.page,
            alt: item.alt,
          };
          console.log(`+ ${item.slug} -> ${sub}/${item.slug}.${ext} (${Math.round(bytes / 1024)} KB)`);
          return { file: `${sub}/${item.slug}.${ext}`, bytes };
        } catch {
          /* try the next candidate */
        }
      }
      throw new Error('no usable candidate');
    },
    5,
  );

  await fs.writeFile(CREDITS_FILE, JSON.stringify(credits, null, 2), 'utf8');
  console.log(`\nSaved ${Object.keys(credits).length}/${ALL.length} images.`);
  const missing = ALL.filter((i) => !credits[i.slug]).map((i) => i.slug);
  if (missing.length) console.log('Missing:', missing.join(', '));
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
