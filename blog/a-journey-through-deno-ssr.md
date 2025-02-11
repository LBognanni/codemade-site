---
title: A journey through Server Side Rendering in Deno
author: _data/authors/loris-bognanni.yaml
excerpt: >-
  A .net developer's tale of navigating typescript, deno, and server side rendering. 
date: '2025-02-11'
thumb_image: images/typescript-landscape_sm.jpg
image: images/typescript-landscape.jpg
layout: post
---

As a longtime .net developer, I've always preferred languages with strong typing. I find that I can reason about the code much better if I understand what data structures are required by a function call, and what it will return.

Naturally, this means that when doing any frontend work, I tend to reach for TypeScript. I find it's a welcome improvement over vanilla JavaScript, especially when using typed third-party libraries.

There is only one catch: setting up typescript, esm modules, and bundling can be really painful when you're just trying to get a simple project off the ground. Soon you're 2 hours in, and you're still trying to figure out why your imports aren't working.

This is where Deno comes in! Built by the creators of Node.js, deno sets out to undo the mistakes of their previous project. It has built-in support for TypeScript, esm modules, and even has a built-in bundler. This means that I can write all my code in TypeScript, and run it without any additional setup. It also does away with the `node_modules` folder, which makes my hard drive very happy.

So, when starting a new project recently, I decided to give Deno a try. The project is a simple server-side rendered web application, with a bit of interactivity sprinkled in.

It's now been a few weeks, and I've been through several iterations. Here is _my_ journey through server-side rendering in Deno.

## Deno has a built-in web server??

Yes, yes it does. Using the builtin `Deno.Serve()` function, you can create a simple web server [in just a few lines of code](https://docs.deno.com/api/deno/~/Deno.serve).

The only downside of this approach is that you'll have to handle absolutely everything yourself. This means parsing the request, handling the response, and even serving static files. This is easy enough for a simple project, but it can quickly become unwieldy as your project grows.

## Shopping for a framework

After deciding that I didn't want to write my own web server, I started looking for a lightweight framework that would handle the heavy lifting for me. I quickly found [Oak](https://oakserver.org/), a simple framework for Deno that is very similar to Express.js.

Oak has built-in support for things like middleware and routing. It seemed like a great choice for a simple project, and it's easy to get started with.

The next step was to figure out a way to go beyond serving API endpoints and start rendering HTML on the server. This is where things started to get interesting.

## Shopping for a templating engine

### Handlebars

When thinking of templating engines, my first idea was to use good old [Handlebars](https://handlebarsjs.com/). I had never used it before, but I remember it being all the rage a few years ago, so I figured it must be good. Right? *Right??*

It was... below my expectations. And by "below my expectations" I mean *"It makes me want to stab myself"*. The syntax, oh the syntax!! I have nothing but compassion for anyone who has to coexist with it.

The last straw was when I had to declare a helper function to compare two values. I had to write a helper function to compare two values. In a templating engine.

### ejs

After a good old web search for "handlebars alternatives", I stumbled upon [ejs](https://ejs.co/). 

As a .net developer, I was immediately reminded of Razor Pages / MVC. Simple, clean, and easy to use. I was sold.

...it did however come with its own set of quirks. For example, it doesn't have the equivalent of "Layouts" in Razor. This means that you have to manually include the header and footer in every page. It also has even weirder syntax than Razor, with various combinations of percent signs and angle brackets.

But mainly, the thing I was really missing until now was being able to **unit test my UI**. Not knowing if my partials were rendering correctly until I manually tested them in the browser was a pain.

In the end, I found that while the syntax was cozy and familiar, the web has moved on. I wanted something more modern, more... reactive. I wanted, in fact, React.

### Detour to the promised land of Deno Fresh

Before I could start using React, I had to figure out how to get it to work with Deno. This is where I found [🍋 Deno Fresh](https://fresh.deno.dev/). Fresh is Deno’s answer to Next.js. With built-in support for JSX and an "islands" architecture that prioritizes minimal client-side JavaScript, it looked very promising.

I quickly cloned the example repo on my machine to try it out. It worked great. Sure, it's extremely opinionated, but I can live with that.

I decided to try converting one of my ejs partials into a jsx component right inside the example project. Easy. Done. I was sold. Writing JSX instead of ejs felt natural, the way it was supposed to be all along.

At some point, however, things started to fall apart. 

Testing components, for example, is not really supported out of the box. There's [an open issue on github](https://github.com/denoland/fresh/issues/427) and the consensus seems to be... let's wait for Fresh 2.0.

As far as I understand it, the wind behind Fresh's sails is now more like a gentle breeze. 
It seems that the team has been busy working on Deno itself, and Fresh has been left behind.

I notice as I write this that the [last official blog about it](https://deno.com/blog/fresh-1.6) dates December 1, 2023, which is about 10 years in trendy javascript framework time.

### But I like react! Maybe I can salvage this?

So it turns out that Deno Fresh uses `preact-render-to-string` under the hood to transform JSX components into HTML.

> With some clever refactoring, I'm sure I can just replace my ejs Oak middleware with a React one!
  
  -famous last words

So I did! I created a new middleware that would render my React components server-side, and it worked like a charm. If you're curious to see what it looks like, [here is a github gist with the code](https://gist.github.com/LBognanni/4ce0247276b7cd77e72a9cc014cd6e12) 🙂 

I now had a working server-side rendered web app in Deno under my belt. I was happy with the result, even if it felt a bit of a Frankenstein's monster.

## And then I built a second project

Some time later, I wanted to start a new project. Similar requirements, so I figured I could just copy-paste the code from the first project and be done with it.

But then I thought,

>  If I need this, maybe others do too? Maybe I should make a library out of it? Maybe I should make my own framework? One framework to rule them all! 😈

Yeah, no. No thanks Satan. I'm good.

An important requirement of my second project was user management, authentication, and authorization. 

[Better-Auth](https://better-auth.vercel.app/) looked exactly like the kind of thing I needed. Fully featured, popular, good documentation. I had absolutely no intention of trying to bend my own little framework to work with it. I just wanted to get my project done.

I also had the nagging feeling in the back of my head that I was just _writing too much code_ for something that should be simple.

## Enter Hono

The first backend framework that is mentioned in Better-Auth's documentation is [Hono](https://hono.dev/). I decided to take a look.

Hono does everything I was trying to build manually—but better. It has [built-in JSX support](https://hono.dev/docs/guides/jsx#jsx), a router, and great documentation. The best thing is that I don't have to support any of it myself!

It also looks almost exactly like Oak, so that was already a plus.

Unsurprisingly, building my second project was a much smoother experience.

## Conclusion

This was a long journey, but a rewarding one. The nice thing was that at every point during my first project I ended up having something that was working, and that I could build upon.

Refactoring my code to use the next thing was luckily always pretty easy, and I was able to learn a lot along the way.
 
One thing I learned is that it's easy to fall into the trap of doing everything "the Deno way", and assuming that a library or framework that's written for Deno is the best choice.

In reality, it's important to evaluate each library or framework on its own merits, and choose the one that best fits your needs. 

Frameworks like Hono that are built for multiple runtimes are obviously going to be more popular and better maintained than something that's built for Deno only. 

The great thing about Deno is that you can reference npm modules directly (without worrying about terabytes of `node_modules`), so you really have the whole JavaScript ecosystem at your disposal.

### 🔑🥡 Key Takeaways:

- Don’t assume that a library made for Deno is always the best choice—evaluate based on actual needs.
- Multi-runtime frameworks like Hono tend to be better maintained and more flexible.
- Deno’s ability to use npm modules expands its ecosystem significantly.
- Don’t be afraid to refactor and try new things — each iteration can teach you something new!