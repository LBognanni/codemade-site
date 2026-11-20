export default {
  title: "CodeMade",
  url: "https://codemade.net",
  // Social preview image for pages that don't set their own `image`.
  // A page can set `social_image` to use a different preview than its on-page `image`
  // (e.g. a PNG when the page image is an SVG, which most platforms won't render).
  default_image: "images/hero.png",
  baseurl: "",
  palette: "blue",
  tagline: "Software that is free, open, and personal. Made for [me](https://loris.codes), but shared with you.",
  header: {
    title: "CodeMade",
    logo_img: "images/logo-blur.svg",
    has_nav: true,
    nav_links: [
      {
        label: "Clock",
        url: "/clock/"
      },
      {
        label: "🕹️ Games!",
        url: "https://games.codemade.net",
        primary: true
      },
      {
        label: "Blog",
        url: "/blog/",
        primary: true
      }
    ]
  },
  footer: {
    logo_img: "images/logo-blur-white.svg",
    tagline: "Free software & tech musings",
    has_nav: false,
    nav_title: "Menu",
    nav_links: [
      {
        label: "Blog",
        url: "/blog/"
      }
    ],
    has_social: false,
    social_title: "Social",
    social_links: [
      {
        label: "Twitter",
        url: "https://twitter.com/lorisdev",
        new_window: true
      },
      {
        label: "Github",
        url: "https://github.com/lbognanni",
        new_window: true
      }
    ],
    has_subscribe: false,
    subscribe_title: "Subscribe",
    subscribe_content: "Stay up to date with our latest developments.",
    content: "Content &copy; [Loris Bognanni](https://loris.codes). All rights reserved. &middot; [Privacy Policy](/privacy/)"
  }
};