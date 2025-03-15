---
title: How I deploy my web apps in 2025
author: _data/authors/loris-bognanni.yaml
keywords: docker, docker swarm, web development, software development, devops, deployment, architecture
excerpt: >-
  An overview of how I use Docker and Docker Swarm to manage my personal projects in 2025.
date: '2025-03-15'
thumb_image: images/dockers_sd_s.png
image: images/dockers.png
layout: post
---

The beauty of simplicity has become my north star for hosting web applications. Despite working with complex cloud architectures professionally, I've chosen a straightforward Docker stack for my personal projects. As a solo maintainer, I need something manageable without breaking the bank.

Docker hits that sweet spot between complexity and simplicity, providing enough structure without the overhead of enterprise cloud solutions. My personal projects don't need Kubernetes clusters or managed databases - just reliable, affordable infrastructure.

## The Old Ways: Docker Compose for the Basics

<pre class="mermaid">
flowchart LR
web(Web Request)
subgraph **VPS**
  subgraph docker_compose.yml
    rp[Reverse Proxy]
    codemade_app[codemade.net]
    service_x[Wordpress 1]
    service_y[Postgres]
    service_z[Email forwarder]
  end
end
web -- web --> rp --> codemade_app
rp -->service_x --> service_y 
web -- email --> service_z
</pre>

Initially, my hosting needs were modest - a mail forwarder and a couple of WordPress sites. For this small collection, a simple docker compose setup was adequate. I'd SSH into my server, run commands, and everything would be up and running with minimal fuss.

This hands-on approach worked perfectly - make a change, connect to the server, pull the latest version, and restart containers. Since updates were infrequent and downtime wasn't critical, this manual method suited my needs. My docker compose file was straightforward, defining just the necessary services with basic volume mounts and simple network configurations.

The only "fancy" element was this website, which I've since [moved to 11ty and GitHub Pages](https://github.com/LBognanni/codemade-site/blob/master/.github/workflows/deploy.yml).

## And then I built a web app

<pre class="mermaid">
flowchart LR
web(Web Request)
web --> caddy[/Reverse Proxy/]
app
redis
subgraph **VPS**
  caddy
  subgraph Stats Stack
    app[Stats App]
    redis[(Stats DB)]
  end
end
caddy -.-> app
app <-.-> redis
</pre>

Recently, I built a web application that required a more robust solution. It was time to graduate from docker compose to something more sophisticated.

**Docker Swarm** was the perfect choice as a step up from docker compose without going full Kubernetes-level complexity.

I first heard about this approach from the [DreamsOfCode YouTube channel](https://www.youtube.com/watch?v=fuZoxuBiL9o), where they called it `docker stack`. It's technically Docker Swarm with one node, offering a pragmatic middle ground between my simple setup and complex orchestration tools.

The stack deployment files look almost identical to docker compose files, with just a few additional orchestration-specific options. I took my existing compose file, added deployment constraints and update policies, and it was ready - no steep learning curve required.

I host it on a single but capable **VPS** on **DigitalOcean**, which is more than enough for my needs.

### The Automated Pipeline

Here is my current workflow:

1. Push code changes to GitHub
2. GitHub Actions builds a container image and publishes it to GitHub Container Registry
3. A deployment action ([`shockhs/docker-stack-deploy@v1.2`](https://github.com/marketplace/actions/docker-stack-swarm-deploy-action)) automatically updates my Swarm stack
4. The new version rolls out with zero downtime

You can take a look at a simplified version of my [GitHub Actions workflow](https://gist.github.com/LBognanni/484f420eb7dbc5679f071329a952831b) if you're curious.

### Handling SSL with Caddy

For SSL and routing, I use the excellent [Caddy](https://caddyserver.com) as a reverse proxy. It automatically handles certificate generation and renewal from Let's Encrypt, which is a huge time-saver.

Caddy runs as a separate standalone container outside the Swarm cluster. 
This was a deliberate architectural decision - running the reverse proxy inside the Swarm would mean [losing the originating IP addresses of incoming requests](https://github.com/moby/moby/issues/25526) due to how networking works in Swarm mode. 

By keeping Caddy separate, I maintain visibility of client IPs for proper logging and security monitoring. 
It also means my reverse proxy isn't tied to the lifecycle of my applications. It gets its own repo, and its own deployment pipeline.

### The Results

This setup strikes the perfect balance:
- **Automated**: No manual SSH sessions for routine deployments
- **Reliable**: Rolling updates ensure zero-downtime deployments
- **Maintainable**: Everything is defined in code and version controlled
- **Affordable**: More cost-effective than equivalent managed cloud services

## And then there were more

<pre class="mermaid">
flowchart LR
web(Web Request)
web --> caddy[/Reverse Proxy/]
app
redis
subgraph **VPS**
  caddy
  subgraph Stats Stack
    app[Stats App]
    redis[(Stats DB)]
  end
  subgraph Games Stack
    gapp[Games App]
    gdb[(Games DB)]
  end
end
caddy -.-> app
app <-.-> redis
caddy -.-> gapp
gapp <-.-> gdb
</pre>

Docker Swarm excels at scaling to multiple applications. Adding a new web app was straightforward - I created a new stack definition file and deployed it to the same swarm.

This provides independent deployment lifecycles for each application. I can update, restart, or delete one app without affecting others. Each stack gets its own isolated network by default, though they can communicate with each other if needed through overlay networks.

## Looking forward

<pre class="mermaid">
flowchart LR
web(Web Request)
web --> caddy[/Reverse Proxy/]
subgraph VPS4
  subgraph Stats Node / 3
    app4[Stats App]
    redis4[(Stats DB)]
  end
end
subgraph VPS3
  subgraph Stats Node / 2
    app3[Stats App]
    redis3[(Stats DB)]
  end
end
subgraph VPS2
  subgraph Stats Node / 1
    app2[Stats App]
    app21[Stats App]
    app22[Stats App]
    redis2[(Stats DB)]
  end
end
subgraph **VPS 1**
  caddy --> other[other serivces]
end
caddy -.-> app2
app2 -.-> redis2
app21 -.-> redis2
app22 -.-> redis2
caddy -.-> app3
app3 -.-> redis3
caddy -.-> app4
app4 -.-> redis4
style other stroke-dasharray: 5, 5;
style VPS2 fill:#fff4,stroke-dasharray: 5, 5;
style VPS3 fill:#fff4,stroke-dasharray: 5, 5;
style VPS4 fill:#fff4,stroke-dasharray: 5, 5;
</pre>

Should one of my services become a runaway success, I can move it to its own VPS and scale independently, either by increasing VPS size or adding replicas to the swarm stack. For further growth, adding more VPSs to the same swarm would be the next step.

But that's a problem for another day! 😎

<script defer src="https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js"></script>
