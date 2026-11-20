/**
 * Re-fetches the hero slides and promo banners.
 *
 * Two rules drive the candidate selection:
 *   1. No people. Any title mentioning a person, crowd or vendor is rejected,
 *      so the shop always shows produce and shelves rather than faces.
 *   2. Wide enough to stay sharp full-bleed (thumbnails are pulled at 1920px).
 *
 * Usage: node scripts/fetch-hero-images.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'public', 'images');
const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'MudiwalaDemo/1.0 (local development project; contact: dev@example.com)';

/** Titles containing any of these describe a photo with people in it. */
const PEOPLE_WORDS = [
  'person',
  'people',
  'man',
  'woman',
  'men',
  'women',
  'boy',
  'girl',
  'child',
  'baby',
  'family',
  'crowd',
  'shopper',
  'shopping',
  'customer',
  'vendor',
  'worker',
  'staff',
  'tourist',
  'portrait',
  'chef',
  'cooking',
  'greengrocer',
  'street',
  'bustling',
  'busy night',
  'market stall',
  'stall',
  'historic',
  '1908',
  'nara',
  'grocer',
  'farmers market',
  'open air market',
  'auction',
  'queue',
  'soldier',
  'pizza',
  'pasta',
  'soup',
  'delicatessen',
  'seafood',
  'painting',
  'painter',
];

/** Titles that are unusable for a shop even without people. */
const BAD_WORDS = [
  'empty shelf',
  'empty aisle',
  'abandoned',
  'closed',
  'ruin',
  'demolish',
  'diagram',
  'map',
  'logo',
  'coat of arms',
  'poster',
  'screenshot',
];

const TARGETS = [
  {
    slug: 'slide-vegetables',
    dir: 'slides',
    width: 1920,
    queries: [
      'vibrant assortment of fresh vegetables -pizza -person -people',
      'fresh vegetables assortment plate -pizza -person -people',
      'vegetables and fruit on table -pizza -person -people',
      'assorted vegetables bowl -pizza -person -people',
    ],
    alt: 'assorted fresh vegetables arranged on a table',
  },
  {
    slug: 'slide-supermarket',
    dir: 'slides',
    width: 1920,
    queries: [
      'private label products store shelf -person -people -customer',
      'grocery store shelf products -person -people -customer',
      'shop shelves products packaging -person -people',
      'supermarket interior shelves products -person -people -empty',
    ],
    alt: 'supermarket shelves stocked with grocery products',
  },
  {
    slug: 'slide-basket',
    dir: 'slides',
    width: 1920,
    queries: [
      'wicker basket filled with fruit vegetables -person -people',
      'shopping basket groceries produce -person -people',
      'basket of vegetables on table -person -people',
      'wooden crate vegetables harvest -person -people',
    ],
    alt: 'basket filled with fresh fruit and vegetables',
  },
  {
    slug: 'banner-farm',
    dir: 'banners',
    width: 1600,
    queries: [
      'crates of vegetables wooden crates -person -people -market stall',
      'fruit crates display produce -person -people',
      'farm vegetables wooden box -person -people',
      'harvested vegetables in crates -person -people',
    ],
    alt: 'crates of fresh vegetables at a farm stand',
  },
  {
    slug: 'banner-pantry',
    dir: 'banners',
    width: 1600,
    queries: [
      'jars of preserves on shelf pantry -person -people -woman -man',
      'spice jars shelf kitchen -person -people',
      'shelf with food jars and containers -person -people',
      'pantry shelf food containers -person -people -nara',
    ],
    alt: 'pantry shelves lined with grocery jars',
  },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function stripHtml(value = '') {
  return value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function hasPeople(title) {
  const t = title.toLowerCase();
  return PEOPLE_WORDS.some((word) => t.includes(word));
}

function isUnusable(title) {
  const t = title.toLowerCase();
  return BAD_WORDS.some((word) => t.includes(word));
}

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

function score(item, query, wantLandscape) {
  const title = item.title.toLowerCase();
  const words = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3 && !w.startsWith('-'));
  let value = 0;
  for (const word of words) if (title.includes(word)) value += 2;
  if (/logo|icon|map|diagram|chart|portrait/i.test(title)) value -= 5;
  if (!item.width || !item.height) return value;
  const ratio = item.width / item.height;
  if (wantLandscape && ratio >= 1.35 && ratio <= 2.4) value += 5;
  if (!wantLandscape && ratio > 0.85 && ratio < 1.6) value += 3;
  if (item.width >= 2400) value += 3;
  else if (item.width >= 1600) value += 2;
  else if (item.width < 1000) value -= 3;
  return value;
}

async function search(query, width) {
  const data = await api({
    action: 'query',
    generator: 'search',
    gsrsearch: `filetype:bitmap ${query}`,
    gsrlimit: '20',
    gsrnamespace: '6',
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata',
    iiurlwidth: String(width),
  });
  const pages = data?.query?.pages ? Object.values(data.query.pages) : [];
  return pages
    .filter((page) => page.imageinfo?.[0]?.thumburl)
    .filter((page) => !hasPeople(page.title) && !isUnusable(page.title))
    .map((page) => {
      const info = page.imageinfo[0];
      const meta = info.extmetadata || {};
      return {
        title: page.title,
        thumburl: info.thumburl,
        width: info.width,
        height: info.height,
        artist: stripHtml(meta.Artist?.value || meta.Credit?.value || 'Unknown'),
        license: stripHtml(meta.LicenseShortName?.value || meta.UsageTerms?.value || 'See Commons'),
        licenseUrl: meta.LicenseUrl?.value || '',
        page: info.descriptionurl || '',
      };
    });
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length < 20000) throw new Error('file too small');
  await fs.writeFile(dest, buffer);
  return buffer.length;
}

async function main() {
  const creditsPath = path.join(OUT_DIR, 'credits.json');
  const credits = JSON.parse(await fs.readFile(creditsPath, 'utf8'));

  // Optional argument re-fetches a single target: node scripts/fetch-hero-images.mjs slide-basket
  const only = process.argv[2];
  const targets = only ? TARGETS.filter((target) => target.slug === only) : TARGETS;
  if (only && targets.length === 0) {
    console.log(`unknown target: ${only}`);
    return;
  }

  for (const target of targets) {
    const landscape = target.dir === 'slides';
    let saved = false;

    for (const query of target.queries) {
      const candidates = await search(query, target.width);
      candidates.sort((a, b) => score(b, query, landscape) - score(a, query, landscape));

      for (const candidate of candidates.slice(0, 8)) {
        const ext = candidate.title.toLowerCase().endsWith('.png') ? 'png' : 'jpg';
        const file = path.join(OUT_DIR, target.dir, `${target.slug}.${ext}`);
        try {
          const bytes = await download(candidate.thumburl, file);
          const otherExt = ext === 'png' ? 'jpg' : 'png';
          await fs.rm(path.join(OUT_DIR, target.dir, `${target.slug}.${otherExt}`), {
            force: true,
          });
          credits[target.slug] = {
            title: candidate.title,
            artist: candidate.artist,
            license: candidate.license,
            licenseUrl: candidate.licenseUrl,
            source: candidate.page,
            alt: target.alt,
            sourceWidth: candidate.width,
            sourceHeight: candidate.height,
          };
          console.log(
            `+ ${target.slug} (${candidate.width}x${candidate.height}) -> ${target.dir}/${target.slug}.${ext} ${Math.round(bytes / 1024)} KB\n    ${candidate.title}`,
          );
          saved = true;
          break;
        } catch {
          /* try the next candidate */
        }
      }
      if (saved) break;
    }

    if (!saved) console.log(`! could not replace ${target.slug}`);
  }

  await fs.writeFile(creditsPath, JSON.stringify(credits, null, 2), 'utf8');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
