---
  title: "Why I'm bullish on BDD for 2027"
  author: _data/authors/loris-bognanni.yaml
  excerpt: >-
    How do we keep up with agents that can churn out reams of code every day? A 20 year old idea could be the key
  date: '2026-11-27'
  thumb_image: images/gherkinator-sm.webp
  image: images/gherkinator.webp
  layout: post
---

 It's fascinating how much AI has changed the job of software engineer in just a year. We've gone from fancy tab-tab-tab autocomplete to do-it-all software factories at the extreme. (btw, does anyone know someone who wrote a software factory that produced an actual successful application that is not _the software factory itself?_)

The topic of code review is perhaps the hottest discussion in the field. On one side stand the purists, who will ask "How can you guarantee quality if you don't review every line of code?"; on another stand the GSD/YOLO people who argue that "we can't review every line of code and move fast at the same time". All while someone reminds them that we don't want to lose our SOC-2 certification so yes, a human must be responsible for the code.

## So, about code reviews

I can see code review following one of three paths:

1. **No changes are reviewed**: This makes sense for relatively small projects, where it's easier to just check that the app works by running it. **The developer becomes a stakeholder**, simply asking for changes and fixes as the agent does all the work. Often times, the developer is not a developer at all, but a domain expert like a marketing pro, a gym owner, you name it.
1. **Some changes are reviewed** This is the Anthropics, OpenAIs, startups, the people at the "frontier". Most changes go through a several quality gates like automated testing, adversarial review, and get merged once they are successful. Some changes still get the human review, where they touch critical components. A human will sometimes skip reading the actual code, and will instead ask the AI for some sort of summarization, perhaps as an interactive page with flow diagrams.
1. **All changes are reviewed** This is mostly everyone else. Either a developer or a machine writes pull requests, and a developer reviews them. Tests and CI are there as an extra guarantee, but the human has the final say.

 
The problem for people in group #3 is that they want to go faster. With review being the bottleneck, PRs inevitably start to pile up as it's easier to generate code than it is to review it.

It's so easy in fact, that coding agents have a strong bias for **generating as much code as possible** - writing tests that check for the value of constants, handling edge cases that can never happen in production, inventing requirements. In other words, SLOP.

## Tests to fight slop

So here's a scenario. One of our github workflows tags and pre-releases at each push on pull requests, so that we can deploy the binaries (should we choose to do so). This is on a busy repo with lots of commits, so inevitably the releases start piling up and making the github APIs slow to unresponsive.

So I asked my agent for a simple python script to delete those pre-releases when pull requests get merged.

What I got was a totally reasonable but very long script. It had a test file too, which was of course at least as long as the script itself. Looking at the code, my eyes glazed over. I mean the code was tested and working (I did test the script on an already closed PR), but oh my god I could not make heads or tails of it without some serious focus time. Even looking at the tests, they were all reasonable-sounding, but as clear as mud. 

This, on a side-of-desk type of task while I was busy working on actual things I needed to deliver. (I'll spare you the blog post about CI being a tragedy of the commons and the place where hopes go to die)

I asked for a simple change: Rename the tests so they follow a "When x then y" structure.

And then I saw it. **The Slop**. Renaming the tests finally made it clear what all the lines of code were there for. Conditional logic on top of conditional logic for things that will just not happen like "what if it's a draft release and also a pre-release", "what if this is a release on the main branch" and so on. Technically it was very thorough, but in practice this was just added cognitive load for zero benefit. YAGNI!

## A brief history of BDD

Smarter people than me realized that having tests that are easy to read was a Good Thing. Imagine if your test syntax was so simple that you could just write something like:

```
Feature: User login

  Scenario: Successful login
    Given the user is on the login page
    When the user enters valid credentials
    Then the user should be redirected to the dashboard
```

Then you could have, like, domain experts, product managers and business people write the tests! 🤯
Then instead of writing test first, why not write _behaviours_ first, like when planning a feature. We could call this BDD instead of TDD for Behaviour Driven Development! But this is making too much sense. Let's name this stuff something ridiculous like Gherkin because reasons.

This was such a revolutionary idea that it took off in the industry. Consultants showed teams how having a common language was key to understanding each other. Developers excitedly built the building blocks so that business folks could write tests in English. Business folks said they'll surely get back to them in a few days; it's just suca busy season now with meetings and phone calls and stuff.

In other words, developers wrote the tests framework so that they could then have the honour of writing the damn `.feature` files themselves. Most saw this and went back to their unit testing framework of choice.

## Fast forward to now

I started this blog post saying that things have changed. Todays developers write little code, and either review lots of it, or trust the machine. There's a third way: review the tests only. As long as they pass, and are testing the right thing, it can be sufficient for the majority of tasks.

But we can take this a step further: Why review the test _implementation_ when you can review its purpose? Two of the reasons for the disappointing adoption of BDD have now been flipped on their head: the developer job looks a lot like yesterday's project manager's, and the code writing is done by an ever compliant LLM that will follow whatever rules you set for it.

#### We don't even have to _write_ the tests. We just need to read them. 

And when they're written in plain English, suddenly reviewing is a lot simpler. 

This is why I think BDD will be making a comeback in 2027. As developers, we will be authoring the specification for a change, and review the behaviour the agent decoded from it. We don't have to stay so close to the implementation that we have to keep every function and variable name in our mental model. By all means, we can go deep when we need to, but for most work we can just speak in domain language.
	
