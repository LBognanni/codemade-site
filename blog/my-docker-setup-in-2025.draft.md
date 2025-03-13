---
title: How I deploy my web apps in 2025
author: _data/authors/loris-bognanni.yaml
excerpt: >-
  An overview of how I use Docker and Docker Swarm to manage my personal projects in 2025.
date: '2025-02-07'
thumb_image: images/dockers_sd_s.png
image: images/dockers.png
layout: post
---

## Version 0
one docker-compose file for everything

<pre class="mermaid">

flowchart LR

web(Web Request)

subgraph **VPS**
  subgraph docker_compose.yml
    codemade_app[CodeMade web]
    service_x[Service X]
    service_y[Service Y]
    service_z[Service Z]
  end
end

web --> codemade_app
web --> service_x --> service_y 
web --> service_z
</pre>

## Version 1
moving the stats service out to a docker stack

<pre class="mermaid">

flowchart LR

web(Web Request)

subgraph **VPS**
  subgraph Docker Stack
    caddy[/Reverse Proxy/]
    stats_app[Stats App]
    stats_redis[(Stats DB)]
  end
end

web --> caddy
caddy --> stats_app
stats_app <-.-> stats_redis
</pre>

## Version 2
Moving the reverse proxy out of docker stack

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

## Version 3
Adding a new stack for the games service

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



## Looking forward

Should one of my services become a runaway success, I'll likely look into moving it to its own VPS. This would allow me to scale it independently of the rest of my services, by adding more replicas to the swarm stack. Scaling in this case would mean increasing the size of the VPS, or moving to a more powerful one.

In case of even more growth, adding more VPSs joined to the same swarm would be the next step.

<pre class="mermaid">

flowchart LR

web(Web Request)
web --> caddy[/Reverse Proxy/]


subgraph VPS4
  subgraph Stats Stack / 3
    app4[Stats App]
    redis4[(Stats DB)]
  end
end

subgraph VPS3
  subgraph Stats Stack / 2
    app3[Stats App]
    redis3[(Stats DB)]
  end
end


subgraph VPS2
  subgraph Stats Stack / 1
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

<script src="https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js"></script>