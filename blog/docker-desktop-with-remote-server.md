---
title: Running Docker in Windows without virtualization
author: _data/authors/loris-bognanni.yaml
excerpt: >-
  What do you do when you need to run Docker, but don't have virtualization support on your machine? You can connect Docker Desktop to a remote server!
date: '2025-01-21'
thumb_image: images/vms_sm.jpg
image: images/vms.jpg
layout: post
---

Docker is an essential tool for developers. It allows you to run applications in isolated containers, making it easy to manage dependencies and run the same code in different environments. 

However, on Windows Docker requires virtualization support, which may not always be enabled or available. Even when using WSL2 as an alternative to Hyper-V, your machine must still support and enable Hyper-V.

Recently I needed to run docker on a Windows virtual machine, running inside VirtualBox on a Linux host. 

Contrary to KVM/QEMU, VirtualBox does not support nested virtualization, _unless_ you're using VirtualBox inside the VM too. 

What VirtualBox offers, however, is much better (read: acceptable) video hardware acceleration compared to QEMU - and for someone like me who spends more time attending remote meetings than running containers, this is a good tradeoff.

I _do_ however need to run containers from time to time, and having to switch to a different machine just for that is a bit of a hassle.

<div class="callout">
<p>⚠️</p>
<p>
  <strong>Important!</strong> We're going to install Docker Desktop in this guide &mdash; however, without Hyper-V <strong>you won't be able</strong> to run the docker engine or <strong>do anything in the GUI</strong>.
</p>
<p>
  Instead, we're relying on Docker desktop to provide the <code>docker</code> command line tool, which we'll be using to connect to a Linux server.
</p>
</div>

## Step 1: Install Docker Desktop



Most online resources will point you to Docker Toolbox, which as of 2025 is a legacy solution that is no longer maintained. While you _can_ still download it and install it, it's stuck on a very old version of Docker and is missing some crucial components like `buildx`.

Here is the link to the [Docker Desktop download page](https://docs.docker.com/desktop/setup/install/windows-install/).

Docker Desktop should install just fine, but of course it will complain if you try to run it.


## Step 2: Install Docker on the remote server

If you haven't already done so, you'll need to install Docker on the remote server. There are plenty of resources online on how to do this, so I won't go into details here. The official docker docs have plenty of information on how to install Docker on different platforms. 

[Here's the link to the instructions for Ubuntu](https://docs.docker.com/engine/install/ubuntu/).

Be sure to add your user to the `docker` group so you can run docker commands without `sudo`.


## Step 2: Enable ssh on the remote server

You'll need to be able to connect to the remote server via ssh. If you're using a cloud provider, you'll likely already have this set up. If you're using a local server, or Desktop Ubuntu, you'll need to install an ssh server. 

This is simply done by running:

```bash
sudo apt install openssh-server
```

You'll likely also need to open the ssh port on your firewall. 

```bash
sudo ufw allow ssh
```

## Step 3: Configure Docker Desktop

Easy peasy. You just need to set an environment variable to tell Docker Desktop to connect to the remote server. 

Try it out in a terminal window. First, set the variable:

```sh
$env:DOCKER_HOST="ssh://your-username@your-server:22"
```

Then run a docker command:

```sh
docker ps
```

You should get a prompt asking you to accept the server's fingerprint, then another prompt asking for your password. If everything goes well, you should see the list of containers running on the remote server. (none if you just installed Docker)

## Step 4: Configure a Persistent Environment Variable

You don't want to have to set the environment variable every time you open a terminal window. Instead, we can set the environment variable for all of Windows. 

Right-click on the start button and select "System". Then click on "Advanced system settings" and then "Environment Variables". 

Add a new system variable with the name `DOCKER_HOST` and the value `ssh://your-username@your-server`.

Any new terminal window you open will now be using the environment variable, and docker commands will connected to the remote server.

## Step 5: Usability improvements

As it is, Docker will ask for your password every time you run a command. This can be a very annoying, especially if you're running a lot of commands. Some commands, like `docker buildx build` implicitly run multiple docker commands, so you'll be asked for your password multiple times.

Instead, we can use ssh keys to authenticate.

On your Windows machine, generate a new ssh key pair:

```sh
ssh-keygen
```

You'll be asked where to store the key. Be sure to enter this path: `C:\Users\your-username\.ssh\id_rsa`. This is the default path where Docker will look for the key. (Some guides will tell you to just accept the default path, but doing so made the ssh-keygen command hang indefinitely in my case.)

You'll be then asked for a passphrase. I recommend leaving this empty so you don't have to enter it every time you run a docker command.

The next step is to copy the public key to the remote server. You can do this with the `ssh-copy-id` command, but this command is not available on Windows. 

Instead, we can copy the key manually.

First, print the public key:

```sh
cat ~\.ssh\id_rsa.pub
```

Copy the whole line that is printed.
Next, connect to the remote server and add the key at the end of the `authorized_keys` file, using your favorite text editor (`nano` in this case):

```sh
ssh your-username@your-server
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
```

This is it! You should now be able to run docker commands without being asked for your password. Try by running `docker ps` again in a new terminal window.

## Conclusion

While this article focussed on connecting docker to a local server, you can also follow the same steps to connect to a server in the cloud. 

This can be useful if you want to run docker commands on a more powerful machine, or if you want to run docker commands on a machine that is serving web traffic to the internet!