---
title: "The case of the unhappy CloudFront distribution"
author: _data/authors/loris-bognanni.yaml
excerpt: >-
  How to spend a weekend debugging a CloudFront distribution that doesn't want to work. A murder mystery where I'm both the investigator, and the murderer.
date: '2024-06-29'
thumb_image: images/cloudfront-is-not-happy.png
image: images/cloudfront-is-not-happy.png
layout: post
tags: 
  - aws
---

For fun, and as a learning experience, I'm building a very simple comment system for this blog.

Currently codemade.net is a simple static website built by Jekyll everytime I push to the `main` branch on its [GitHub repo](https://github.com/LBognanni/codemade-site).
This is a relatively common setup for smaller websites, and it has the benefit of being extremely fast and cheap to host. 

There are a number of third party comment systems floating around the internet, but they all have some drawbacks. Some are just too expensive for a small website like mine, others are advertising platforms in disguise, and others still are just too complicated to set up. Perhaps this is why a lot of people rely on social media for comments.

I wanted to build something that was simple, cheap and cheeful. I also wanted to get hands on with tools I rarely use, like ASP.net Core on Lambda, HTMX, terraform, CloudFront, etc.

It follows a relatively common pattern: all the static content is stored in S3, while the dynamic APIs are served by Lambda functions. An HTTP API gateway is used to route requests to the correct Lambda function, and CloudFront sits in front of everything to provide caching, routing, and SSL.

![The architecture of the comment system](/images/basic-website.png)

I built and deployed this in pieces, starting with the main Lambda function. I set it up to serve both the frontend (a simple HTML page), and the backend: a GET endpoint to return the comments for a post, a PUT endpoint to post a new comment. I tested it locally, and it worked fine. 

I deployed it to AWS, behind an API Gateway, and surprisingly, it worked!

I then decided to add CloudFront in front of the API Gateway, and store the static content in an S3 bucket. 

When configuring CloudFront, one must set up one or more "Origins" (the places where CloudFront will fetch the content from). I set up two origins: the default one being S3 where `index.html` is stored, and the API Gateway, only for the `/comments/*` path.

Deploy the distribution, and yes! The index page loads, and navigating to a comments page brings up a list of comments.

Try posting a comment however, and... this happens:

![CloudFront returns HTTP 403](/images/cloudfront-is-not-happy.png)

Soo, somehow GETting the comments works, but PUTing a comment doesn't.

I started debugging by looking at each piece of the puzzle:
 - **Does the lambda work?** Yes, testing the lambda in isolation yields the expected result (a comment is posted)
 - **Does the API Gateway work?** Yes, invoking the API gateway URL directly calls the lambda and posts a comment
 - **Did I set up the CloudFront distribution correctly?** I think so, but let's check the settings. I double-checked the origins, and they look fine. I also checked the behaviors, and indeed requests to `/comments/*` are routed to the API Gateway *(of course they are! GET requests work!)*
 - Maybe it's a caching issue? I tried invalidating the cache, but it didn't help.
 - Maybe it's a CORS issue? I tested by directly invoking the PUT endpoint via Postman, and it worked. So probably it's not that.

Hmm. Perhaps the CloudFront logs could help me? I enabled logging, and tried to post a comment. I then waited for a few minutes, and checked the logs:

![CloudFront logs](/images/cf-logs-1.png)

(shoutout to the [Rainbow CSV](https://marketplace.visualstudio.com/items?itemName=mechatroner.rainbow-csv) Vs Code extension for making this somewhat readable!)

It's a bit hard to follow, but we can see 3 requests: the first two are GET requests to the `favicon.ico` resource (presumably served from S3), and to the a comments page (served by the API Gateway). The third request is a PUT request to the same comments page, and it returns a 403 status code. 

The `x-edge-result-type` field simply says `Miss` for the GET requests (ie they were not in CloudFront's cache) and `Error` for the PUT request. Not very helpful.

The `x-edge-detailed-result-type` field looks interesting. It says `InvalidRequestMethod` for the PUT request.

**Could it be that I didn't allow PUT requests on the Api Gateway origin?**

I checked my terraform code, and nope, all HTTP methods are allowed for that origin 🤔

So I started googling (well *duckduckgoing*) for every combination of "CloudFront", "InvalidRequestMethod", "403", "PUT", "API Gateway" I could think of. 

I found some StackOverflow posts where folks were having similar issues, but they were all related to not having configured one of the three components (CloudFront, API Gateway, S3) correctly. I double, triple, quadruple checked my configuration, and it all looked fine.

Out of desperation, I tried mixing things up a bit. I changed the CloudFront distribution to have only one origin: the API Gateway. I then tried posting a comment, and... it worked! But why?

I was really tempted to just leave it at that, but the nagging voice at the back of my head, complaining that I would have to invoke the lambda for each. single. static. asset. was too loud.

*Obviously* the moral imperative is to have the static content served from S3 (it's cheaper, faster, and more reliable). So I re-enabled the S3 origin, and tried posting a comment again. And... back to not working, of course.

Okay. Time to take a step back. Go for a walk. Clear my head.

It's the next day, and I'm back at it. Time to try and simplify things a bit.

Perhaps my terraform code was too complex, or it was missing something? I decided to try and set up the CloudFront distribution manually, using the AWS console. Manually add both origin, set up the behaviors, and deploy.

Nope, same issue.

There must be a reason.

Maybe I can look at the CloudFront logs again? There are so many fields. Maybe I missed something? Maybe if I cross my eyes just right it will dawn on me?

And oh yes, dawn on me it did. The stupid, obvious little thing that I missed. Let me highlight it for you:

![CloudFront Logs showing a capitalization error on my PUT requests](/images/cf-logs-2.png)

Do you see it? The GET request is being sent to `/comments/foo/bar`, but the PUT request is being sent to `/Comments/foo/bar`. Capital C. FML 😩

So CloudFront was directing our PUT request to the S3 origin, which of course didn't have the PUT method enabled, and returned a 403.

Fun fact, because my API gateway was set to proxy all traffic to my lambda, it didn't care about the capitalization. But CloudFront does.

AWS explicitly call this out in their [documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesPathPattern):

![A screenshot of the link above](/images/cf-path-patterns.png)

And the best part? Not only I *knew* about this, I must have read that page at least 15 times while debugging this. 

### Conclusion

Anyway, to make a long story short, I fixed my frontend code to PUT to the right path, everything started working as expected 🎉

---

I hope you enjoyed this little story. I certainly learned a lot about CloudFront, API Gateway, and Lambda while debugging this. My desk has a fresh head-shaped indentation, but *c'est la vie*.

Oh, and the comment system is not ready yet 😅, so feel free to discuss this on HN, or Reddit 😅