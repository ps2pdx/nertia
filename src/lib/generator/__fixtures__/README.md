# Direction-picker fixtures

16 realistic intake briefs mapped to expected directions. Used by `pickDirection.test.ts` (Task 6) to verify classification accuracy.

## Territory map

| Direction | Territory | Vibe signals |
|---|---|---|
| **zero-point** | Tech · AI · research · high-concept brands · developer tools | precise, quiet, rigorous, serious, credible |
| **editorial** | Restaurants · creators · writers · photographers · weddings | considered, measured, unhurried, literary, cinematic |
| **brutalist** | Agencies · experimental studios · zines · typography-forward brands | raw, confrontational, dense, industrial, honest |
| **organic** | Coaches · wellness · small-biz · family-friendly · artisan food | gentle, warm, grounded, rooted, handmade |

## Fixture IDs

- `zp-*` — zero-point core (3)
- `ed-*` — editorial core (3)
- `br-*` — brutalist core (3)
- `or-*` — organic core (3)
- `edge-*` — ambiguous / conflicting / under-specified (4)

## Scoring rule

- **Core (12 fixtures):** picker must match `expectedDirection` on ≥9 of 12 (75%). LLM classification is fuzzy; 100% isn't realistic.
- **Edge (4 fixtures):** picker must return `expectedDirection` OR any `allowAlternatives` — full pass required because the rationale is documented.

## Adding fixtures

When a new direction is shipped, add 3 core fixtures + adjust the territory map. When a real-world classification surprise shows up in production, add it as an edge fixture + document the rationale.
