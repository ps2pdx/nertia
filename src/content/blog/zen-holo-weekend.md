---
title: "What happens when you hand Claude the whole Blender pipeline"
date: "2026-04-12"
slug: "zen-holo-weekend"
hero: "/blog/zen-holo-weekend-hero.png"
excerpt: "I gave Claude + Blender MCP + Superpowers a weekend. It shipped a YouTube channel."
tags: ["claude", "blender", "mcp", "superpowers", "pipeline", "field-notes"]
---

I spent the weekend running an experiment: hand the whole Blender production pipeline to Claude Code — via the Blender MCP server and the Superpowers skills plugin — and see what ships.

What ships is a YouTube channel. **Zen Holo** — long-form 3D ambient loops, 3+ hours each, dark and minimal. First drop landed tonight: **Stone & Water 001** — dark water over warm stones in golden hour light, with a holographic hummingbird that breathes in and out of a half-formed shutter smear above the scene. Ambient techno underneath.

Watch: [youtube.com/@zenholo12](https://www.youtube.com/channel/UC9rkFGejFF3rypgemxebUKg)

The channel is the artifact. The real output is the pipeline.

## The stack

- **Claude Code** (Opus 4.6) driving everything from a prompt
- **Blender MCP** — a server that lets Claude call Blender's Python API directly: mesh edits, material graph surgery, camera keyframes, render settings, file I/O
- **Superpowers** — a skills plugin that gives Claude structured workflows for planning, TDD, systematic debugging, and a bunch of other senior-engineer habits
- Two Macs wired together over SSH + rsync — one to iterate, one to render
- A FFmpeg tail that stitches the base loop into a 3-hour tiled output with audio, generates a thumbnail from a hero frame, and writes the YouTube description

I never opened Blender's Python console. I told Claude what I wanted in the viewport and it wrote the Python, ran it, watched the result, and iterated.

## A few moves that made me happy

- **One blend, many cameras.** First instinct was to duplicate the `.blend` per episode. Dumb. Claude pushed back: every episode in a series is the same scene from a different perspective, so collapse to a single source file and add a new camera inside it. Episode 2 is literally *"add Camera 2, point it at the rock, re-render."*
- **Beat-quantized wing flaps.** The hummingbird's wing-swap schedule is locked to the music's BPM (detected with librosa, fed into Claude). Flickers on beat subdivisions, "shutter-exposure" double-pose smears on bar boundaries. Reads as holographic glitch instead of mechanical frame-swap.
- **Two-machine distributed rendering.** Mac Studio drives iteration. Laptop is the render farm, driven from the Studio over SSH. rsync pushes the updated `.blend`; a detached `screen` session on the laptop survives me closing Terminal. Six-hour renders don't chew my workstation.
- **Dopamine-optimized notifications.** When a render completes I get the Counter-Strike 1.6 "Headshot!" announcer immediately followed by the Diablo 2 gold-drop jingle. Zero gap between them. I can't describe how well this works.

Most of that didn't exist Friday. It exists now because Claude could reach into Blender, iterate on the pipeline in the same conversation where I was giving art direction, and write the glue code between the machines in the same conversation where I was asking it to retune the bird's wing animation.

## What's next

- **Stone & Water 002** is rendering on the laptop right now. Wide, low camera across the water. Dropping tomorrow.
- **003** is in my head as an orbiting drone shot — camera on a circular path, locked onto the rock.
- Goal: 5-10 episodes in the can before I fall into a release rhythm. Fresh channels with one video look like fresh channels with one video.

## This is post one of a few

I want to split this up. Coming soon on the blog:

- **"I gave Claude the keys to Blender"** — a primer on Blender MCP + Claude Code. The plumbing, the prompts, what it unlocks.
- **"The Butterfly Ring"** — case study on the particle simulation that lives on the [Nertia homepage](/). How it got built, what it's doing creatively.
- **"Superpowers"** — a meta post on the skills plugin and how it reshapes what Claude can actually do when you hand it a real project.

Follow along.

— Scott

---

*Nertia is where I put my work as a marketing pro and freelance production engineer. If you're building a brand, a channel, a content engine, or a pipeline that needs to ship — and you want someone who'll handle the strategy, the system, and the code — [get in touch](mailto:ps2pdx@gmail.com).*
