---
title: Analog and digital clock for Windows 10 and 11 - CodeMade Clock
image: images/hero-clocks.png
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


      * **10 different skins:** 8 analog and 2 digital ones

      * **Super-Scalable** None of that grainy and pixelated stuff, enjoy Clock's beautiful skins at any size. Zoom in or out as much as you like!
      
      * 🍺 Free and [💝 open source](https://github.com/LBognanni/CodeMadeClock/)

    actions:
      - label: 🔽 Download now
        primary: true
        url: https://github.com/LBognanni/CodeMadeClock/releases/latest/download/clock-setup.exe
      - label: 🌚 Midnight Express
        url: '#midnight'     
      - label: ☕ Buy me a coffee
        url: https://buymeacoffee.com/codemade

  - section_id: gallery
    type: section_gallery
    background: white
    title: Screenshots
    gallery:
      - image: "/clock/white.png"
        alt: "White analog clock face"
      - image: "/clock/blue.png"
        alt: "Blue clock face"
      - image: "/clock/red.png"
        alt: "Red watch face"
      - image: "/clock/flat.png"
        alt: "Gray clock with minutes and seconds markers"
      - image: "/clock/digital.png"
        alt: "Digital clock face"


  - section_id: midnight
    type: section_content
    background: white
    title: New! Get Midnight Express
    image: clock/midnight_express.png
    content: >-
      Introducing **Midnight Express**, a set of beautifully dark clock faces.
       
      Perfect for your late nights, and the ideal complement for your dark-mode desktop.
       
      A must for true fans!

    actions:
      - label: 🌚 Get Midnight Express
        url: https://buymeacoffee.com/codemade/e/194709


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
          You can find more resources in the [official docs](https://github.com/LBognanni/CodeMadeClock/tree/master/docs#-authoring-new-skins)
      - question: I found a bug, or want to discuss a new feature
        answer: >-
          Head over [the issue page on github](https://github.com/LBognanni/CodeMadeClock/issues) and create a new bug or feature request, contributions are always welcome! If you like coding, you can also fork the repo and submit a pull request 😉
      - question: I LOVE this, how can I contribute?
        answer: >-
          Thanks! You can can donate any amound via the button below. If you have not already done so, you can also buy [Midnight Express](#midnight)
           
          <a class="button primary" href="https://buymeacoffee.com/codemade">☕ Buy me a coffee</a>
      - question: What Windows&reg; versions is Clock compatible with?
        answer: >-
          Clock supports any Windows version starting from Windows 10 build 17763, also known as [October 2018 update](https://en.wikipedia.org/wiki/Windows_10,_version_1809).<br>
          This means that you should have no problem if you're running Windows 10 or 11 and have automatic updates turned on.
      - question: Will you make a version for Mac or Linux?
        answer: >-
          Unfortunately, I have no plan to do this at the moment. Clock is tightly tied to various Windows-only technologies such as GDIPlus and Windows Forms and it would look more like a rewrite than a simple change.
layout: landing
---
