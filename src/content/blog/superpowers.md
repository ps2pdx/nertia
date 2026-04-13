---
title: "Superpowers"
date: "2026-04-09"
slug: "superpowers"
hero: "/blog/superpowers-hero.png"
excerpt: "Claude is a good assistant out of the box. With the Superpowers plugin loaded, it becomes a coworker."
tags: ["claude", "superpowers", "workflow", "field-notes"]
---

Out of the box, Claude Code is a good assistant. You ask for a thing, it writes the thing, you inspect and commit. That's most of the value.

But there's a plugin called **Superpowers** that changes what Claude does in between the ask and the output. It turns the assistant into something closer to a senior engineer.

## What it actually is

Superpowers is a **skills plugin**. Skills are just little markdown reference guides loaded into Claude's context that tell it *how* to approach certain kinds of work. Each skill covers one pattern: test-driven development, systematic debugging, writing plans before coding, brainstorming before building, verification before claiming something is done.

There are about 15 of them. Loaded together, they reshape the way Claude operates.

## What changes

A few concrete shifts I noticed on Zen Holo this weekend:

- **It writes a plan before touching code on anything non-trivial.** I used to get mid-task "wait why did it do X" moments. Now the plan is in front of me before any file changes, and I can redirect.
- **It debugs by tracing root causes, not patching symptoms.** When the hummingbird rendered as a black silhouette, it didn't throw an emission-strength bump at it. It traced the actual fcurve extrapolation and fixed that.
- **It verifies before declaring done.** "Render complete" meant the render was actually complete, not that the job was dispatched.
- **It pushes back.** When I tried to duplicate `.blend` files per episode, Claude flagged the waste and suggested the one-blend-many-cameras pattern. I was wrong. It was right.

That last one is the real difference. A junior assistant does what you say. A coworker tells you when what you said is dumb.

## What I didn't expect

The skills are written in a way that Claude can *test them against itself*. There's a meta-skill called `writing-skills` that treats skill creation like TDD: write a pressure scenario, watch the agent fail, write the skill, watch it comply. I wrote my own custom `humanize-text` skill this weekend using that process. Worked.

This is a different relationship with a language model than I had a year ago.

## Why it matters for the work I do

Freelance production engineering is largely about how fast you can go from "this is what it should feel like" to "this is shipping." With Claude + MCP + Superpowers, that gap compressed enough this weekend that I spun up a YouTube channel, wrote four blog posts, and redeployed a site between the hours I usually reserve for errands.

That's what I sell at Nertia: creative brands shipped through actual production systems. This stack is how.

## That's the series

Four posts. Zen Holo. Blender MCP. Butterfly Ring. Superpowers. I'll be writing more as the pipeline grows.

— Scott

---

*Nertia is where I put my work as a marketing pro and freelance production engineer. If you want this kind of throughput on a project, [get in touch](mailto:ps2pdx@gmail.com).*
