---
title: "How to use Deno's own SQLite module on Alpine Linux"
author: _data/authors/loris-bognanni.yaml
excerpt: >-
  Learn how to use Deno with SQLite on Alpine Linux for lightweight, efficient web applications.
date: '2026-01-18'
thumb_image: images/deno-sqlite-ws.png
image: images/deno-sqlite-ws.png
layout: post
---

Deno's built-in SQLite module is a fantastic way to integrate a lightweight database into your Deno applications.
However, to work its magic, it relies on a native SQLite library that needs to be present in your environment.

If you're running one of Ubuntu, MacOS, or Windows, you're in luck: Deno has you covered with [precompiled binaries for these platforms](https://github.com/denodrivers/sqlite3/releases/). But if you're using Alpine Linux, things get a bit trickier since Deno doesn't provide a precompiled SQLite library for this distribution.

Try to run a Deno application that uses SQLite on Alpine Linux without any additional setup, and you'll get an error like this:

```
3.013 Downloading https://github.com/denodrivers/sqlite3/releases/download/0.13.0/libsqlite3.so
4.094 error: Uncaught (in promise) Error: Failed to load SQLite3 Dynamic Library
4.094   throw new Error("Failed to load SQLite3 Dynamic Library", { cause: e });
4.094         ^
4.094     at https://jsr.io/@db/sqlite/0.13.0/src/ffi.ts:642:9
4.094 Caused by: Error: Could not open library: Could not open library: /usr/local/lib/libm.so.6: version `GLIBC_2.38' not found (required by /deno-dir/plug/https/github.com/2d624d1cb94dc52a04dcb942d98592ad72012273e34867346f5dde5d01035183.so)
4.094     at new DynamicLibrary (ext:deno_ffi/00_ffi.js:457:42)
4.094     at Object.dlopen (ext:deno_ffi/00_ffi.js:563:10)
4.094     at dlopen (https://jsr.io/@denosaurs/plug/1.1.0/mod.ts:158:15)
4.094     at eventLoopTick (ext:core/01_core.js:187:7)
4.094     at async https://jsr.io/@db/sqlite/0.13.0/src/ffi.ts:625:7
```

What this tells us is that Deno attempted to download a precompiled SQLite library that depends on `glibc`, the GNU C Library. However, Alpine Linux uses `musl` as its standard C library, which is not compatible with the prebuilt sqlite binary.

Luckily, Deno can use any precompiled SQLite library that matches its expected version. 
For Alpine Linux, you can leverage the `libsqlite3` package available in the Alpine repositories.

You can install it using the `apk` command:

```sh
apk add libsqlite3
```

This command installs the necessary SQLite library on your Alpine system, however in order for Deno to find and use it, you will need to set the `DENO_SQLITE_PATH` environment variable to point to the location of the installed library.

You can find the library at `/usr/lib/libsqlite3.so.0` after installation.
Set the environment variable like this:

```sh
export DENO_SQLITE_PATH=/usr/lib/libsqlite3.so.0
``` 

## That's nice and all but I use Docker?

Easy peasy! Here's a simple Dockerfile that sets up a Deno environment on Alpine Linux with SQLite support:

```Dockerfile
# Use the official Deno Alpine image as the base
FROM denoland/deno:alpine-2.6.5

# Expose port 8000 for the application
EXPOSE 8000

# Install system SQLite library
RUN apk add --no-cache sqlite-libs

# Set working directory and permissions
WORKDIR /app
RUN mkdir /app/data && chown -R deno:deno /app
USER deno

# Copy deno.json and deno.lock files
COPY deno.* .

# Set the DENO_SQLITE_PATH environment variable to point to the installed SQLite library
ENV DENO_SQLITE_PATH=/usr/lib/libsqlite3.so.0

# Pre-install app dependencies
RUN deno install --frozen=true
# Force Deno to load the SQLite module and download any necessary files, ensuring everything is set up correctly
RUN deno eval "import 'jsr:@db/sqlite';"

# Copy application source code
COPY src/ ./src/
# Install any other dependencies
RUN deno install --entrypoint src/main.ts

# Command to run the application (assumes you have a `prod` task in your deno.json)
CMD ["deno", "run", "prod"]
```

## Wrapping Up

Hope this was helpful to you, random internet stranger! It certainly took me a bit of digging to figure this out, so hopefully this saves you some time! 🙃