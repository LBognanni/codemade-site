---
title: How to combine Docker and VSCode to reach development nirvana
author: _data/authors/loris-bognanni.yaml
excerpt: >-
  Use this extension to DESTROY your set up times and make your team productive NOW!
date: '2020-10-10'
thumb_image: images/vscode-docker-jekyll_thumb.png
image: images/vscode-docker-jekyll.png
layout: post
---

One of the best features in VS Code, and my personal favourite is called [Remote Containers](https://code.visualstudio.com/docs/remote/containers). 
What it does is open the folder you're working on _inside_ a container and then connect to it, so that you can, for example, run your jekyll site on windows without having to install ruby system-wide. Because all the development is done inside the container, you don't have to worry about having multiple versions of node or python cluttering your machine.

This is especially useful if your main OS is Windows, as getting set up with some languages is notoriously tougher there.

Working in a devcontainer has also the advantage that all the settings can be committed into source control, so you can share the exact same development environment with the rest of your team. No more 15-step procedure to follow to set up the local dev environment!

Getting started is really simple: 

 - Install the `Remote - Containers` extension
 - Press F1 to open the command palette
 - Run "Open folder in container" command
 - Select "From a predefined container definition" 
 - Select the most appropriate container image.

This will create:

 - A `.devcontainer` folder in your project, containing:
 - A `dockerfile` for the development container 
 - A file named `devcontainer.json` that is mostly used to define any ports that should be forwarded to the host
 
You can now open the integrated terminal and type commands directly in your container! 

## An example: this website

I love the simplicity that comes with static site generators, and [jekyll](https://jekyllrb.com) is by far the most popular choice. Using a development container setup allows me to edit and test any change on all my computers, without having to install ruby, bundler or any of jekyll's dependencies.

This is the dockerfile I use for my jekyll devcontainer. It's a slightly modified version based on the official Microsoft one from some time ago; I had to add a line to install `zlib1g-dev` otherwise it wouldn't work 😅.

{% gist LBognanni/ed91a3b29089b85a23e67bbdafaa10c2  %}

Now, when I open the repository in Visual studio code, I just have to run `bundle exec jekyll serve` in the integrated terminal to run it. The container exposes port 4000 so I can just open http://localhost:4000 in my browser and preview the changes.
What's more, if port 4000 is already used by another program, when clicking on the localhost link in the terminal, VS Code will transparently open the site on a different port!

Found this useful? Want to add something? [Reach out on twitter](https://twitter.com/lorisdev)!