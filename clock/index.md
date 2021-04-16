---
title: CodeMade Clock
sections:
  - section_id: features
    type: section_content
    background: gray
    image: images/hero-clocks.png
    title: 🕒 Never miss a beat
    content: >-
      Ever been late for a meeting because you were just too focussed on another task?
      Even when you have reminders set, time just slips by and "just five minutes" turns into an hour.
      Sometimes the simplest solution is also the best one!
       
      Clock is a beautiful, customizable analog clock for Windows that always stays on top of other windows so you always know what time it is! 


      * 8 different skins

      * Works great at any screen size
      
      * 🤑 free and [❤ open source](https://github.com/LBognanni/CodeMadeClock/)

    actions:
      - label: 🔽 Download now
        url: https://github.com/LBognanni/CodeMadeClock/releases/
  - section_id: gallery
    type: section_gallery
    background: white
    title: Screenshots
    gallery:
      - image: "/clock/white.png"
        alt: "image 1"
      - image: "/clock/blue.png"
        alt: "image 2"
      - image: "/clock/red.png"
        alt: "image 3"
      - image: "/clock/flat.png"
        alt: "image 1"
  - section_id: faq
    type: section_faq
    background: gray
    title: Frequently Asked Questions
    subtitle: ''
    faq_items:
      - question: Can I create my own Clock skin?
        answer: >-
          Absolutely! Clock uses a simple `json` structure to define how a clock face should look like.
          You don't even need Photoshop or any graphic editor to start!
          You can find more resources in the [skin creator page](/clock/how-to-create-skins)
      - question: I found a bug, or want to discuss a new feature
        answer: >-
          Head over [the issue page on github](https://github.com/LBognanni/CodeMadeClock/issues) and create a new bug or feature request, contributions are always welcome! If you like coding, you can also fork the repo and submit a pull request 😉
      - question: Will you make a version for Mac or Linux?
        answer: >-
          Unfortunately, I have no plan to do this at the moment. Clock is tightly tied to various Windows-only technologies such as GDIPlus and Windows Forms and it would look more like a rewrite than a simple change.
layout: landing
---