---
title: "What happens when you hand Claude the whole Blender pipeline"
date: "2026-04-12"
slug: "zen-holo-weekend"
hero: "/blog/zen-holo-weekend-hero.png"
excerpt: "I gave Claude + Blender MCP + Superpowers a weekend. It shipped a YouTube channel."
tags: ["claude", "blender", "mcp", "superpowers", "pipeline", "field-notes"]
---

I wanted to see what Claude could actually do if I got out of the way.

So I wired up Claude Code to Blender via the MCP server, loaded up Superpowers, and told it to help me build a YouTube channel. Not write about one. Build one.

It shipped tonight. **Zen Holo**: long-form 3D ambient loops, 3+ hours a pop, dark and minimal. First drop is *Stone & Water 001*. Dark water over warm stones in golden hour light, with a holographic hummingbird that breathes in and out of a half-formed shutter smear above the scene. Ambient techno underneath.

Watch: [youtube.com/@zenholo12](https://www.youtube.com/channel/UC9rkFGejFF3rypgemxebUKg)

![Hummingbird hologram above the main stone in Stone & Water 001](/blog/zen-holo-stone-hummingbird.png)

The channel is the artifact. The pipeline is the real output.

## The stack

- **Claude Code** (Opus 4.6) driving from a prompt
- **Blender MCP**, a server that lets Claude call Blender's Python API directly. Mesh edits, material graph surgery, camera keyframes, render settings.
- **Superpowers**, the skills plugin that gives Claude structured workflows for planning, TDD, and systematic debugging
- Two Macs over SSH and rsync. One iterates, one renders.
- An FFmpeg tail that stitches the base loop into a 3-hour tiled output with audio, pulls a hero frame for the thumbnail, and writes the YouTube description

I never opened Blender's Python console once. I told Claude what I wanted in the viewport. It wrote the code, ran it, looked at the result, and kept going.

## A few moves that made me happy

**One blend, many cameras.** My first instinct was to duplicate the `.blend` per episode. Dumb. Claude pushed back. Every episode in a series is the same scene from a different perspective, so you collapse to a single source file and add a new camera inside it. Episode 2 is literally *"add Camera 2, point it at the rock, re-render."*

**Beat-quantized wing flaps.** The hummingbird's wing-swap schedule is locked to the music's BPM (detected with librosa, fed into Claude). Flickers on beat subdivisions. "Shutter-exposure" double-pose smears on bar boundaries. It reads as holographic glitch instead of mechanical frame-swap.

**Two-machine distributed rendering.** Mac Studio drives iteration. The laptop is the render farm, driven from the Studio over SSH. rsync pushes the updated `.blend`, a detached `screen` session on the laptop survives me closing Terminal, and six-hour renders don't chew my workstation.

**Dopamine-optimized notifications.** When a render completes I get the Counter-Strike 1.6 "Headshot!" announcer immediately followed by the Diablo 2 gold-drop jingle. Zero gap between them. I can't describe how well this works.

Most of that didn't exist Friday. It exists now because Claude could reach into Blender, iterate on the pipeline in the same conversation where I was giving art direction, and write the glue code between the two machines in the same conversation where I was asking it to retune the bird's wing animation.

## What's next

*Stone & Water 002* is rendering on the laptop right now. Wide, low camera across the water. It drops tomorrow.

003 is in my head as an orbiting drone shot. Camera on a circular path, locked onto the rock.

Goal: 5-10 episodes in the can before I fall into a release rhythm. Fresh channels with one video look like fresh channels with one video. I want to land looking like I've been doing this a while.

## This is post one of a few

I want to split this up. Coming soon:

- **I gave Claude the keys to Blender.** A primer on Blender MCP + Claude Code. The plumbing, the prompts, what it unlocks.
- **The Butterfly Ring.** Case study on the particle simulation that lives on the [Nertia homepage](/). How it got built and what it's doing creatively.
- **Superpowers.** A meta post on the skills plugin and how it reshapes what Claude can actually do when you hand it a real project.

Follow along.

— Scott

---

*Nertia is where I put my work as a marketing pro and freelance production engineer. If you're building a brand, a channel, a content engine, or a pipeline that needs to ship, and you want someone who'll handle the strategy, the system, and the code, [get in touch](mailto:ps2pdx@gmail.com).*
