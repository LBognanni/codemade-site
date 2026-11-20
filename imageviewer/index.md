---
title: Image Viewer - fast and private image viewer for Windows, macOS and Linux
description: >-
  A fast, private and free image viewer for Windows, macOS and Linux. Opens HEIC, AVIF, JPEG XL, PSD, camera raw files and dozens more formats.
layout: landing
image: images/hero-imageviewer.png
software:
  name: CodeMade Image Viewer
  description: A fast and private image viewer that opens almost any format, including HEIC, AVIF, JPEG XL, PSD and camera raw files.
  category: MultimediaApplication
  os: Windows, macOS, Linux
  download: https://github.com/LBognanni/ImageViewer/releases/latest
sections:
  - section_id: features
    type: section_content
    background: gray
    image: images/hero-imageviewer.png
    title: 🌄 Explore your photos
    content: >-
        Most photo apps are slow to load and slow to use. They try to build a catalogue of all your pictures, and some keep connecting to servers you never asked them to talk to.


        I just wanted an app that opens a folder, gets out of the way, and shows me the pictures!


        I often think that less is more. So here is an image viewer that instead of doing more, does less:

        * **Less UI** means that your photos take all the space and there's no awkward buttons and menus crowding the screen

        * **Less time waiting**: ImageViewer decodes the next pictures before you get to them and draws on the GPU, so it stays fast even with huge photos and slow memory cards

        * **~~Less~~ *Absolutely no* spying**: ImageViewer does not "call home", "collect usage statistics" or creepily track any info about you or your photos


        It runs on **Windows, macOS and Linux**, and opens almost anything: JPEG, PNG, WebP, HEIC, AVIF, JPEG XL, TIFF, PSD, SVG, animated GIFs and dozens more, plus raw files from all the major camera makers.


        Best of all, ImageViewer is 🤑 free and [❤ open source](https://github.com/LBognanni/ImageViewer/)
    actions:
      - label: 🔽 Download now
        primary: true
        url: https://github.com/LBognanni/ImageViewer/releases/latest
        # Swaps in the file for the visitor's OS (regexes on the release file names)
        os_download:
          repo: LBognanni/ImageViewer
          windows: '^ImageViewer_Setup\.exe$'
          macos: '-osx-arm64\.dmg$'
          linux: '-linux-x64\.AppImage$'
      - label: ✨ What's new in 2.0
        url: /blog/imageviewer-2-cross-platform/

  - section_id: install
    type: section_faq
    background: white
    title: Installing
    subtitle: Pick the file for your system from the latest release.
    faq_items:
      - question: 🪟 Windows
        answer: >-
          Download and run `ImageViewer_Setup.exe`. The installer isn't signed yet, so if SmartScreen stops it, choose *More info*, then *Run anyway*.
      - question: 🍎 macOS
        answer: >-
          Open the `.dmg` and drag Image Viewer to Applications. It needs an Apple Silicon Mac.


          The app isn't notarized yet, so macOS blocks it the first time you open it. Go to *System Settings*, then *Privacy & Security*, and choose *Open Anyway*.
      - question: 🐧 Linux
        answer: >-
          Use the AppImage, or extract the tarball and run `ImageViewer` from that folder. It needs an x64 system with glibc 2.35 or newer.


          Make the AppImage executable before running it:


          `chmod +x ImageViewer-*.AppImage`
      - question: How do I make it my default image viewer?
        answer: >-
          Press `P` in the app to open Preferences, and use the button there. Press `H` to see all the keyboard shortcuts.
---
