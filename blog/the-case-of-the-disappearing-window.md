---
title: The case of the mysteriously disappearing window
author: _data/authors/loris-bognanni.yaml
excerpt: >-
  When Slack gives you lemons, you make lemonade.
date: '2021-05-24'
thumb_image: images/nowindow_small.jpg
image: images/nowindow.png
layout: post
---

One small annoyance I contend with everyday is links opening in the "wrong" browser. See, I use different browsers for different purposes.

Chrome is the browser I use for all my work stuff, partially because I prefer its Dev tools and also because most SaaS apps I use for work tend to work better with it. Firefox however is my preferred browser and has the advantage of not being built by an advertisement company, so I tend to do all my personal browsing there. I also use Edge for Netflix because why not.

So I spent a few hours hacking together [Roundabout](/roundabout), a simple app that registers itself as a web browser and allows you to pick the browser you'd like to open your link in.

![Roundabout screenshot](/images/hero-roundabout.png)

Upon testing, everything looked good: I could click a link in a non-browser application like Telegram Desktop or WhatsApp desktop, and Roundabout would pop up asking me if I'd prefer Chrome or Firefox.

### ...except for Slack

As it turned out, clicking a link from Slack would... do nothing?

I started with the usual debugging techniques: add some logs, test again. Build fails. Wait, why? A quick glance at [Process Explorer](https://learn.microsoft.com/en-us/sysinternals/downloads/process-explorer) revealed the issue: Roundabout was starting, but somehow it got stuck and wasn't showing the main window. After terminating all the stuck instances, I was able to test again, this time with logs.

The logs looked OK, but just stopped after showing the main form 🤔

Next it was time to investigate *how* exactly Slack starts a web browser.
A few minutes of sleuthing with [Process Monitor](https://learn.microsoft.com/en-us/sysinternals/downloads/procmon) got me my answer: when opening links Slack runs a new command, in the form of `RunDll32.exe URL.dll,FileProtocolHandler {the URL}`; interesting 🤔.

If you never crossed paths with it, RunDll32 is perhaps one of the most interesting applications in Windows. It allows one to invoke functions that are defined in Dll files, simply by calling `rundll32 {the dll},{the function} {any parameters}`. In this case, we're executing the `FileProtocolHandler` function that is defined in `URL.dll`, and passing our URL to it.

So what happens if I just run that command from a command prompt?

![A command prompt showing that we executed Rundll32, with a Roundabout window open in front of it](/images/rundll32.png)<br>Hmmm, it works as expected...

I began to suspect that there was some sort of problem actually showing the form, when starting from Slack. What would happen if I added a MessageBox just before showing the form? Interestingly, the message box showed just fine, and then the main form also showed up fine 🤔

Perhaps the issue is just that Roundabout shows up too quickly? I added a 1 second pause just before starting and... nothing, the main window wouldn't show again. I'm kinda relieved because I really didn't want to add a huge pause before something happens for the user 😌

Okay, so it looks like Slack "swallows" the first proper window we create. I wonder what happens if we temporarily create an empty window and immediately close it before showing the main window?

![A Roundabout window, open in front of a Slack conversation](/images/roundabout_slack_works.png)<br>🎉It works!

At this point, it's been a few hours debugging this on and off, and a hacky workaround sounds like the perfect solution...

🧹 Time to clean up the code a bit, and hide this monstrosity behind a helper function. 

It would be also good to only do this when starting from Slack, otherwise users would see an empty window flash on screen. Unfortunately there's no good way to find out what is your "parent" program, but the user likely clicked on the link with their mouse, so finding the right window based on the pointer coordinates should suffice.

[Here is the admittedly horrible code that does this](https://github.com/LBognanni/Roundabout/blob/1b8c675c81628b163bb860fc651c19fb9289c04d/src/Roundabout/Program.cs#L68-L88)!


### Fin.

In unraveling the mystery of Slack links not cooperating with Roundabout, we've delved into unexpected corners of Windows application development. With the code tweaks and insights gained, Roundabout now seamlessly handles links from various applications, including Slack.

As with any solution, there's always room for improvement. Considerations for future versions include refining the code further, and perhaps adpoting this workaround for other apps I missed this time. 

If you do find one such case of an app "swallowing" Roundabout, please do [open an issue on Github](https://github.com/LBognanni/Roundabout/issues)!
