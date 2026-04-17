---
title: "Dopamine-depleted human realizes he has freewill"
date: "2026-04-16"
slug: "dopamine-depleted-human-realizes-he-has-freewill"
excerpt: "I built a little script that plays game-voice clips when stuff happens in my terminal."
tags: ["radio-coms", "gamification", "dev-environment", "dopamine", "personal-tools"]
source: "notepad"
authored: true
---

I built a little script that plays game-voice clips when stuff happens in my terminal.

`radio-coms`. Lives at `~/.claude/skills/radio-coms/`. SessionStart hits a gong. Mission complete plays the Counter-Strike headshot announcer. Something dangerous, like a `git push --force` or an `rm`, cues "fire in the hole." The README calls the whole conceit _"Bumblebee mode for your terminal."_

I built it as a joke. To make terminal feedback feel like a video game.

It works embarrassingly well.

Two days in I noticed I was actually waiting for the sounds. Not consciously. I'd kick off a build, and when the gong landed, my whole body went _good, we're working_. Pavlovian, instant. I forgot I had it running and the next morning the headshot announcer fired on a tool that succeeded and I genuinely smiled at my desk. Some confused part of my brain registered: a robot is happy about my code.

Then I built another tool.

Tonight I shipped a little auto-logging skill called `notepad`. Every Claude Code session gets a Haiku-summarized draft entry written to `~/notepad/`, mined later for blog material. While we were debugging it I told Claude that the personalized tooling has become a game-changer, that I was thinking about adding XP bars, level-up sounds, a visible little progress meter that fills as I complete tasks, and how endless the fun could be.

And mid-sentence I kind of stopped.

Because what I'm describing is a Skinner box for myself. With me as the operant conditioning subject and also the engineer designing the schedule of reinforcement. I'm not Twitch. I'm not a casino. I'm one person, in my home office, paying for my own dopamine in compute credits.

This is fine, I think. Maybe even good. Most productivity advice I've ever read is some version of "trick yourself into doing the thing." Habit stacking, environment design, don't break the chain. Gamifying my dev environment is the same trick at a higher resolution. The chirps work the way a clean desk works. The "fire in the hole" before a `git push --force` works the way a friend physically grabbing your hand works.

But there's something funny about doing it to yourself this deliberately. About knowing the mechanism, designing the trigger, and then still flinching toward the reward when it fires. The tool never tricks you if you wrote it.

I'm going to add the XP bars anyway.

But the post had to come first.

## What's next

XP bars. Level-up sounds tied to streaks. A small status-line meter that fills as I close tasks. The plumbing is straightforward. A tiny counter file, weighted by tool type, played through the same `radio` command that already runs the voice clips.

Whether it's wisdom or just better-tuned conditioning is a question for a longer post.

Dopamine-depleted human realizes he has freewill.

— Scott
