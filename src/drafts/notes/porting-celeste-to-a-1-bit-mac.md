---
title: Porting Celeste to a 1-bit Macintosh
summary: Fitting a modern platformer onto a 7.8 MHz Mac with no color, no floating-point unit and System 6.
date: 2026-08-12
tags: [Retro, Game dev, Constraints]
cover: work/classic-mac/cover
build: classic-mac
readMinutes: 3
---

Celeste Classic started as a PICO-8 game in 2015. I wanted to see it run on the original black-and-white Macintosh: a 7.8 MHz 68000 running System 6, with no floating-point unit, no color and a 1-bit screen.

## The constraints did the design work

Every frame has to read in pure black and white, so the art translation mattered as much as the code. And with no floating-point unit, all the game's math runs on fixed-point numbers instead.

## How it's built

The game logic is a C port of the original. Around it I built a Mac layer (window, event loop and a fixed-timestep loop), a from-scratch version of PICO-8's drawing calls, and a drawing path tuned for the 68000. It's built with the Retro68 cross-compiler on a modern Mac and runs on a real Mac Plus, SE or Classic, or in an emulator.

All of the game design, art, music and levels belong to Celeste's original creators. This is a port, not a remake.
