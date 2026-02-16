---
title: "Building for an audience of one: starting and finishing side projects with AI"
author: _data/authors/loris-bognanni.yaml
excerpt: >-
  My Plasma task switcher was a second too slow, so I built - and shipped - my own in Zig, without actually knowing Zig, using AI tools.
date: '2026-02-16'
thumb_image: images/fasttab-hero.jpg
image: images/fasttab-hero.jpg
layout: post
---

[⚡️ FastTab](https://github.com/LBognanni/fasttab) solves a very specific problem: the "Gallery" view of the built-in task switcher in the Plasma desktop environment is slightly too slow for my liking on X11. Sometimes it will take up to a second to open, which is way too long for a feature that I use constantly. 

FastTab is a custom task switcher that is built in Zig, uses OpenGL for rendering, and is designed to run as a daemon so that it can respond to keyboard shortcuts instantly.

## I would have never built this without AI

It's very likely that this is a problem with an audience of one: users who are still on X11, like the gallery switcher, have many windows open, and care about performance. 

In the past I would have probably just accepted the performance tradeoff and moved on, but we're living in _the future_ now! Why not just ask Claude to build it for me? As long as the vision is good, and the code doesn't suck, it should be good enough, right?

And so I did: with zero experience with Zig or X11 internals, I got a working prototype in a few days, and then iterated on it until I was happy with the results.

> AI tools enable you to build things that you would have never built otherwise. When you just want "the thing" rather than the process of building the thing, coding agents can be a game changer.

## It all starts with a conversation

I was just irritated enough by the slight delay of the task switcher that I asked Claude for tips on how to make it faster. Sadly, there was no quick fix, I had already zeroed out all the animations and delays in the configuration, and the only alternative would have been to switch to the "list" or "icons-only" view, which I just don't like (looking at a window preview is much more efficient than reading titles for my brain).

Then I just asked: "How difficult would it be to build a task switcher that is specifically for X11 and KDE?" and the conversation pivoted into planning. We went through a few iterations where I steered Claude towards a design that seemed promising.

The result was a very **detailed specification** of the application, with a clear vision of how it should work and look like, and a plan for how to implement it, split in **several milestones** so that I could start with a simple prototype and then evolve it into a full-fledged application.

> Start with a conversation, and explore the problem space with the LLM. The idea here is to gather options and ideas. Once you have a clear vision of what you want to build, ask for a detailed specification. Iterate on the spec until you _understand it fully_ and are happy with it. 
>
>Then break down the spec in a set of milestones.

**A note on writing good specs:** Claude especially will try to shove as many code snippets as possible into the spec. This is not only a waste of tokens, but it will also make it harder for you (_and the coding agent!_) to implement the spec. Pseudocode is fine, and at this stage is actually preferable, since it allows you to focus on the overall architecture and design of the application, without getting bogged down in the details of the implementation.

Mermaid diagrams are also your friend here, they not only look nicer, but fit in fewer tokens than ASCII diagrams.

With a solid spec in hand, I was ready to start building. The next question was how to let an AI agent loose on my filesystem without risking my machine.

## The perfect balance between safe and YOLO

Every developer should know that `git` is your friend. You can build incrementally, commit when you have something working, and if the LLM messes up, you can always revert to the last working state. 

> I use the staging area a lot when I have something that is kinda working but not quite there yet, so I can decide whether the next iteration is good enough to make it into a commit, it's an improvement that gets staged, or it's garbage to be reverted.

Checking the git diff before committing is also a great way to understand what the LLM is doing, and to catch any potential mistakes before they become a problem.

Running Claude Code and approving... each... individual... command... is... exhausting. But at the same time, running `claude --dangerously-skip-permissions` is gambling with your filesystem.

The solution is 🐋 containers! I used a heavily customized version of [contai](https://github.com/frequenz-floss/contai/), which is a handy wrapper around Docker that allows you to easily spin up a locked down container that has access to your code folder only. This way if the LLM accidentally runs `rm -rf /` or something like that, it will only delete the container's filesystem, which is ephemeral, and not your actual files. (should it delete the code, you are using git, remember?)

> I had to tell the LLM that it's running inside a container, and it doesn't have an X11 display or the ability to install system packages, otherwise it would spend a lot of tokens trying to do the impossible

It worked so well that all my new projects are now developed in a [dev container](/blog/devcontainers) that borrows heavily from the `contai` configuration.

## Trying different tools, and running out of tokens

I initially started working on FastTab with [OpenCode](https://opencode.ai/) and [oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode). I really enjoyed OpenCode in other projects and, while skeptical, I hoped that oh-my-opencode would be the powerup that would make the whole experience 100 times better.

In practice, I found that the multi-agent system was exceptional at consuming tokens, while producing the same results that I could have achieved with a single agent. At around the same time, Anthropic decided that using the Pro plan on OpenCode was a breach of their TOS, so I had to switch back to Claude Code.

The token limit however remained a real problem: I assume that writing Zig is more taxing to LLMs than writing Python or JavaScript, probably because of the lower level nature of the language and the fact that less training data is available for it. I routinely ran out of juice, and had to either wait for the reset, or switch to the Gemini CLI. Alternating between the two was a bit of a hassle, but overall both Opus 4.5 and Gemini 3 were able to get the job done.

> Sidenote: I wonder what's going to happen when the crazy money runs out and Anthropic, OpenAI & co have to start charging for more than it costs them to run the models. Hopefully by then the open source models will have caught up?

But regardless of which model or tool I was using, the pattern was always the same: the LLM could get me 80% of the way there, and the last 20% was on me.

## You still need to know how to code

In the case of FastTab, the first version that I got from the multi-agent system was actually working, which was way better than what I could have built in a couple of hours in a language I didn't know, using libraries I wasn't familiar with. 

It was also a single 1700 lines long file with most of the code in the `main` function, no tests, lots of code duplication, and a lot of extra comments and logging. Refactoring it into a more modular and maintainable state was necessary not only so I could understand it, but so that the LLM could iterate on it without introducing new bugs or breaking existing functionality.

> There's a reason why many developers call AI assisted coding "a slot machine". You write your prompt, pull the lever, and get a surprise. Sometimes it's a fully working thing, sometimes it's 50% there, and sometimes it's completely off the mark. Better prompts will increase the chances of getting a good result, but there's always an element of randomness that you have to be comfortable with.

Asking the right questions also requires coding knowledge. For example, in an early iteration we were shuffling image bytes from BGRA to RGBA. The code worked, but the performance was not great. I asked Claude to use SIMD instructions and the speedup was significant, enough so that we could capture the content of a youtube window playing a video at ~10fps without incinerating my CPU. But **I had to know that SIMD was a thing**, and that it could be used in this context. 

In the end we ended up scrapping much of that code in favour of "borrowing" the actual texture data from X11, which is much faster, but the point stands: you need to know what questions to ask in order to get the best results.


## The age of finishing side projects is here?

I think I'm finally turning the corner from the doom and gloom of "AI will take our jobs." AI-assisted coding is still coding: without the taste and knowledge that come with experience, you'll invariably end up with a half working prototype that breaks in new and exciting ways every time you ask to "pls fix".

For my day job, where the codebase dwarfs any LLM's context window and the stakes are high, getting a coding agent to generate all or even most of the code for a feature is still not something I would subject my users to. 

But side projects have different goals: scratch an itch, maybe learn a thing or two, and get something working before I get bored or realize it's too much effort. 

I can spitball with Claude about my problem, get a spec, and have a working prototype in a few hours. If I like it enough, I can spend some time polishing it until it's something I'm happy to share.

The whole process is short enough that I might actually finish the thing, for a change!
