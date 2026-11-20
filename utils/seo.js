// SEO helpers: trailing-slash URLs, meta descriptions and JSON-LD structured data.
const BASE_URL = 'https://codemade.net';
const AUTHOR = { '@type': 'Person', name: 'Loris Bognanni', url: 'https://loris.codes' };

const absoluteUrl = (url) => {
  if (!url) return undefined;
  if (/^[a-z]+:/i.test(url)) return url;
  return BASE_URL + (url.startsWith('/') ? url : '/' + url);
};

const plainText = (str) =>
  String(str ?? '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // markdown links -> their text
    .replace(/<[^>]*>/g, '')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

// Internal page links get a trailing slash, so GitHub Pages doesn't answer them with a 301
// (/clock -> /clock/). Files (anything with an extension) and anchors are left alone.
export function withTrailingSlash(url) {
  if (!url || !url.startsWith('/')) return url;
  const [, path, rest] = url.match(/^([^?#]*)(.*)$/);
  const last = path.split('/').pop();
  if (path.endsWith('/') || last.includes('.')) return url;
  return path + '/' + rest;
}

// Up to `max` characters of whole sentences from the first paragraph of `text`.
export function summarize(text, max = 160) {
  const paragraph = plainText(String(text ?? '').trim().split(/\n\s*\n/)[0]);
  const sentences = paragraph.match(/[^.!?]+[.!?]+(\s|$)/g) || [paragraph];
  let out = '';
  for (const s of sentences) {
    if ((out + s).trim().length > max) break;
    out += s;
  }
  out = out.trim();
  // Too short to be a useful snippet: carry on into the rest of the paragraph, cut at a word.
  if (out.length < 100) {
    const cut = paragraph.slice(0, max - 1);
    out = cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:—-]+$/, '') + '…';
  }
  return out;
}

// Meta description for a page. A `description` in front matter always wins. Vibelets use their "about" text, which is far more
// descriptive than the short subtitle shown under the tool's title.
export function metaDescription(data, fallback) {
  if (data.description) return data.description;
  if (data.layout === 'vibelet' && data.about) return summarize(data.about);
  return data.subtitle || data.excerpt || fallback;
}

const isoDate = (date) => (date instanceof Date ? date.toISOString().slice(0, 10) : undefined);

const free = { '@type': 'Offer', price: '0', priceCurrency: 'USD' };

// JSON-LD for a page, or an empty string when there's nothing useful to say.
export function structuredData(data, page) {
  const url = absoluteUrl(page.url);
  const description = plainText(metaDescription(data, data.site?.tagline));
  const image = absoluteUrl(data.image);
  let ld;

  if (page.url === '/') {
    ld = {
      '@type': 'WebSite',
      name: data.site.title,
      url,
      description,
      author: AUTHOR,
    };
  } else if (data.layout === 'post') {
    ld = {
      '@type': 'BlogPosting',
      headline: plainText(data.title),
      description,
      image,
      datePublished: isoDate(page.date),
      author: AUTHOR,
      publisher: AUTHOR,
      url,
      mainEntityOfPage: url,
    };
  } else if (data.software) {
    const s = data.software;
    ld = {
      '@type': 'SoftwareApplication',
      name: s.name,
      description: s.description || description,
      applicationCategory: s.category,
      operatingSystem: s.os,
      downloadUrl: s.download,
      image,
      url,
      offers: free,
      author: AUTHOR,
    };
  } else if (data.layout === 'vibelet') {
    ld = {
      '@type': 'WebApplication',
      name: plainText(data.title),
      description,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript',
      url,
      offers: free,
      author: AUTHOR,
    };
  }

  if (!ld) return '';
  // Escape "<" so post text can never close the surrounding <script> tag.
  return JSON.stringify({ '@context': 'https://schema.org', ...ld }).replace(/</g, '\\u003c');
}

export function seoPlugin(eleventyConfig) {
  eleventyConfig.addFilter('withTrailingSlash', withTrailingSlash);
  eleventyConfig.addFilter('metaDescription', metaDescription);
  eleventyConfig.addFilter('structuredData', structuredData);
  eleventyConfig.addFilter('isoDate', isoDate);
}
