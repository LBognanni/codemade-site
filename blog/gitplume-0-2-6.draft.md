---
title: "What's new in GitPlume 0.2.6: edit without leaving, more languages, and lots of polish"
author: _data/authors/loris-bognanni.yaml
excerpt: >-
  GitPlume can now hand your file over to your editor of choice, highlights Terraform, Dockerfiles, PowerShell and more, and got a long list of small quality-of-life fixes.
date: '2026-11-15'
thumb_image: images/gitplume-on-rust-sm.jpg
image: images/gitplume-on-rust.jpg
layout: post
---

It's been a few weeks since [GitPane became GitPlume and got the Rust treatment](/blog/gitplume-migrated-to-rust/), and in the meantime I've been using it every day. Using your own tool every day is the best way to find all the little things that bug you about it, so I've been fixing them one release at a time.

Here's everything that changed between [0.2.1 and 0.2.6](https://github.com/LBognanni/gitplume/compare/v0.2.1...v0.2.6).

<!-- TODO: anything personal to add here? e.g. what prompted the burst of releases -->

## Edit files without leaving GitPlume

This is the big one. Open a file in any tab (a change, a file from the Files tab, or a search result from Find), press `e`, and GitPlume hands the whole terminal over to your editor. When you close the editor, you're right back where you were, and the diff or preview is reloaded with your changes.

<!-- TODO: screenshot or short recording of pressing `e` and coming back -->

GitPlume uses the same editor as Git, so if you've ever configured `core.editor`, `GIT_EDITOR`, `VISUAL` or `EDITOR`, it will just work. If you haven't, it falls back to `nano`.

If you want GitPlume to use a different editor than Git does, you can override it with `GITPLUME_EDITOR`:

```bash
GITPLUME_EDITOR='nvim' gitplume
GITPLUME_EDITOR='code --wait' gitplume
```

GUI editors need their "wait" option (like `--wait` for VS Code), otherwise GitPlume would resume straight away, while you're still editing.

This makes the "spot a typo in the diff, fix it, stage it" loop a lot faster. <!-- TODO: say this in your own words, or describe how you use it -->

## Syntax highlighting for more languages

GitPlume now highlights:

- **HCL**, so your Terraform files look as good as the rest of your code
- **Dockerfiles** and Containerfiles
- **PowerShell**
- **XML**
- **GLSL** shaders
- **Zig**

That's on top of the 20 languages it already supported, including Rust, Python, TypeScript, Go, C# and friends.

<!-- TODO: optional link to the new Terraform State Viewer vibelet, since it's the same crowd: /blog/terraform-state-viewer-and-webp-converter/ -->

## Better status sections

The **Staged** and **Unstaged** section headers now show how many lines were added and removed across all their files, so you can tell at a glance how big your change is before you commit it.

You can also click a section header to check or uncheck every file in it, which makes bulk staging and unstaging a single click.

<!-- TODO: screenshot of the status headers with the line totals -->

## Small things that add up

- **Line wrapping respects the gutter.** When wrapping is on (`w`), wrapped lines no longer spill into the line-number gutter. Continuation lines get a subdued gutter, so it's easy to tell where a line actually starts.
- **The gutter goes all the way down.** Short files used to have the gutter stop where the file ended; now it extends to the bottom of the viewer, with a bit of breathing room between the gutter and your code.
- **More ways to get help.** Besides `h`, you can now press `?` or `F1` to see the keyboard shortcuts.

## Bug fixes

- **No more phantom refreshes.** GitPlume watches your repository for changes, but it was also reacting to files simply being *read*, including by its own searches and previews. Now only actual changes trigger a refresh, and your Find selection stays put.
- **The Files tree keeps its place.** Background refreshes no longer reset the scroll position of the Files tab.

## Upgrading

If you installed GitPlume with the installer, just run it again to get the latest version:

```sh
curl -fsSL https://github.com/LBognanni/gitplume/releases/latest/download/install.sh | sh
```

Or, if you have a Rust toolchain:

```sh
cargo install --locked gitplume
```

New to GitPlume? Head over to [gitplume.dev](https://gitplume.dev) to see what it looks like and get started.
