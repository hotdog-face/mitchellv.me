---
title: Giving an AI agent a PS Vita
summary: I wanted AI coding tools to test my Vita homebrew on the real console, so I built a bridge that lets an agent see the screen, press buttons and check its own work.
date: 2026-09-27
tags: [AI tooling, Homebrew, Prototyping]
cover: work/vita-agent-bridge/cover
build: vita-agent-bridge
readMinutes: 4
---

While building VitaOS, I kept hitting the same wall. An AI coding tool could write the code and compile it, but it couldn't see what happened on the console. Every change ended with me picking up the Vita, poking through menus and describing the screen back in words.

So I gave the agent eyes and hands.

## Look, act, look again

vita-agent-bridge is a small plugin and service that run on the Vita. Over the network, it can capture the screen, press buttons, tap the touchscreen, launch apps and read files off the memory card. A command-line tool drives it from my Mac, and an MCP server gives the same abilities to AI agents like Claude.

The whole idea fits in three commands:

```
vita.py shot screen.png     # look
vita.py tap 654 444         # act
vita.py shot screen.png     # look again
```

With a screenshot in the loop, an agent can work the console on its own: install homebrew, walk a menu, confirm my app actually booted, or pull a crash log off the card.

## Design decisions

**It lives inside the Vita's own shell.** Existing tools run as a background app, so they get closed the moment a game launches. Running inside the shell means the bridge keeps working while games run, and it can even reset a stuck console.

**Every transfer is checked.** Each upload is verified with a checksum on the console before it counts as done. When an agent is moving files around on its own, "probably worked" isn't good enough.

**It fails closed.** No token file on the console means no open port. A tool that lets software control a device should be off unless you deliberately turn it on.

## What it changed

Testing on real hardware went from something I did by hand to something an agent can do in a loop: build, install, launch, look, fix. It's the same thing I care about in my design work, getting from idea to something you can actually play, just pointed at my own tools.

The source is on GitHub, along with a comparison to the tools it builds on.
