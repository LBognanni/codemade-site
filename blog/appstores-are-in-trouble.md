---
title: "It's getting hard to justify app stores"
author: _data/authors/loris-bognanni.yaml
excerpt: >-
  The app store model is broken, and it's only going to get worse with AI.
date: '2026-04-02'
thumb_image: images/app-stores-sm.jpg
image: images/app-stores.jpg
layout: post
---

Google's announcement of the [new developer verification process for android developers](https://android-developers.googleblog.com/2026/03/android-developer-verification-rolling-out-to-all-developers.html) and especially the incredibly cumbersome "[advanced flow](https://android-developers.googleblog.com/2026/03/android-developer-verification.html)" required to sideload unverified apps left a bad taste in my mouth.

Here's why.

### App stores are yucky

When was the last time you thought you'd like to open the app store and see what's new? Me neither! The only reason to do so is because you already know what you're looking for, and even then you'll spend some quality time trying to find it among the sea of adware and sketchy knockoffs: because of the economics of developing apps,  most apps are filled with ads, trackers, and upsells. 

It's a race to the bottom, and the only way to win is to enshittify your app as much as possible.

## And then AI coding came along

I built two small apps during the past weekend that made me reconsider the whole idea of needing app stores.

### Hacker news reader

My favourite hacker news reader app, [Materialistic](https://github.com/hidroh/materialistic) hasn't been updated in ~ 3 years. It's so old that [the Play Store doesn't even have it anymore](https://github.com/hidroh/materialistic/issues/1464).

I read HN in a specific way: I want to see the top posts of the day, sorted by number of comments, and I want to read the comments. Sometimes I'll navigate to the actual article. That's it.

I asked Claude to build me a very simple HN reader that does just that, and in a few minutes it materialized on my screen. 

It's a PWA so it doesn't even need to be sideloaded, I just have to open the URL and add it to my home screen. It has no ads, no trackers, and it does exactly what I want it to do. It caches requests so it works offline, and it's blazing fast on cellular networks.

It's hosted at [https://hnws.app](https://hnws.app) if you want to check it out. 

(I won't know, because I didn't add any analytics to it!)

### Background switcher

There's another app that I've been using for years, [Muzei](https://github.com/muzei/muzei/). It's by far the best wallpaper switcher app.
The killer feature is that it will blur and dim the wallpaper so you can see the icons clearly, and you can reveal the unblurred version with a double tap.

The only problem I have with it is that most of my wallpapers are landscape, and so they are always centered and cropped, which means that the most interesting part of the image is sometimes cut off.

Again, my use for it is very specific: I only use local images, and I want the app to automatically switch to the next image in the folder every day. That's it.

Claude Code built me [LocalZei](https://github.com/LBognanni/Localzei/), a full fat Android app that does just that, and again, it has no ads, no trackers, and it does exactly what I want it to do.

> It took an evening.

An evening!! While I was watching TV and eating dinner!! Yes it only does a subset of what Muzei does, but it's _my_ subset. And it can crop to the most interesting part of the image 😄


## The age of personal apps is here

The friction of building personal apps has always been so high that as users we accepted the ads, the trackers, the dark patterns, and the constant upsells.

The friction is just not there anymore. You can build a personal app that has the exact subset of features you want, that is clean, fast, and respects your privacy, in a matter of hours.

## But the enshittifiers are fighting back

And this is exactly what Google's new verification process is designed to prevent: they are desperately trying to protect their cash cow, in the name of "security" and "user experience".

Just as we're so close to our phones being the personal computing devices we always wanted.