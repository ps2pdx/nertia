---
title: "Field notes — launching Zen Holo"
date: "2026-04-12"
slug: "zen-holo-weekend"
excerpt: "Spent the weekend building a YouTube channel that renders 3-hour ambient visual loops out of Blender. Here's where things stand."
tags: ["zen-holo", "blender", "pipeline", "field-notes"]
---

Spent the weekend standing up **Zen Holo** — a YouTube channel for long-form 3D ambient loops. 3+ hour videos. Dark, minimal, slow. The pitch to myself: a *sensory dispensary*, where each drop is a "formulation" tuned for a particular headspace. Focus, wind-down, wall-art, ADHD low-sensory, whatever you're dialing in.

First one shipped tonight: **Stone & Water 001** — dark water over warm stones in golden hour light, with a holographic hummingbird that breathes in and out of a half-formed shutter smear above the scene. 3 hours. Ambient techno under it.

Watch here: [youtube.com/@zenholo12](https://www.youtube.com/channel/UC9rkFGejFF3rypgemxebUKg)

## What I actually built

More than the video, I built the pipeline. One Blender scene, beat-quantized animation, two machines running renders over SSH, and an automated post-production chain that stitches the 16-second base loop into a 3-hour tiled output with audio, a thumbnail, and a YouTube description — all while I pour another coffee.

A few things that made me happy this weekend:

- **One blend, many cameras.** Early on I duplicated the .blend per episode. Dumb. Every episode in the series is the same scene from a different perspective — so I collapsed back to a single source file and just add a new camera inside it. Episode 2 is literally *"add Camera 2, point it at the rock, re-render."*
- **Beat-quantized wing flaps.** The hummingbird's wing-swap schedule is locked to the music's BPM (detected with librosa). Flickers on beat subdivisions, "shutter-exposure" double-pose smears on bar boundaries. It reads as holographic glitch instead of mechanical frame-swap.
- **Two-machine distributed rendering.** Mac Studio drives the creative iteration. Laptop is the render farm, driven from the Studio over SSH. rsync pushes the updated .blend; a detached `screen` session on the laptop survives me closing Terminal. 6-hour renders don't chew my workstation.
- **Dopamine-optimized notifications.** When a render completes I get the Counter-Strike 1.6 "Headshot!" announcer immediately followed by the Diablo 2 gold-drop jingle. Zero gap between them. I can't describe how well this works.

## What I didn't build

A brand yet. No style guide, no voice doc, no Figma. Just vibes and a production stack. That part comes next — probably inside the Nertia brand-system generator I'm already working on, which feels like the right way to close the loop: use my own tool to give my own channel a system.

## What's next

- **Stone & Water 002** is rendering right now on the laptop. Wide, low camera across the water. Dropping it tomorrow.
- **003** is in my head as an orbiting drone shot — camera on a circular path, locked onto the rock.
- Goal: 5-10 episodes in the can before I fall into a release rhythm. Fresh channels with one video look like fresh channels with one video. I want to land looking like I've been doing this a while.

If you want to hear me talk more about this — the pipeline, the "sensory dispensary" concept, the render farm, the questionable Counter-Strike sound choices — follow along here. I'll be posting field notes as I go.

— Scott
