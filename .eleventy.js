import { DateTime } from 'luxon';
import processSass from './utils/css-processing.js';
import markdown from 'markdown-it';
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";


export default function(eleventyConfig) {
  // Process SASS when the site is being built
  eleventyConfig.on('eleventy.after', processSass);
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPlugin(feedPlugin, {
		type: "atom", // or "rss", "json"
		outputPath: "/atom.xml",
		collection: {
			name: "posts", // iterate over `collections.posts`
			limit: 0,     // 0 means no limit
		},
		metadata: {
			language: "en",
			title: "CodeMade Blog",
			subtitle: "Free software & tech musings",
			base: "https://codemade.net/blog/",
			author: {
				name: "Loris Bognanni"
			}
		}
	});

  
  // Pass through files
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("assets/js");
  eleventyConfig.addPassthroughCopy("assets/css/*.css");
  eleventyConfig.addPassthroughCopy("{,!(_site)!(_site2)/**/}*.png");
  eleventyConfig.addPassthroughCopy("*.png");
  eleventyConfig.addPassthroughCopy("*.jpg");
  eleventyConfig.addPassthroughCopy("*.svg");
  eleventyConfig.addPassthroughCopy("*.ico");
  
  // Add custom filters
  eleventyConfig.addFilter("isNotEmpty", function(value) {
    if (typeof value === 'string') {
      return value.trim() !== '';
    } else if (value !== undefined && value !== null && typeof value === 'object') {
      return Object.keys(value).length > 0;
    }
    return !!value;
  });
  
  eleventyConfig.addFilter("relativeUrl", function(url) {
    if (url?.startsWith('http://')) {
      return url;
    }
    if (url?.startsWith('https://')) {
      return url;
    }
    return url?.startsWith('/') ? url : '/' + url;
  });
  
  eleventyConfig.addFilter("absoluteUrl", function(url, base) {
    const baseUrl = base || 'https://codemade.net';
    if (url?.startsWith('http')) {
      return url;
    }
    return baseUrl + (url?.startsWith('/') ? url : '/' + url);
  });
  
  eleventyConfig.addFilter("formatDate", function(dateObj, format) {
    if (format === 'short') {
      return DateTime.fromJSDate(dateObj).toFormat('LLLL d, yyyy');
    } else {
      return DateTime.fromJSDate(dateObj).toFormat('cccc, LLLL d, yyyy');
    }
  });
  
  const md = markdown({
    html: true,
    breaks: true,
    linkify: true    
  });
  
  eleventyConfig.addFilter("markdownify", function(content) {
    return md.render(content || '');
  });
  
  eleventyConfig.addFilter("slice", function(array, start, end) {
    return Array.isArray(array) ? array.slice(start, end) : [];
  });
  
  eleventyConfig.addFilter("striptags", function(str) {
    return str ? String(str).replace(/<[^>]*>/g, '') : '';
  });
  
  eleventyConfig.addFilter("trim", function(str) {
    return str ? String(str).trim() : '';
  });

  // Create collections for blog posts
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("blog/**/*.md");
  });
  

  console.log("Eleventy config loaded");
  
  // Set directories
  return {
    dir: {
      input: ".",
      output: "_site2",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data"
    },
    templateFormats: ["html", "md", "njk"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
}