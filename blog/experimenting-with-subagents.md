---
title: "Experimenting with subagents: strict rules for token-minning"
author: _data/authors/loris-bognanni.yaml
excerpt: >-
  The promise is enticing: split your work so well that you can have small, cheap models do the work, and only use the big, expensive models for the important stuff. But is all the fine tuning really worth it?
date: '2026-08-25'
thumb_image: images/axes-mixing-desk.svg
image: images/axes-mixing-desk.svg
layout: post
tags: 
  - ai coding
---


For the past few weeks, I've adopted a new workflow for my AI assisted coding. I've settled on a very simple subagent based approach, where a main agent coordinates the work, and two subagents do the actual coding and reviewing.

The idea is simple but it hides a lot of depth: working with agents has a set of constraints for regular people with regular budgets:

- Bigger and more capable models are more expensive
- Smaller models are cheaper, and getting more capable as time goes on
- Context is expensive, and the more context you have, the more expensive it gets
- Token caching is a thing, but it does have limits: if you pick up an old session, you might have to reprocess all the context, which is expensive
- Models tend to have a "dumb zone" where they get more unreliable as the context grows
- Tool calls tend to generate a lot of text that has to be processed in each follow up message

This means that the old approach of "use opus for everything" tends to become impractical when working on larger projects.

Practically I wanted to migrate a fairly large, completely vibe coded codebase (a level editor for a game I'm working on) from vanilla JavaScript to React with TypeScript, and do so while improving the code quality and maintainability. The project is large enough that it would be impractical to do it all in one go.

## Subagents to the rescue

If you're on tech twitter for any amount of time, "subagents" are already a thing of the past. The cool kids are now doing "loops" or even "graphs". 

The cool kids also have infinite budgets and work for the token factories. I only have a "Pro" Claude subscription for personal use, meaning that each token needs to earn its keep. I need to _token-minn_, not token-maxx!

In my [previous post on the matter](/blog/building-for-one), my experience with subagents was 

>I found that the multi-agent system was exceptional at consuming tokens, while producing the same results that I could have achieved with a single agent.

This time, I am coming at the sub-agent use case from a different angle: now it's all about optimizing for cost, by using cheaper models for routine tasks, and optimizing the context they need to do their job.

To keep things as simple as possible, but not simpler, my process looks like:

- A Planning session, done with Opus 5, generates a markdown (e.g. `docs/feature-x-plan.md`) file containing the plan for the migration / big feature. The plan is split into several milestones.

- During regular work, I interact with the main agent, which is pointed to a workflow file describing how it will manage the work. 

- The main agent is given the plan file, and asked to direct a "senior coder" (Opus or Sol, medium reasoning) subagent to break down the milestone into a set of small stories that _"a junior engineer can pick up"_ and store the result in a markdown file (e.g. `docs/feature-x-<milestone>.md`).

- For each story, the main agent will work through the workflow:

    - A "coder" (Sonnet or Terra, medium reasoning) subagent is tasked with implementing the next story 

    - A "reviewer" (Opus or Sol, low reasoning) subagent reviews the change and gives it a thumbs up or down.

    - The main agent sends the reviewer's feedback back to the coder and the cycle repeats until the change is approved.

    - Once the change is approved, the main agent updates the milestone doc, commits everything to git and moves on to the next story.

- We then update the plan file with the progress, and move on to the next milestone (or stop for the day).

<pre class="mermaid">
%%{init: { "flowchart": { "curve": "stepAfter" } } }%%  
flowchart TD
    classDef default text-wrap:true,white-space:normal;
    Create_overall_spec__17e7846e[Create overall spec, split in milestones] --> Work_on_next_milesto_e97c058d[Work on next milestone]
    Work_on_next_milesto_e97c058d --> sc
    Senior_coder_Break_d_ebf70296[Break down next milestone]
    Senior_coder_Break_d_ebf70296 --> Select_next_task_f184a500[Select next task]
    Select_next_task_f184a500 --> Assign_coder_to_task_f44d0617[Assign coder to task]
    Assign_coder_to_task_f44d0617 --> c
    Write_code_78fe1ad5[Write code]
    Write_code_78fe1ad5 --> Run_tests_lint_a2bcfc51["Run tests / lint"]
    Coder_done_review_21d3941a[Coder done, review] --> r
    Reviewer_Review_chan_5375aae9["Review changes (read only)"]
    Run_tests_lint_a2bcfc51 --> Coder_done_review_21d3941a
    Reviewer_Review_chan_5375aae9 -->|Bugs found| Assign_fixes_to_code_f9ec18ac[Assign fixes to coder] --> c
    Reviewer_Review_chan_5375aae9 -->|Code is fine| Commit_changes_67cd3b29[Commit changes]
    Commit_changes_67cd3b29 --> More_tasks_c5e0d359[More tasks?]
    More_tasks_c5e0d359 -->|yes| Select_next_task_f184a500
    More_tasks_c5e0d359 -->|no| Milestone_done_Updat_358f3c5a[Milestone done. Update spec. & commit]
    Milestone_done_Updat_358f3c5a --> More_milestones_c9982668[More milestones?]
    More_milestones_c9982668 -->|yes| Work_on_next_milesto_e97c058d
    More_milestones_c9982668 -->|no| All_done_ced44dce[All done! 🎉]

    c -. optional: ask for help .-> hw



subgraph sc["Senior coder subagent"]
    Senior_coder_Break_d_ebf70296
    hw[Help coder agent]
end
subgraph c["Coder subagent"]
    Write_code_78fe1ad5
    Run_tests_lint_a2bcfc51
end
subgraph r["Reviewer subagent"]
    Reviewer_Review_chan_5375aae9
end
subgraph "Main agent"
    Work_on_next_milesto_e97c058d
    Select_next_task_f184a500
    Commit_changes_67cd3b29
    Milestone_done_Updat_358f3c5a
    More_milestones_c9982668
    All_done_ced44dce
    Assign_coder_to_task_f44d0617
    Coder_done_review_21d3941a
    Assign_fixes_to_code_f9ec18ac
end

classDef style0 stroke:#C3CFD9,fill:#ffffff,color:#293845
class All_done_ced44dce,Assign_coder_to_task_f44d0617,Assign_fixes_to_code_f9ec18ac,Coder_done_review_21d3941a,Commit_changes_67cd3b29,Create_overall_spec__17e7846e,Milestone_done_Updat_358f3c5a,More_milestones_c9982668,More_tasks_c5e0d359,Select_next_task_f184a500,Work_on_next_milesto_e97c058d style0
style Reviewer_Review_chan_5375aae9 stroke:#2C88D9,fill:#d5e7f7,color:#293845
style Senior_coder_Break_d_ebf70296 stroke:#E8833A,fill:#fae6d8,color:#293845
style hw stroke:#E8833A,fill:#fae6d8,color:#293845
style Write_code_78fe1ad5 stroke:#1AAE9F,fill:#d1efec,color:#293845
style Run_tests_lint_a2bcfc51 stroke:#1AAE9F,fill:#d1efec,color:#293845
linkStyle 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15 stroke:#788896
</pre>

### The devil is in the details, and the details are mad expensive

![the axes mixing desk](/images/axes-mixing-desk.svg)

Here are some of the things I learned while doing this:

- Cached tokens have a relatively short shelf life. If your Claude session runs out of usage, it might be sitting idle for long enough that the context is no longer cached. In this case, [better to start a new session than to reprocess all the past context](https://x.com/quxiaoyin/status/2085408811104534754). 
    
    This is where instructing the main agent to keep track of where the work is, in the plan file, pays dividends. Now it's possible to start a new session, or even change the model, and continue where you left off without paying through the nose for context reprocessing.

- Have the main agent feed the subagents with **exactly the context they need** to do the job. 

  The subagent should not have to go read the plan files, or all of the codebase. It should have this information already distilled and passed to them in the prompt.

- **Do not let the reviewer run tests, linting, or any other automated checks**. We don't want to waste tokens on tool calls and checks that the coder already ran while implementing the story. The reviewer is specifically instructed to only look at the code and do nothing else.

- A weaker model is perfectly fine for coding _if you plan things well_. I settled on Sonnet/Terra at medium effort for the best combination of price, speed, and quality.

- I want the reviewer to be a strong model, but I don't want it to go crazy. The best bang for the buck here is **Opus or Sol** at **Low** reasoning effort.

- Especially for web software, Claude will want to do some semi-manual browser testing. This is a **very expensive idea**. 

    Automated testing is the way to go; the moment your agent has to look at screenshots or write custom throwaway test scripts, you are wasting tokens.

- At the time of writing, Twitter is abuzz with **Luna at Max effort** for coding, because it's cheap and the benchmarks show it can do impressive things at extreme reasoning levels. 
    
    In my experience, it does write passable code, but it takes a REALLY, REALLY long time to do it. The reviewer keeps any issue in check, but the coder is so slow that it's only an option if you're token poor and time rich, and are extremely patient.

- [Matt Pocock](https://x.com/mattpocockuk) has an excellent [`grill-me`](https://github.com/mattpocock/skills/tree/main/skills/productivity/grill-me) skill you can use to generate the initial plan for a new feature. It will go to excruciating levels of detail and ask you all sorts of questions about the feature, which is great for getting a solid spec and stopping the LLM from guessing.

### The results are in

This played out over two weeks, each week completing about half of the migration. I'm happy to report that the refactoring was completed successfully!

The first week was mostly spent trying various models and settings, carefully eyeing the usage bar on the Claude dashboard, panicking when I reached the limit on the 3rd day, using a bunch of extra credits (they would disappear on sept 1st anyway 😇), and then buying a ChatGPT Plus subscription to keep going.

The second week, my token usage was much more efficient considering the amount of work that was done, thankfully leaving me at both subscriptions not maxed out, and no extra credits purchased.

I've now replicated the same workflow on a different greenfield project, and it has allowed me to get a lot of work done quickly, while keeping a decent handle on the code quality, both in terms of maintainability and correctness.

An unexpected advantage of this approach vs my usual "single agent" workflow has been letting the agents run on their own, while I do other things. The main agent's context never gets too big since it's only a coordinator, and the subagents are by nature ephemeral, so they don't accumulate context either. This means that I can let the system run for hours without worrying about it running out of context or entering the "dumb zone".

#### Want to give my workflow a go?

I've put together a [starter repo with the workflow files](https://github.com/LBognanni/simple-subagents-workflow), feel free to fork it and adapt it to your own needs. The workflow is simple enough that you can use it with any codebase, and the subagents can be swapped out for different models or reasoning levels as you see fit.

I'd love to hear about what you build with it!