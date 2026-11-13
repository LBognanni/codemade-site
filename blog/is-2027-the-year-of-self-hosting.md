---
title: Is 2027 going to be the year of self hosting?
author: _data/authors/loris-bognanni.yaml
excerpt: >-
  Vibe coding makes personal software cheap. 0-days make the public internet scary. AI makes self-hosting approachable. Put them together and 2027 starts looking interesting.
date: '2026-11-13'
thumb_image: images/cozypc_sm.webp
image: images/cozypc.webp
layout: post
---

## A story about moving homes

Have you ever had to find a new place to live? Well I am doing it right now. As a millennial, the idea of owning a house feels unreachable. 

As a _forgetful_ millennial, keeping track of everything that needs to be done (look for houses, call agents, organize viewings, etc etc etc) is incredibly daunting.

I had decided to live with the discomfort of "I should really be doing _something_ right about now" and "Did I ask about property X or property Y?" when I got a nice email from Notion.

See, last time I was looking for a place to live, I used Notion to keep track of all the homes I was interested in. I had a nice Notion database and everything. It was slow as molasses, but it did work! I felt so organized.

I've not used Notion since, so the email I got was along the lines of "we're going to deactivate your account soon". How rude! I'm going to lose all my data about places that now probably rent for 3 times the money.

And then I thought "I could probably vibe code my own house finding app. A house finding CRM? HRM?". And so I did.

The creatively named **House Tracker** is now a real app in my browser and on my phone. I can paste a listing URL (or share to it via the Android "share to" dialog) and the software will download pictures, floorplan, listing text, then it will have a mixture of deterministic code and AI agents fill in information like commute times and prices, statistics about the area, evaluate against my nice-to-haves and dealbreakers, add a vibe score etc. All in the space of a few seconds. 

Then, I can track each home's state in a kanban board so I know exactly where I am at with my house search. When I visit a place, I now have a nice checklist I can fill in, and can attach pictures too. 

It's pretty cool if I do say so myself.

## A disturbance in the force

I could have published this app on the web for anyone to use. Maybe turn it into a SaaS? I didn't.

For one, making it into a SaaS is extra work that I don't really need. I also doubt that the property aggregators would take kindly to regular scraping. And I would need, like, an AI API key? A _paid for_ API key? ughhh

And have you _been_ on ~~twitter~~ X lately? It's the **hackpocalypse** out there! In the space of a few days, [PHP](https://www.php2shell.com/), [ALL Linux versions](https://nvd.nist.gov/vuln/detail/cve-2026-98432), [even Alpine](https://sshhole.com) have been breached. I mean I can understand PHP lol. But Alpine Linux!

Instead, the app runs on my desktop PC and is exposed only over my [tailnet](https://tailscale.com). Accessible from my phone and laptop, anywhere, visible only to me.

And you know what? Tailscale is pretty sweet. All my devices can see each other, and none are on the public internet. It can even issue HTTPS certificates so you can install your app as a PWA! 

It's like a cozy blanket keeping me warm while CVEs snow outside.

## Is this, like, a trend?

If software was eating the world until a couple of years ago, now it's devouring it. I wrote [before](/blog/building-for-one/) that AI has been a boon to side projects, and I believe the folks desperately trying to scale GitHub right now would tend to agree.

I would also bet that **most personal projects have exactly one user**.

At the same time, things like **daily driving Linux** or running a small personal server have become so much **less scary**. All it took was replacing the know-it-all greybeards who would just tell you to RTFM with an always-available, approachable assistant that wants _nothing more_ than to make PipeWire talk to that Bluetooth speaker.

And then there's the **hackpocalypse** thing. With CVEs dropping left and right, it seems downright _prudent_ to avoid putting personal web services on the raw internet. 

So, am I saying that normies are going to become Linux admins overnight, and that SaaS is going the way of the dodo?

Well, [no](/blog/death-of-saas/). You could sum up 90% of SaaS on the market today as "software that replaces a spreadsheet monstrosity", and yet spreadsheet software is still very much alive and kicking.

And normies are not interested in running a home lab. But your average nerds? I can see that happening. What was once the realm of the mega-nerds is now accessible to us lesser nerds. All it takes now is knowing _what_ to ask for.

So no, SaaS isn't going to die in the age of hyper personal software. But for the nerds among us, 2027 might just be the year we stop renting software we could build in an afternoon.

Anyway, Notion: go ahead, deactivate my account. I've got my House Tracker now :)
