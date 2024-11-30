---
title: Modern CSS is awesome!
author: _data/authors/loris-bognanni.yaml
excerpt: >-
  A look at some of the most interesting features of modern CSS, and how they can be used to create beautiful and responsive designs with very few lines of code.
date: '2024-11-25'
thumb_image: images/blocks_sm.png
image: images/blocks.png
layout: post
---

The last time I seriously worked with CSS was back when Firefox was still a relevant browser (😢), and Internet Explorer 11 was _just_ on its way out.

Flexbox had just become a popular way to create layouts, and CSS Grid was new and exciting, but not yet widely supported.
Not that I could use either, since IE's implementation of flexbox was so riddled with bugs that it was practically unusable.

But now. We're in 2024, and things have changed. A lot.

Here are a few of my favourite features of modern CSS, in no particular order:

### CSS Variables

CSS variables were once only possible with a preprocessor like SASS or LESS, but now they're a native feature of CSS.

Here is how to define a variable:
  
```css
:root {
  --primary-color: #ff0000;
}
```
Specifying the variable at the root level makes it available to the entire document.

The variable can then be used with the `var()` function:
  
```css 
div {
  color: var(--primary-color);
}
```

The neat thing is that variables follow the cascading logic of CSS, so you can update their value at any level of the document, and all elements that use that variable will automatically update.

<p class="codepen" data-height="300" data-default-tab="css,result" data-slug-hash="XJrJvom" data-pen-title="CSS Variables" data-user="codemade" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/codemade/pen/XJrJvom">
  CSS Variables</a> by Loris Bognanni (<a href="https://codepen.io/codemade">@codemade</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

### Nesting in CSS

This is again one of those things that you would have needed a CSS preprocessor for in the past, but is now a native feature of CSS. Useful for keeping your code concise and readable.

```scss
.parent {
  color: red;
  .child {
    color: blue;
  }
}
```

I especially find this useful when styling pseudo-elements and states:

```scss
button {
  background-color: blue;
  &:hover {
    background-color: red;
  }
  &:after {
    content: '🚀';
  }
}

```

### Centering a `div` is now very easy

Centerig a `div` has long been a recurring joke amongst web developers, but thanks to CSS Grid, it's now a two-liner:

```css
div.parent {
  display: grid;
  place-items: center;
}
```

### Viewport units

Viewport units are a way to size elements based on the size of the viewport. They are particularly useful for creating responsive designs.

Viewport units include `vw` (viewport width), `vh` (viewport height), `vmin` (the smaller of the two), and `vmax` (the larger of the two). So for example, if you want an element to be half as wide as the viewport, you can do this:

```css
.my-element {
  width: 50vw;
}
```

Here is an example that combines viewport units and CSS Grid to center a div in the middle of the screen:

<p class="codepen" data-height="300" data-default-tab="css,result" data-slug-hash="JoPogQW" data-pen-title="centering" data-user="codemade" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/codemade/pen/JoPogQW">
  centering</a> by Loris Bognanni (<a href="https://codepen.io/codemade">@codemade</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

### Math in CSS

CSS has a `calc()` function that allows you to perform calculations right in your stylesheets. This can be useful for things like calculating widths, margins, and padding.

The exciting thing about `calc()` is that it can combine different units of measurement, so you can do things like this:

```css
.my-element {
  width: calc(50% - 20px);
}
```

You can of course use `calc()` with variables as well:

```scss
:root {
  --margin: 20px;
}
article {
  margin: calc(var(--margin) * 2);
}
```

### CSS Containers, container queries, and container measurements

By telling CSS that a certain element is a `container`, you can now do things like size its children based on the container's size, or apply styles based on the container's size.

Similar to viewport units, container units are based on the size of the container element. They include `cqw`, `cqh`, `cqmin`, and `cqmax`.

<p class="codepen" data-height="300" data-default-tab="css,result" data-slug-hash="wBwawvN" data-pen-title="Untitled" data-user="codemade" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/codemade/pen/wBwawvN">
  Untitled</a> by Loris Bognanni (<a href="https://codepen.io/codemade">@codemade</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

[Container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries) take this a step further by allowing you to apply styles based on the size of the container. This is particularly useful for creating responsive designs where the layout changes based on the size of the container, rather than the viewport.


### `aspect-ratio` property

If you ever wanted to embed a video in your responsive page in the old days, you probably had to use some javascript to calculate the correct height based on the width of the video. 

But now, you can use the `aspect-ratio` property:

```scss
.video {
  width: 100%;
  aspect-ratio: 16 / 9;
}
```

### `:has()` selector

The `:has()` selector allows you to select an element based on its descendants. This can be useful for styling elements based on their content, or for selecting elements that contain a specific child element.

While before `:has` you would have to use javascript or some sort of preprocessing to achieve the same effect, now you can do it with a single line of CSS.

For example, here is a simple way to style a `<label>` element when its child `<input>` is checked:

<p class="codepen" data-height="200" data-default-tab="css,result" data-slug-hash="gbYpbgG" data-pen-title=":has demo" data-user="codemade" style="height: 200px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/codemade/pen/gbYpbgG">
  :has demo</a> by Loris Bognanni (<a href="https://codepen.io/codemade">@codemade</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

---


<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>