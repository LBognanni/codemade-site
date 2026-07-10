---
title: "Email-webhook gets two security upgrades"
author: _data/authors/loris-bognanni.yaml
excerpt: >-
  Inbound mail now arrives over TLS end to end, and every webhook can be signed with a per-webhook HMAC secret, so you can trust both legs of the trip from sender to your endpoint.
date: "2026-07-11"
thumb_image: /images/email-webhook-safer.jpg
image: /images/email-webhook-safer.png
layout: post
---

[Email-webhook](https://email-webhook.com) lets you receive emails straight into
your own application via a webhook.

I've been chipping away at two security things lately, and they landed
around the same time, so here they both are: mail delivered to your address is
now **encrypted in transit**, and you can now **sign outgoing webhook
requests** so your endpoint can check they really came from email-webhook.

## Encrypted inbound mail (STARTTLS)

Previously, mail from a sending server to email-webhook crossed the network in
plaintext, which, honestly, is how most email still travels today. I've
turned on STARTTLS on the inbound SMTP server, and made it required rather
than optional: every message to your `@email-webhook.com` address now has to
arrive over an encrypted connection.

Basically every real mail provider already speaks TLS: Gmail, Outlook,
Yahoo, Apple Mail, SES, SendGrid, Mailgun, Postmark, all of it. So you
shouldn't notice a thing.

> If you're forwarding from some old self-hosted box that never got TLS set
> up, that delivery will now fail.

## Verify your webhooks with HMAC signatures

Until now, the only way to lock down your webhook endpoint was a custom
header: an API key or bearer token you'd check on every request.

That works, but it comes with limitations: if it ever leaks into a log or a proxy,
anyone who has it can replay it forever, and it says nothing about whether the
body of the request is actually genuine.

So I added a stronger option: **HMAC-SHA256 request signing**.

### How it works

Open any webhook's settings and you'll find a new **Signing secret** field.
New webhooks get one generated automatically; clear it any time to turn
signing off.

When a secret is set, every non-`GET` delivery includes two extra headers:

-  `X-Timestamp`: Unix timestamp (seconds) when the request was sent
-  `X-Signature-256`: hex-encoded HMAC-SHA256 signature


The signature is computed over `{timestamp}.{body}` using your secret as the
HMAC key. The secret itself never travels over the wire, only a signature
derived from it does, so a leaked signature is useless for any other
request. There's nothing for an attacker to steal by inspecting a single
delivery.

### Why the timestamp matters

Folding the timestamp into the signed data buys you replay protection for
free. If your server rejects any request whose `X-Timestamp` is older than a
few minutes, then even if someone captures a genuine, correctly-signed
request, replaying it later will fail the freshness check.

This is much simpler than tracking the `x-email-webhook-id` of every request to avoid replay attacks and storing them in a database, and it works even if your endpoint is stateless.

> [Read the full guide, including Node and Python examples of checking the HMAC signature, in the docs](https://email-webhook.com/docs/authentication).

### Rolling out safely

Signing is entirely **opt-in**: existing webhooks are untouched until you add
a secret, so nothing changes for current integrations unless you choose it.
`GET` webhooks aren't signed, since they carry their payload in the query
string and there's no body to sign.

Encrypted inbound mail, by contrast, is on for everyone.

## Overall

There's still more to do, of course. But these two changes are a big step forward for email-webhook.

Email is a very private medium, and my goal is for email-webhook to be a safe and secure way to receive it in your own applications. These two changes make it safer than ever before.

Encrypted in transit, end to end, from your mailbox to your endpoint.
