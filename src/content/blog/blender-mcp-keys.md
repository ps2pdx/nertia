---
title: "I gave Claude the keys to Blender"
date: "2026-04-11"
slug: "blender-mcp-keys"
hero: "/blog/blender-mcp-keys-hero.png"
excerpt: "A short primer on wiring Claude Code to Blender over MCP. What it unlocks, what to prompt, and why this is the unlock for creative tech work."
tags: ["claude", "blender", "mcp", "primer", "field-notes"]
---

Before any of the Zen Holo stuff worked, there had to be plumbing. Here's the plumbing.

**MCP** (Model Context Protocol) is the bridge. A small server runs alongside Blender and exposes Blender's Python API as tools Claude can call. Once it's connected, Claude can query the scene, edit meshes, adjust materials, set render settings, save files. Anything you could script in `bpy`, Claude can do from a prompt.

## The setup

One-time, on my Mac:

1. Install the Blender MCP server (`uvx blender-mcp` or similar per the addon's readme).
2. Install the Blender-side addon so the running Blender app can accept connections.
3. Register the MCP server in Claude Code's `claude mcp add` config so Claude sees it.
4. Open Blender. Click "Connect" in the BlenderMCP sidebar.

That's it. From then on, Claude sees tools like `execute_blender_code`, `get_scene_info`, `get_viewport_screenshot`, and a pile of Polyhaven / Hyper3D asset generators. In Claude Code, I just type what I want and it picks.

## What it changes about creative work

The thing people miss about MCP is that **Claude now closes the loop inside Blender.** It runs code. It looks at the viewport. It sees what broke. It fixes.

Before MCP, Claude was a smart assistant writing code snippets I'd paste. With MCP, Claude is a junior who's already sitting at the workstation and just needs art direction.

A real example from this weekend: *"the hummingbird mesh is rendering as a black silhouette, figure out why."* Claude ran `get_scene_info`, read the material nodes, noticed the emission strength was animated with CONSTANT extrapolation ending at frame 60, and proposed fixing the extrapolation. Two tool calls. I never opened a node editor.

![Blender viewport while iterating the Zen Holo scene with Claude over MCP](/blog/blender-mcp-viewport.png)

## What to prompt it for

- **Surgical edits.** "Rotate the camera target 30° around Z." "Set the Mapping node's Y location to 0, keyframed."
- **Diagnosis.** "Why is this material rendering wrong?" Paste a screenshot.
- **Scene audits.** "List all objects and their hidden state at frame 65."
- **Boilerplate cleanup.** "Bake all action fcurves to a single keyframe so the loop is deterministic."
- **Pipeline setup.** "Configure render output as PNG sequence with use_overwrite=False so I can resume."

What it's bad at (for now):
- UX-heavy ops where you really want to see and feel the viewport
- Anything requiring sustained navigation in the Blender GUI (camera framing by feel)
- Large geometry edits where a screenshot doesn't capture the problem

Handle those yourself. Hand the rest to Claude.

## Next

More field notes coming on **the full Zen Holo pipeline** (already posted), **the Butterfly Ring particle sim**, and **Superpowers**, the skills plugin that teaches Claude how to work on real projects instead of just typing.

— Scott

---

*Nertia is where I put my work as a marketing pro and freelance production engineer. [Get in touch](mailto:ps2pdx@gmail.com) if you're building something that needs this kind of plumbing.*
