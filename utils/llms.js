// Markdown versions of the site's pages, for LLMs and other text-only readers
// (see https://llmstxt.org). Each HTML page at /foo/ gets a twin at /foo.md.
import fs from 'fs';

const BASE_URL = 'https://codemade.net';

const stripTags = (str) => String(str ?? '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

const absoluteUrl = (url) => {
  if (!url || /^[a-z]+:/i.test(url) || url.startsWith('#')) return url;
  return BASE_URL + (url.startsWith('/') ? url : '/' + url);
};

// Rewrite root-relative and bare relative links/images in markdown to absolute URLs.
const absolutizeLinks = (md) =>
  String(md ?? '')
    .replace(/(\]\()([^)\s]+)/g, (_, open, url) => open + absoluteUrl(url))
    .replace(/(\b(?:src|href)=["'])([^"']+)/g, (_, attr, url) => attr + absoluteUrl(url));

const stripFrontMatter = (src) => src.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');

// Twin URL for an HTML page: / -> /index.md, /blog/foo/ -> /blog/foo.md
export function llmsUrl(url) {
  if (!url || !url.endsWith('/')) return null;
  return url === '/' ? '/index.md' : url.replace(/\/$/, '.md');
}

// Link to the markdown twin of an internal page (e.g. /clock -> https://codemade.net/clock.md);
// external links are returned unchanged.
export function llmsLink(url) {
  if (!url || !url.startsWith('/')) return url;
  const path = url.replace(/[?#].*$/, '');
  return absoluteUrl(llmsUrl(path.endsWith('/') ? path : path + '/'));
}

// Pages that get a markdown twin: real HTML pages that aren't opted out of the sitemap.
export function llmsPages(collection) {
  return (collection || []).filter((p) => llmsUrl(p.url) && p.data.sitemap !== false && p.data.llms !== false);
}

const renderActions = (actions) =>
  (actions || [])
    .filter((a) => a.url && !a.url.startsWith('#'))
    .map((a) => `- [${stripTags(a.label)}](${absoluteUrl(a.url)})`)
    .join('\n');

function renderSection(section, ctx) {
  const out = [];
  const title = stripTags(section.title);
  if (title) out.push(`## ${title}`);
  if (section.subtitle) out.push(stripTags(section.subtitle));
  if (section.content) out.push(absolutizeLinks(section.content.trim()));

  switch (section.type) {
    case 'section_features':
      out.push(
        (section.features || [])
          .map((f) => {
            const link = f.actions?.[0]?.url;
            const name = link ? `[${stripTags(f.title)}](${llmsLink(link)})` : stripTags(f.title);
            const tags = f.tags?.length ? ` (${f.tags.join(', ')})` : '';
            return `- ${name}${tags}: ${stripTags(f.content)}`;
          })
          .join('\n')
      );
      break;
    case 'section_faq':
      for (const item of section.faq_items || []) {
        out.push(`### ${stripTags(item.question)}`, absolutizeLinks(String(item.answer ?? '').trim()));
      }
      break;
    case 'section_gallery':
      out.push((section.gallery || []).map((g) => `- ![${g.alt || ''}](${absoluteUrl(g.image)})`).join('\n'));
      break;
    case 'section_posts':
      out.push(
        [...(ctx.posts || [])]
          .reverse()
          .slice(0, 5)
          .map((p) => `- [${p.data.title}](${absoluteUrl(llmsUrl(p.url))})${p.data.excerpt ? `: ${stripTags(p.data.excerpt)}` : ''}`)
          .join('\n')
      );
      break;
  }

  const actions = renderActions(section.actions);
  if (actions) out.push(actions);
  return out.filter(Boolean).join('\n\n');
}

// Render a page (an 11ty collection item) as a standalone markdown document.
export function llmsMarkdown(item, ctx = {}) {
  const data = item.data;
  const out = [`# ${stripTags(data.title || 'CodeMade')}`];

  const summary = data.subtitle || data.excerpt;
  if (summary) out.push(`> ${stripTags(summary)}`);

  const meta = [`Source: ${absoluteUrl(item.url)}`];
  if (data.layout === 'post') {
    meta.push(`Published: ${item.date.toISOString().slice(0, 10)}`, 'Author: Loris Bognanni');
  }
  out.push(meta.join('\n'));

  if (Array.isArray(data.sections)) {
    out.push(...data.sections.map((s) => renderSection(s, ctx)));
  } else if (data.layout === 'vibelet') {
    // Vibelets are interactive tools; the HTML body is the app itself, so only describe it.
    if (data.about) out.push(absolutizeLinks(data.about.trim()));
    out.push(`This is an interactive tool that runs in the browser: open ${absoluteUrl(item.url)} to use it.`);
  } else if (item.inputPath.endsWith('.md')) {
    out.push(absolutizeLinks(stripFrontMatter(fs.readFileSync(item.inputPath, 'utf8')).trim()));
  }

  if (data.layout === 'blog') {
    out.push(
      '## Posts',
      [...(ctx.posts || [])]
        .reverse()
        .map((p) => `- [${p.data.title}](${absoluteUrl(llmsUrl(p.url))}) (${p.date.toISOString().slice(0, 10)})`)
        .join('\n')
    );
  }

  return out.filter(Boolean).join('\n\n') + '\n';
}

export function llmsPlugin(eleventyConfig) {
  eleventyConfig.addFilter('llmsUrl', llmsUrl);
  eleventyConfig.addFilter('llmsLink', llmsLink);
  eleventyConfig.addFilter('llmsPages', llmsPages);
  eleventyConfig.addFilter('llmsMarkdown', llmsMarkdown);
}
