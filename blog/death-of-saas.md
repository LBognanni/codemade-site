---
title: Rumors of the death of SaaS have been greatly exaggerated
author: _data/authors/loris-bognanni.yaml
excerpt: >-
  No, AI isn't going to bring about the apocalypse of SaaS.
date: '2026-02-18'
thumb_image: images/is-saas-dead-yet-sm.jpg
image: images/is-saas-dead-yet.jpg
layout: post
---

There's a meme going around in tech and finance circles that goes something like this:

> Woah I just got Claude Code to build me a custom (insert niche use case here) that works exactly the way I want it! I won't need to pay for (insert SaaS product here)'s monthly fees ever again! The end of SaaS is near!

Here's why I think this is an extrapolation that makes no sense, especially when thinking of B2B SaaS.

I'm going to take the weakest position possible here: **vibe coding is not going to replace tasking and planning software like Jira, Asana, Linear etc**. I'm choosing this specific niche because on paper it's the most AI-disruptable: it's software that's conceptually simple, there are a million TODO list implementations freely sitting on github that have been used as training, and they often need to be customized to a crazy degree to fit the needs of different teams and projects.

I am confident the points below can apply even more strongly to more complex and specific SaaS products (especially in highly regulated industries like finance, healthcare, legal etc).

## Nobody wants to maintain your crappy version of Trello

You vibe coded a replacement for Trello so that your company can drop the $10/user/month subscription. Congrats! Let's say you have 100 users (I like round numbers). That's a saving of $1000/month, or $12,000/year. Seems great, right?

Except that... how much are _you_ paid? Let's say that you're a software engineer making between $60k and $120k a year. Even if you only spend 10% of your time maintaining this thing, that's between $6,000 and $12,000 a year of your time spent on it. And remember, that's time that you're not spending making money for the company. I won't even go into the token costs of running an AI agent, as they can range from insignificant to very expensive depending on the complexity of the software you're building.

There's also the "lottery" factor: let's say you're offered an exciting position at a new company. Who's going to maintain the Trello replacement? Your company now has to find someone else to do it, or contract an external agency, or... switch back to Trello and pay the subscription fees again.

## Free alternatives already exist

If your company wanted to replace Trello with a self-hosted alternative, there are already [plenty of free and open source options available](https://opensource.com/alternatives/trello). These products are already maintained by a community of volunteers, and you can even contribute to them if you want to add features or fix bugs.

So then why don't all companies just switch to these free alternatives? Because they don't want to. They don't want to spend time and resources on maintaining software that is not core to their business. Any time you spend configuring the EC2 instance that runs your self-hosted Trello is time that you're not spending on the actual product you're selling to customers. And of course, if something breaks, you're on the hook for fixing it.

## Software is a liability

We're assuming that your version of Trello is actually working and doesn't have any security issues. The worst case scenario would be that [your Firebase database is actually freely available to anyone on the Internet, and all your company's data is leaked](https://thecyberexpress.com/moltbook-platform-exposes-1-5-mn-api-keys/). And now you're on the hook for that too. Hope you like HR meetings!

Had this been a SaaS product, your company could have done one or all of the following:
- Sued the vendor for negligence
- Asked for compensation
- Switched to a different vendor
- Ask for a detailed post-mortem and action plan to prevent this from happening again

> Having a "throat to choke" is something that companies _really_ like.

## SaaS developers can use AI too

This should be obvious, but there's nothing stopping developers at SaaS companies from using AI tools to improve their services. In fact, they're likely encouraged to do so!

Whether AI is a net positive or a net negative for working within large, established codebases is still up for debate, but all successful software becomes "legacy" given enough time - even the shiny new vibecoded competitor. 

Some think that the SaaS space will become incredibly crowded with options now that building software is easier than ever. But I expect this will translate into higher expectations for what software should be able to do. In essence, if creating a TODO list app is a one-shot with an LLM, then the expectation for what a task management software should be able to do will be much higher than it is now, and the bar for entry will be raised. 

> AI coding raises _the floor_ for what is considered a "viable" software as a service

I also expect that some newer, nimbler companies will eventually compete with the established players, but that's long been the story of software: a great example is Linear coming in and disrupting the Jira monolith by focussing on a better user experience, with what I assume is a tiny fraction of the team at Atlassian.


## Counterpoint: SaaS companies are overvalued on the stock market

This is where the real crux of the issue lies: the stock market has been overvaluing software companies for years now. Given a rational market, the price of a stock should reflect the expected future cash flows of the company. But with software companies, the bet is often that they'll become unicorns, take over a whole market category, put the competition out of business, and raise prices (AKA the [enshittification](https://en.wikipedia.org/wiki/Enshittification) playbook).

The recent hype about AI being the "next big thing" means that funds are being reallocated away from regular SaaS and into AI companies. This also means that investors _need_ to push the message that "AI is going to kill SaaS" in order to justify their increasingly outsized bets.

In that sense yes, AI _is_ going to kill SaaS. Unprofitable companies that rely on a constant stream of funding are going to have a bad time, and some of them will go out of business. But for companies that are providing actual value to their customers, while staying profitable, I don't see any reason why they wouldn't be able to continue doing so, and even thrive in the new AI-powered world.

## TL;DR

AI isn't going to kill SaaS just yet. But it _is_ going to make bad SaaS harder to justify.