import React from 'react';
import { DateTime } from 'luxon';
import markdown from 'markdown-it';

const md = markdown({
  html: true,
  breaks: true,
  linkify: true
});

// Equivalent to isNotEmpty filter
export const isNotEmpty = (value) => {
  if (typeof value === 'string') {
    return value.trim() !== '';
  } else if (value !== undefined && value !== null && typeof value === 'object') {
    return Object.keys(value).length > 0;
  }
  return !!value;
};

// Equivalent to relativeUrl filter
export const relativeUrl = (url) => {
  if (!url) return '/';
  return url.startsWith('/') ? url : '/' + url;
};

// Equivalent to absoluteUrl filter
export const absoluteUrl = (url, base = 'https://codemade.net') => {
  if (!url) return base;
  if (url.startsWith('http')) {
    return url;
  }
  return base + (url.startsWith('/') ? url : '/' + url);
};

// Equivalent to formatDate filter
export const formatDate = (dateObj, format) => {
  if (!dateObj) return '';
  
  const date = typeof dateObj === 'string' ? new Date(dateObj) : dateObj;
  
  if (format === 'short') {
    return DateTime.fromJSDate(date).toFormat('LLLL d, yyyy');
  } else {
    return DateTime.fromJSDate(date).toFormat('cccc, LLLL d, yyyy');
  }
};

// Equivalent to markdownify filter
export const markdownify = (content) => {
  return md.render(content || '');
};

// Equivalent to renderMarkdown with React
export const renderMarkdown = (content) => {
  if (!content) return null;
  return React.createElement('div', { 
    dangerouslySetInnerHTML: { __html: markdownify(content) } 
  });
};

// Equivalent to striptags filter
export const striptags = (str) => {
  return str ? String(str).replace(/<[^>]*>/g, '') : '';
};

// Helpers for conditional rendering in JSX
export const when = (condition, component) => {
  return condition ? component : null;
};

export const forIf = (items, condition, renderFn) => {
  if (!items || !Array.isArray(items)) return null;
  return items.filter(condition).map(renderFn);
};
