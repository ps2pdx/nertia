---
title: "The Butterfly Ring"
date: "2026-04-10"
slug: "butterfly-ring"
hero: "/blog/butterfly-ring-hero.png"
excerpt: "Case study on the particle simulation that lives on the Nertia homepage. What it is, how it was made, and why a butterfly."
tags: ["nertia", "particles", "webgl", "case-study", "field-notes"]
---

The thing on the [Nertia homepage](/) is a particle simulation. A ring of drifting points that, if you look at it long enough, resolves into a butterfly.

The butterfly is Nertia's core symbol. Transformation. The ring is the other half: the cyclical, never-ending pursuit of it. "Identity in motion" isn't a tagline I wanted to write on the page. I wanted it to *be* the page.

## What it actually is

The ring is a real-time WebGL particle swarm running on a platform called [particles.casberry.in](https://particles.casberry.in). The points sample positions along a parametric curve. A bit of noise keeps them from snapping into perfect alignment. When the camera is right, the silhouette reads as a butterfly. When it drifts, the butterfly dissolves back into orbiting points, and then re-forms.

It looks simple. It isn't.

## What I care about

Every freelance site in 2026 has a particle demo. What I wanted was a particle demo that actually *means something on the brand*. Nertia's thesis is that a good brand system is alive. It moves. It reacts. It changes shape without losing its identity.

So the butterfly ring is a literal rendering of the thesis. The points never stop moving. The shape they form is consistent. Hit the homepage at different times and the butterfly is subtly different, but you always know what you're looking at.

## What it replaced

The first version of the page had a normal hero image. Good photo, brand colors, standard stuff. It looked fine. It didn't say anything.

The second version had the butterfly ring and no other hero content. People stopped scrolling. That's the only test I care about.

## What's next

I want to use the same engine for:
- A "brand system in motion" preview on client project pages (tokens from their brand re-forming into their logo)
- A live generator where you feed in color tokens and get a custom version
- The Zen Holo branding, eventually — a particle sphere that mirrors the Stone & Water water caustics

One more post coming in this series: **Superpowers**, the Claude plugin that changes how much I can actually ship in a weekend.

— Scott

---

*Nertia is where I put my work as a marketing pro and freelance production engineer. If you want a brand system that moves like this, [get in touch](mailto:ps2pdx@gmail.com).*
