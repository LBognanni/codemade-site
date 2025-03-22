---
title: Announcing email-webhook
author: _data/authors/loris-bognanni.yaml
keywords: email, webhook, email automation, email processing, email filtering, email routing, AI, LLM, GPT-3, OpenAI, email classification, email tagging, email categorization, email prioritization, email management, email productivity, email workflows
excerpt: >-
  I built a SaaS! Email-webhook is a service that transforms emails into API calls. Use it to write email automations, process incoming emails, and build email-based workflows.
date: '2025-03-22'
thumb_image: images/email-webhook.png
image: images/email-webhook.png
layout: post
---


<div class="callout">
  <p>📨</p>
  <p>
    <b>TLDR:</b> 
    I'm excited to announce the launch of <a href="https://email-webhook.com">email-webhook</a>, a service that transforms emails into API calls. Use it to write email automations, process incoming emails, and build email-based workflows.
  </p>
</div>

## What is email-webhook?

As the name suggests, email-webhook is a service for developers that transforms emails into REST requests to your API. It makes integrating an email based workflow into your applications and services a breeze. 

As opposed to traditional email polling techniques, email-webhook sends a request to your endpoint as soon as an email is received. This way, you can process emails in real-time, without the need for complex polling logic.

### Here's how it works:

Once you're signed up, you'll receive a special web address like `you@email-webhook.com`. Any time an email is sent there, email-webhook will send a request to your endpoint.

You can specify the request method, custom headers, and even sender-based rules. This way, you can easily integrate email processing into your existing systems.


## Why email-webhook?

This started a while ago as I was looking for a way to improve the efficiency of my lovely partner's business, using AI to automate her most time consuming tasks. 

One such task was improving her response time to various requests coming from her clients. She was receiving a lot of emails and she was spending **a lot** of time reading and responding to them. Her biggest issue was the "blank screen" problem: she would open an email, read it, and then spend a lot of time thinking about what to do with it.

I thought that I could help her by building a system that would intelligently propose a draft response based on the content of the email plus some external data sources such as her calendar and her CRM.

One of the first steps was to find a way to process emails as they arrived. As a web developer, I'm used to working with APIs, so I thought: "Why not build an API that receives emails as input?"

Of course, the next step was to find a way to get emails into the API! I wanted to avoid polling, so I thought about using webhooks. I started looking for a service that would allow me to receive emails as webhooks, but I couldn't find anything that suited my needs. Every other option was either too complex, too expensive, or too limited.

So I decided to build my own service: [email-webhook](https://email-webhook.com).

## Looking for feedback

Email-webhook is still in its early stages: it's sleek and functional (IMO), but there's still room for improvement. 

This is why I'm offering it for the low low price of *FREE* while I gather feedback and improve the service.

I don't ever plan for email-webhook to be an expensive service, but I would like to offer a paid tier in the future with some advanced features to help me cover the costs of running it. 

## On a personal note

I had a lot of fun building email-webhook. After so many years of having random ideas and never acting on them, it feels great to finally have something concrete to show for it. 

It was a great chance to learn more about the SMTP protocol, and if you've been following my blog, you will probably guess that [I used Deno](/blog/a-journey-through-deno-ssr.md) to build the service 😄. 

I'm excited to see how people will use email-webhook. I've already received some great feedback from early users, and I can't wait to see what they'll build with it.