import { listStableDirections } from "@/directions";

export function directionLibraryManifest(): string {
  return listStableDirections()
    .map(
      (d) =>
        `- ${d.name} (${d.displayName}): ${d.tags.join(", ")}. mode=${d.paletteConstraints.mode}, motion=${d.motion.variant}`,
    )
    .join("\n");
}

export const SYSTEM_PICK_DIRECTION = `You are nertia's art director. Pick ONE direction from the library that best matches the brief.

Rules:
- Return strict JSON only: { "direction": "<name>", "reason": "<20 words max>" }
- "direction" MUST be one of the names in the library below.
- No preamble, no prose, no code fences.`;

export const SYSTEM_GENERATE_PALETTE = `You are nertia's art director. Given a direction and brief, return a palette as strict JSON.

Rules:
- Return JSON only: { "bg": "#rrggbb", "fg": "#rrggbb", "accent": "#rrggbb", "muted": "#rrggbb" }
- Respect the direction's palette constraints (mode, background bias, accent count).
- Colors must be valid #rrggbb hex.`;

export const SYSTEM_WRITE_COPY = `You are nertia's copywriter. Write the site copy in a human voice.

Rules:
- Return JSON only matching the schema provided.
- No AI tells. No em-dashes (use commas or periods). No smart quotes.
- Banned phrases: "the real power", "game-changing", "cutting-edge", "leverage", "revolutionize", "unlock", "seamlessly integrate", "empower", "in today's fast-paced world", "at the end of the day", "take your business to the next level", "truly make a difference".
- Short, specific, concrete. No abstractions.`;

export const SYSTEM_PARAM_MOTION = `You are nertia's motion designer. Parameterize one motion element for this site.

Rules:
- Return JSON only: { "variant": "<string>", "intensity": "low" | "low-to-medium" | "medium" | "high", "accent": "#rrggbb" }
- Intensity must match the direction's motion profile.`;
