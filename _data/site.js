export default {
  title: "CodeMade",
  url: "https://codemade.net",
  baseurl: "",
  palette: "blue",
  header: {
    title: "CodeMade",
    logo_img: "images/logo-blur.svg",
    has_nav: true,
    nav_links: [
      {
        label: "Home",
        url: "/"
      },
      {
        label: "Clock",
        url: "/clock"
      },
      {
        label: "🕹️ Games!",
        url: "https://games.codemade.net",
        primary: true
      },
      {
        label: "Blog",
        url: "/blog",
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
        url: "/blog"
      }
    ],
    has_social: true,
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
    content: "Content &copy; Loris Bognanni. All rights reserved. Theme: ",
    links: [
      {
        label: "Azimuth by Stackbit",
        url: "https://www.stackbit.com",
        new_window: true
      }
    ]
  }
};