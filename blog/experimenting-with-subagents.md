---
title: "Experimenting with subagents: strict rules for token-minning"
author: _data/authors/loris-bognanni.yaml
excerpt: >-
  The promise is enticing: split your work so well that you can have small, cheap models do the work, and only use the big, expensive models for the important stuff. But is it really worth it?
date: '2026-08-09'
thumb_image: images/little-agents-sm.jpg
image: images/little-agents.jpg
layout: post
tags: 
  - ai coding
---

My latest foray into AI coding has been building a level editor for a yet unreleased 2.5D game that I'm working on.

The first version was built over a couple of evenings, reusing a lot of the rendering code from the game itself, and it was pretty good! Given the low stakes, I more or less vibe coded it completely. Claude chose the architecture, the UI stack, and even the theme. I only provided the structure: writing a plan, then implementing it one milestone at a time.

### A small editor grows up

![the level editor in all its glory](/images/kp-editor.png)

Over time, the editor started acquiring more and more features, and what started as more of a "level viewer" was now becoming a complex level builder. As a result, the UI was starting to grow in complexity. 

The problems started subtly. Sometimes Claude would add a button to the UI and forget to give it any sort of styling. Some features were duplicated in weird ways, like having two "hide scenery" buttons, one in the main toolbar, and one in the "path editing" view. And then adding new features started taking a bit too long, and using a bit too many tool calls and tokens.

I figured that it was time to take a peek under the hood to see how Claude was dealing with all this complexity, and oh my. 
1000s lines files, `document.getElementById` everywhere, and a lot of duplicated code.

As I was planning to add even more features, I decided that now would be a good time to refactor the editor code, move away from plain HTML, and pivot to (p)react, which has the advantage of being so ubiquitous that it's a pillar of the training data of all LLMs (as Claude would say, it's _load bearing_ 😩). My hope being that splitting the UI into discrete components would increase reuse and make it easier for the AI to navigate the code base.

### The subagent idea

If you're on tech twitter for any amount of time, "subagents" are already a thing of the past. The cool kids are now doing "loops" or even "graphs". 

The cool kids also have infinite budgets and work for the token factories. I only have a "Pro" Claude subscription for personal use, meaning that each token needs to earn its keep. 

In my [previous post on the matter](/blog/building-for-one), my experience with subagents was 

>I found that the multi-agent system was exceptional at consuming tokens, while producing the same results that I could have achieved with a single agent.

This time, I am coming at the sub-agent use case from a different angle: now it's all about optimizing for cost, by using cheaper models for routine tasks, and optimizing the context they need to do their job.

To keep things as simple as possible, but not simpler, my process looks like:

- A Planning session, done with Opus 5, generates a markdown file containing the plan for the migration. The plan is split into several phases. This session uses quite a few tokens, but it's a one-time cost, and the plan is now stored in a file that can be referenced by all future sessions.
- For each phase, I start a new session where the phase is broken down into a set of small milestones. Again, I tend to use a strong model here, so that the plan is detailed and complete. The resulting plan is once again stored in a markdown file.

Now the work can start. This is how I set up the work:
- I interact with the main agent, which only does lifecycle management and progress tracking
- A "coder" subagent is tasked with writing the change 
- A "reviewer" subagent reviews the change and gives it a thumbs up or down.
- The main agent sends the reviewer's feedback back to the coder and the cycle repeats until the change is approved.
- Once the change is approved, the main agent updates the plan, commits everything to git and moves on to the next milestone.

<pre class="mermaid">
flowchart TD

subgraph Prework
    main_plan[Planning session: generate plan file]
    phase_plan[Phase planning session: generate phase plan file]
end

subgraph Work
    main_agent[Main agent: lifecycle management and progress tracking]
    coder[Coder subagent: write the change]
    reviewer[Reviewer subagent: review the change]
end

main_plan --> phase_plan

main_agent -- implement change --> coder
coder -- report progress --> main_agent
main_agent -- review change --> reviewer
reviewer -- report feedback --> main_agent

</pre>

### The devil is in the details, and the details are mad expensive

Here are some of the things I learned while doing this:

- Inevitably, you'll exhaust the 5 hours Claude limit. If you wait more than 60 minutes to continue, you'll be faced with a tough choice: continue where you left off, or start a new session. 

    Your session is cached for an hour, after that, you'll have to reprocess all the context from scratch, a [dramatically more expensive process](https://x.com/quxiaoyin/status/2085408811104534754). 
    
    This is where instructing the main agent to keep track of where the work is, in the plan file, pays dividends. Now it's possible to start a new session, or even change the model, and continue where you left off without paying through the nose for context reprocessing.

- Have the main agent feed the subagents with **exactly the context they need** to do the job. 

  The subagent should not have to go read the plan files, or all of the codebase. It should have this information already distilled and passed to them in the prompt.

- **Do not let the reviewer run tests, linting, or any other automated checks**. We don't want to waste tokens on tool calls that the coder will already have done. The reviewer is specifically instructed to only look at the code and do nothing else.

- A weaker model is perfectly fine for coding. I settled on Sonnet/Terra at medium effort for the best combination of price, speed, and quality.

- I want the reviewer to be a strong model, but I don't want it to go crazy. The best bang for the buck here is **Opus or Sol** at **Low** reasoning effort.

- Especially for this type of software, Claude will want to do some semi-manual browser testing. This is a **very very bad idea**. 

    Automated testing is the way to go; the moment your agent has to look at screenshots or write custom throwaway test scripts, you are wasting tokens.

- At the time of writing, Twitter is abuzz with **Luna at Max effort** for coding, because it's cheap and the benchmarks show it can do impressive thigns at extreme reasoning levels. 
    
    In my experience, it does write the code, but it takes a REALLY, REALLY long time to do it. The reviewer keeps any issue in check, but the coder is so slow that it's only an option if you're token poor and time rich, and are extremely patient.

    I'm also not completely sold on the economics of this approach. At this reasoning level, Luna will overthink, use too many tool calls, and generally waste tokens, even if they're of the cheaper kind.


### Overall, mission accomplished?

The migration from vanilla JS to preact is now complete, and the editor is now a much more maintainable codebase. The UI is now componentized, and the code is much more readable and easier to navigate, especially for me. 

On the economics, I started with the goal of stretching my 20£/mo Claude subscription as far as possible, and ended up buying a ChatGPT Plus subscription to keep going. I'm going to be positive here and say _maybe, probably_. 
I made a lot of stupid mistakes during the experiment, and I'm sure that given what I know now, I could have done it all on a single subscription.

An unexpected advantage of this approach vs my usual "single agent" workflow has been letting the agents run on their own, while I do other things. The main agent's context never gets too big since it's only a coordinator, and the subagents are by nature ephemeral, so they don't accumulate context either. This means that I can let the system run for hours without worrying about it running out of context or entering the "dumb zone".

And finally a rant: Once again, using my ChatGPT Plus subscription allowed me to go back to my darling OpenCode after being on Claude Code for a loong time. **OpenCode is such a superior developer experience**. I'm still mad at Anthropic for not allowing third party harnesses.
