---
title: "Taking a page out of DHH's book: GitPane becomes GitPlume and gets the Rust treatment"
author: _data/authors/loris-bognanni.yaml
excerpt: >-
  I let AI rewrite GitPane from Python to Rust (and renamed it GitPlume along the way). I didn't need to become a Rust developer, but I did need a very good specification.
date: '2026-09-27'
thumb_image: images/gitplume-on-rust-sm.jpg
image: images/gitplume-on-rust.jpg
layout: post
---

> "Rust is *amazing* if you never, ever, *ever* have to look at it yourself."

That was the most viral quote from [dhh](https://twitter.com/dhh)'s [Rails World 2026 keynote](https://youtu.be/vDjW_dRyKXY). 

DHH has spent decades praising Ruby as a language designed for programmer happiness: expressive, readable and genuinely pleasant to work with. He has also never made a secret of his dislike for Rust. Just before the popular quote above, he called it "the ugliest programming language of the last 40 years".

What made the moment interesting was what came next: he said he *loved* Rust... if an AI agent is writing the code. When you can clearly specify the behaviour, you get to let the agent deal with the implementation, and can evaluate the result from the outside like a product manager would.

Just a few days ago I published [the first version of GitPane](/blog/introducing-gitpane/), written in Python using Textual. It worked great, but even after a few rounds of optimization, large diffs were loaded and rendered slightly slower than I liked.

Coincidentally, Claude Opus 5.5 had just been released and has been almost universally praised for being a real step up from its predecessors and main competitors.

After seeing some very impressive demos online, I thought *why not?* Why not rewrite GitPane in a more performant language? The current Python version was supposed to be an MVP anyway!

![a meme of bilbo baggins saying "After all why not? Why not rewrite in Rust?"](/images/why-not-rust.png)


## But first, planning

I asked Claude whether the replacement should use Go, Zig or Rust. It confidently recommended Rust, because of its ecosystem. When challenged, it said it undersold Go, but that Rust was still the right choice. After prodding, it said that the UI framework it recommended was not mature enough, and suggested writing a small internal layer instead.

After several rounds of back-and-forth we had a 1,407-line specification describing the migration step by step, including what had to be changed, what the key features were, and how to test them. 

The Python application and its 181 tests stayed alongside Rust as the reference and source of truth. While I was not going to review every Rust ownership decision, I did need to be able to automatically verify that the behaviour of the application was identical.

The original estimate was 9,000 to 10,000 lines and **two to three weeks with heavy agent assistance**.

Once the plan was approved, the bulk of the rewrite took _an evening_, with a few extra hours spent manually testing the application and polishing the UI interactions. 

*Of course, I used my tried and tested [subagents workflow](/blog/experimenting-with-subagents) to ensure that the rewrite was done well, and that the specification was followed* 😉


## A new name: 🪶GitPlume

While preparing the release, I found out that there's already a very similar project on GitHub called gitpane. Rather than confuse anyone, the Rust version ships under a new name: [**GitPlume**](https://github.com/lbognanni/gitplume/).

## GitPlume: now blazingly fast 🚀

Rust delivered on its promise: the rewrite did make loading and rendering large diffs much faster. What surprised me was *how much faster the rest of the application is* now. Resizing panes, moving through tabs, scrolling lists of files and commits, and even the file browser are all much snappier. The application feels more responsive, and it is a joy to use.

As an added bonus, installing [GitPlume](https://github.com/lbognanni/gitplume/) is now much easier: you don't need to have Python and `uv` installed, and a simple `curl | sh` command will download the right binary for your platform and install it in your path. You can also download the binaries directly from the [GitHub releases page](https://github.com/lbognanni/gitplume/releases).

If you have the Python version installed, run `uv tool uninstall gitpane` to remove it, and then install GitPlume. The command is now `gitplume`.

## Python wasn't a waste of time, btw

I do think that writing the MVP in Python was the right call: it allowed me to iterate quickly, build something I was happy with, and then use it as a reference for the rewrite. I also think that the rewrite was the right call: it allowed me to get a more performant application without having to learn Rust, with almost everything working correctly on the first pass.

There's probably a lesson here about the value of writing a specification. But also about how working code is perhaps the best specification you can have. 

As proper academics often say, "more research is needed". And when "research" is building working, personal software that solves a real need, it starts looking a lot like having fun to me!

---