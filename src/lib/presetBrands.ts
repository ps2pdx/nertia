/**
 * Curated library of BrandContext presets. Powers the "↯ imagine a brand to try"
 * button on the intake — the user can skip Q1-Q5 and drop into emerge with a
 * fully-populated example.
 *
 * No LLM, no randomness state that would make this non-deterministic across
 * restarts. The route picks one via Math.random per-request, which is fine:
 * the library itself is deterministic and curated.
 */
import type { BrandContext } from "./brandContext";

export const presetBrands: BrandContext[] = [
    {
        purpose:
            "A film-wedding photographer's portfolio — book weddings in Oaxaca, Portugal, and Kyoto.",
        audience:
            "Couples planning intimate destination weddings, art directors scouting for editorial features.",
        vibeWords: ["warm", "unhurried", "cinematic"],
        adaptive: [
            {
                question: "Name three brands whose websites you respect.",
                answer:
                    "Kinfolk for the generous whitespace, Cereal for editorial trust, Craig Mod for the writing-forward quiet.",
            },
            {
                question: "If a visitor leaves your site remembering one feeling, what should it be?",
                answer: "That time slows down when they look at the images.",
            },
        ],
    },
    {
        purpose:
            "An indie dev tool — a debugger that shows causality, not stack traces, for distributed systems.",
        audience:
            "Senior backend engineers and SREs tired of grepping observability dashboards.",
        vibeWords: ["technical", "quiet", "rigorous"],
        adaptive: [
            {
                question: "Name three products whose surface you respect.",
                answer:
                    "Linear for keyboard density, Warp for showing not telling, TigerBeetle docs for owning the deep end.",
            },
            {
                question: "What word should a reader use to describe you after the homepage?",
                answer: "Credible.",
            },
        ],
    },
    {
        purpose:
            "A solo coach's landing page — somatic coaching for people rebuilding pace after burnout.",
        audience:
            "Newly-diagnosed ADHD adults, quietly spiraling managers, people tired of optimizing themselves.",
        vibeWords: ["warm", "grounded", "honest"],
        adaptive: [
            {
                question: "A brand whose voice you'd borrow a spoonful of.",
                answer: "Mitchyll — warm, personal, not trying to optimize you.",
            },
            {
                question: "Someone lands here at 2am. What should they feel?",
                answer: "That they're allowed to put the phone down.",
            },
        ],
    },
    {
        purpose:
            "A 24-seat tasting-menu restaurant in Portland focused on fermented Pacific Northwest produce.",
        audience:
            "Food-obsessed diners, couples planning anniversary meals, food writers at Bon Appétit and Eater.",
        vibeWords: ["considered", "intimate", "crafted"],
        adaptive: [
            {
                question: "A restaurant whose website made you book a flight.",
                answer: "Noma — the typography alone made it feel like a museum visit.",
            },
            {
                question: "What should someone feel after reading the homepage?",
                answer: "That there will be a thought behind every plate.",
            },
        ],
    },
    {
        purpose:
            "A two-person experimental game studio making deliberately unmarketable short games.",
        audience:
            "Weird-game enthusiasts, itch.io scroll-browsers, festival jurors, IGF voters.",
        vibeWords: ["playful", "honest", "abrasive"],
        adaptive: [
            {
                question: "Three studios whose sites feel right.",
                answer: "MSCHF for audacity, increpare for zero-frills, itch.io for refusing to be a store.",
            },
            {
                question: "What should someone feel after five seconds?",
                answer: "Slightly suspicious — in a good way.",
            },
        ],
    },
    {
        purpose: "Field notes from a one-person newsletter about product craft and technical writing.",
        audience:
            "Staff engineers, PMs who write, indie makers who care about how things read.",
        vibeWords: ["editorial", "warm", "slow"],
        adaptive: [
            {
                question: "Three writers whose sites feel like the writing.",
                answer: "Craig Mod for the column widths, Anna Havron for pacing, Robin Rendle for atmosphere.",
            },
            {
                question: "What should a reader feel after one post?",
                answer: "Like they'd read the next one too.",
            },
        ],
    },
    {
        purpose: "Link-in-bio for an electronic musician about to drop a first EP.",
        audience: "Fans, bookers, labels, curious new listeners from TikTok.",
        vibeWords: ["moody", "atmospheric", "dark"],
        adaptive: [
            {
                question: "Three artist sites whose design felt right.",
                answer: "Arca for tension, Jlin for restraint, Jon Hopkins for the quiet authority.",
            },
            {
                question: "What should the page feel like at first glance?",
                answer: "Like walking into a room after the show has started.",
            },
        ],
    },
    {
        purpose:
            "A small open-source sustainability API — measure embedded carbon from supply-chain metadata.",
        audience:
            "Climate-software engineers, sustainability leads at mid-size companies, open-source contributors.",
        vibeWords: ["technical", "earthy", "open-source"],
        adaptive: [
            {
                question: "Three docs sites you trust.",
                answer: "Stripe for clarity, Cloudflare for depth, Rust's book for pedagogical pace.",
            },
            {
                question: "What should a developer feel after the hero?",
                answer: "This is real infra, not marketing.",
            },
        ],
    },
    {
        purpose: "Portfolio for a technical product marketing consultant and brand systems designer.",
        audience: "Founders of design-forward engineering teams who need messaging + identity together.",
        vibeWords: ["technical", "warm", "considered"],
        adaptive: [
            {
                question: "Who's doing this kind of work well?",
                answer: "Mule for the positioning rigor, Ueno for the craft, Figma's brand team for the voice.",
            },
            {
                question: "What should a founder feel after reading the site?",
                answer: "That I'd understand their product quickly and not waste their time.",
            },
        ],
    },
    {
        purpose:
            "An architecture studio's portfolio — residential interiors in the Pacific Northwest.",
        audience:
            "Homeowners planning remodels, architects looking for a collaborator, design editors.",
        vibeWords: ["minimal", "neutral", "architect"],
        adaptive: [
            {
                question: "Three studio sites that feel like the work.",
                answer: "Herbert Lewis Kruse Blunck for restraint, Murcutt for quiet confidence, Dezeen's featured editorial.",
            },
            {
                question: "What should a homeowner feel visiting?",
                answer: "That the studio listens before drawing.",
            },
        ],
    },
];

/** Pseudo-random preset for the "imagine" button. */
export function randomPreset(): BrandContext {
    return presetBrands[Math.floor(Math.random() * presetBrands.length)];
}
