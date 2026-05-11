---
title: "New in email-webhook: new design, logs and a status page!"
author: _data/authors/loris-bognanni.yaml
excerpt: >-
  Introducing opt-in logs for email-webhook, and a status page to keep you informed about the health of the service.
date: '2026-05-11'
thumb_image: /images/email-webhook-2026.jpg
image: /images/email-webhook.png
layout: post
---

[Email-webhook](https://email-webhook.com) the service I built to let you receive emails in your own applications, has been running smoothly for a while now.

But, as with any service, there are always things that can be improved. 

The first thing you'll notice if you load the website is that it has a new design! I wanted to make it look more modern and clean, and I think I've achieved that:

![The new email-webhook homepage, with a clean and modern design](/images/email-webhook-2026.png)

But a fresh coat of paint is only the beginning!

## Introducing opt-in logs

![The new logs page, showing a list of received emails and their status](/images/email-webhook-logs.png)

Imagine this: you're using email-webhook to receive emails in your application, and something goes wrong. Maybe the emails aren't being delivered, or maybe they're being delivered but your application isn't processing them correctly. 

In the past, you would have no way of knowing what was going on. You would have to guess, and maybe even contact support to get some answers.

Now, with the new opt-in logs feature, you can see exactly what's going on with your email-webhook account. You can see when emails are being received, when they're being processed, and if there are any errors along the way.

**Note: logs are opt-in, so you have to enable them in your webhook settings to start seeing them.** 

This is because logs can contain sensitive information, such as the sender address, and the subject of the email (*we never log the body of the email or store attachments*). 

By making them opt-in, you have full control over your data and your privacy.

[You can read more about the logs feature in the documentation page](https://email-webhook.com/docs/message-logs).

## A status page to keep you informed

It's now easier than ever to keep track of the health of the email-webhook service. The new status page shows you the current status of the service, as well as any incidents or maintenance that might be happening.

It's located at [status.email-webhook.com](https://status.email-webhook.com).

## More to come!

This is just the beginning of a new era for email-webhook. I have many more features and improvements planned for the future, so stay tuned!