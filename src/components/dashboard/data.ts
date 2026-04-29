// Edit this file directly to update the dashboard. The page renders
// from these structures; no DB / API calls. Mirror of the PTB
// status-site pattern, scaled to nertia's pivot tracking.

export type StepGroup = {
    heading?: string;
    steps: string[];
};

export type ChecklistItem = {
    id: string;
    title: string;
    note?: string;
    href?: string;
    stepGroups?: StepGroup[];
};

export type Lane = {
    id: string;
    title: string;
    subtitle?: string;
    items: ChecklistItem[];
};

export type SubProjectStatus = 'in-review' | 'in-progress' | 'next' | 'queued' | 'done';

export type SubProject = {
    id: string;
    number: number;
    title: string;
    status: SubProjectStatus;
    blurb: string;
    branch?: string;
    pr?: string;
};

export type DoneItem = {
    id: string;
    date: string;
    title: string;
};

export type Blocker = {
    id: string;
    priority: 'gating' | 'launch' | 'polish' | 'deferred';
    item: string;
    impact: string;
};

export type QuickLink = {
    title: string;
    href: string;
    note?: string;
};

// ----------------------------------------------------------------------
// Sub-project headline grid — top-of-dashboard "where are we"
// ----------------------------------------------------------------------

export const SUB_PROJECTS: SubProject[] = [
    {
        id: 'sp-1',
        number: 1,
        title: 'Booking + Services page',
        status: 'in-review',
        blurb: 'Particle / Wave / Entanglement + Cal.com /book embed.',
        branch: 'feature/booking-and-services',
        pr: 'https://github.com/ps2pdx/nertia/pull/15',
    },
    {
        id: 'sp-2',
        number: 2,
        title: 'Resource hub',
        status: 'next',
        blurb: 'Top-of-funnel — blog, tutorials, tools, build-in-public surface.',
    },
    {
        id: 'sp-3',
        number: 3,
        title: 'Brand System Generator v2',
        status: 'queued',
        blurb: 'Customize nertia\'s schema; replaces retired BSG thesis.',
    },
    {
        id: 'sp-4',
        number: 4,
        title: 'Subdomain templates + 5 dogfood sites',
        status: 'queued',
        blurb: '_sites/[slug] renderer + scott./s35./rayme./purplescott./pacificpatterns.',
    },
    {
        id: 'sp-5',
        number: 5,
        title: 'Live-stream + admin for rayme.',
        status: 'queued',
        blurb: 'One template\'s special sauce. Depends on #4.',
    },
    {
        id: 'sp-6',
        number: 6,
        title: 'Mobile butterfly tap-drag fix',
        status: 'queued',
        blurb: 'Pre-pivot bug — pointer events not handling touch.',
    },
];

// ----------------------------------------------------------------------
// Today — two parallel lanes (PTB pattern)
// ----------------------------------------------------------------------

export const TODAY_LANES: Lane[] = [
    {
        id: 'lane-scott',
        title: 'Scott — admin',
        subtitle:
            'Manual setup + content edits. Cal.com + Vercel env are gating PR #15.',
        items: [
            {
                id: 'scott-cal-account',
                title: 'Set up Cal.com account',
                note: 'Pick the username that becomes scott-campbell or whatever you want — it shows in booking URLs.',
                stepGroups: [
                    {
                        steps: [
                            'Go to cal.com/signup',
                            'Pick a username (suggested: scott-campbell)',
                            'Connect Google Calendar in Settings → Apps',
                            'Connect Apple/iCloud Calendar in the same panel',
                            'Verify availability syncs from both calendars',
                        ],
                    },
                ],
            },
            {
                id: 'scott-cal-events',
                title: 'Create the four Cal event types',
                note: 'Slugs must match exactly: observation, particle, wave, entanglement. /book reads them from ?event=.',
                stepGroups: [
                    {
                        heading: 'Observation (free intro)',
                        steps: [
                            'Cal dashboard → Event Types → New',
                            'Title: Observation',
                            'Slug: observation',
                            'Length: 20 min',
                            'Free, no payment',
                            'Buffer: 5 min before / 10 min after',
                        ],
                    },
                    {
                        heading: 'Particle / Wave / Entanglement',
                        steps: [
                            'Repeat for each tier with slug: particle (30 min), wave (45 min), entanglement (45 min)',
                            'All free at booking — deposits enabled per-tier later when ready',
                            'Add intake question: "What are you trying to ship?"',
                        ],
                    },
                ],
            },
            {
                id: 'scott-env-cal',
                title: 'Set NEXT_PUBLIC_CAL_USERNAME in Vercel + .env.local',
                note: 'Without this, /book renders the fallback inquiry form instead of the Cal embed.',
                stepGroups: [
                    {
                        steps: [
                            'Vercel project → Settings → Environment Variables',
                            'Add NEXT_PUBLIC_CAL_USERNAME = your Cal handle (production scope)',
                            'Add the same line to local .env.local',
                            'Redeploy (or wait for next push) so the prod env picks it up',
                        ],
                    },
                ],
            },
            {
                id: 'scott-merge-pr15',
                title: 'Review + merge PR #15 (booking + services)',
                href: 'https://github.com/ps2pdx/nertia/pull/15',
                note: 'Once Cal env is set, merge to ship /services and /book to nertia.ai.',
            },
            {
                id: 'scott-prices',
                title: 'Lock real prices + scope on /services',
                note: 'Placeholders shipped: Particle $2,500 / Wave $10,000 / Entanglement $6,000/mo. Edit live; no architectural change.',
                stepGroups: [
                    {
                        steps: [
                            'Open src/components/sections/services/PackagesGrid.tsx',
                            'Edit price, audience, timeline, deliverables[] for each tier',
                            'Open src/components/sections/services/ServicesMenu.tsx',
                            'Edit priceLabel and oneliner for each Quanta row',
                            'Commit on a separate branch (chore/services-content) and PR',
                        ],
                    },
                ],
            },
            {
                id: 'scott-claude-md',
                title: 'Update CLAUDE.md to reflect new positioning',
                note: 'Current copy says BSG thesis is "being retired". Replace with production-engineering-studio framing post-#15 merge.',
                stepGroups: [
                    {
                        steps: [
                            'Branch docs/claude-md-pivot from main',
                            'Update "What we\'re building" section to lead with production studio',
                            'Add Particle / Wave / Entanglement vocabulary to brand voice',
                            'Note the 6 sub-project decomposition',
                            'PR via gh',
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: 'lane-claude',
        title: 'Claude — code',
        subtitle: 'Next code work. Each sub-project ships on its own branch + PR.',
        items: [
            {
                id: 'claude-mobile-butterfly',
                title: 'Sub-project #6 — mobile butterfly tap-drag fix',
                note: 'Smallest scope, ship as a quick warmup before #2.',
                stepGroups: [
                    {
                        steps: [
                            'Branch fix/mobile-butterfly-tap-drag from main',
                            'Reproduce on mobile viewport (375px) at /butterfly-test or /',
                            'Inspect src/components/ButterflyRingParticles.tsx pointer handlers',
                            'Add touchstart/touchmove/touchend events alongside mouse events',
                            'Use unified pointer-event API where available',
                            'Test on real device + emulated touch',
                            'PR with before/after gif in the body',
                        ],
                    },
                ],
            },
            {
                id: 'claude-resource-hub',
                title: 'Sub-project #2 — resource hub start',
                note: 'Bigger scope. Brainstorm + spec first; don\'t skip writing-plans.',
                stepGroups: [
                    {
                        heading: 'Spec phase',
                        steps: [
                            'Brainstorm IA: home → categories (tutorials, tools, build-in-public, blog index)',
                            'Decide where /resource-hub vs / lives (homepage redesign?)',
                            'Schema for tutorials in RTDB: notepad/tutorials/{slug}',
                            'Schema for tools: notepad/tools/{slug}',
                        ],
                    },
                    {
                        heading: 'Build phase',
                        steps: [
                            'Branch feature/resource-hub from main',
                            'Reuse PageTemplate + PageSidebar like /blog',
                            'New components: ResourceCard, ResourceList, CategoryFilter',
                            'Wire each route to its RTDB slice',
                            'Add catalogue entries to /design-system',
                        ],
                    },
                ],
            },
            {
                id: 'claude-subdomain-spec',
                title: 'Sub-project #4 — subdomain pipeline spec only',
                note: 'Plan + spec only this turn — no build until tier-2 directions ship.',
                stepGroups: [
                    {
                        steps: [
                            'Open canonical spec: docs/superpowers/specs/2026-04-16-zero-point-generator-design.md',
                            'Sketch _sites/[slug]/page.tsx renderer that takes RTDB site data + a direction',
                            'Map 5 dogfood sites → directions: scott. (resume), s35. (reels), rayme. (album+stream), purplescott. (TBD), pacificpatterns. (artist)',
                            'Spec the Vercel wildcard subdomain config + middleware route rewriting',
                            'Open spec PR for review before any code',
                        ],
                    },
                ],
            },
        ],
    },
];

// ----------------------------------------------------------------------
// Done so far — historical checklist (most recent first)
// ----------------------------------------------------------------------

export const DONE: DoneItem[] = [
    {
        id: 'done-pr15-open',
        date: '2026-04-29',
        title: 'PR #15 opened — booking + services rebuild (Particle / Wave / Entanglement + /book Cal embed)',
    },
    {
        id: 'done-spec-1',
        date: '2026-04-29',
        title: 'Spec + plan written for sub-project #1; brand voice locked',
    },
    {
        id: 'done-pivot-decompose',
        date: '2026-04-29',
        title: 'Pivot decomposed into 6 independent sub-projects',
    },
    {
        id: 'done-cal-decision',
        date: '2026-04-29',
        title: 'Cal.com locked as booking provider (vs Calendly) — verified free-tier covers all required features',
    },
    {
        id: 'done-notepad-admin',
        date: '2026-04-21',
        title: 'PR #14 merged — notepad admin UI + markdown editor + RTDB migration',
    },
    {
        id: 'done-batch-filters',
        date: '2026-04-21',
        title: 'PR #13 merged — notepad batch selection + filter polish + project categories',
    },
    {
        id: 'done-mobile-admin',
        date: '2026-04-21',
        title: 'PR #8 merged — mobile admin + blog migration to RTDB',
    },
    {
        id: 'done-emerge-hover',
        date: '2026-04-21',
        title: 'PR #9 merged — emerge card hover highlight (Tailwind classes over inline style)',
    },
    {
        id: 'done-worktree-convention',
        date: '2026-04-21',
        title: 'PR #10 merged — worktree convention for concurrent agent sessions',
    },
];

// ----------------------------------------------------------------------
// Blocked — awaiting decisions / external dependencies
// ----------------------------------------------------------------------

export const BLOCKERS: Blocker[] = [
    {
        id: 'block-cal-setup',
        priority: 'gating',
        item: 'Cal.com account setup + 4 event types created',
        impact: 'Blocks PR #15 merge / launch of /book. Must complete before /book embed loads in prod.',
    },
    {
        id: 'block-cal-env',
        priority: 'launch',
        item: 'NEXT_PUBLIC_CAL_USERNAME set in Vercel',
        impact: 'Without this, prod /book renders the fallback inquiry form, not the calendar.',
    },
    {
        id: 'block-prices',
        priority: 'polish',
        item: 'Real prices + scope on the 3 tiers',
        impact: 'Placeholders ($2.5k / $10k / $6k/mo) shipped. Customers will see them until edited.',
    },
    {
        id: 'block-hero-copy',
        priority: 'polish',
        item: 'Hero copy refresh — pre-pivot tagline still on /',
        impact: 'Tonal seam: hero says "Identity in motion" then /services hits new physics-vocab voice.',
    },
    {
        id: 'block-stripe',
        priority: 'deferred',
        item: 'Stripe deposits at booking',
        impact: 'No code change needed — toggle in Cal dashboard per event type when comfortable.',
    },
    {
        id: 'block-claude-md',
        priority: 'deferred',
        item: 'CLAUDE.md positioning update',
        impact: 'Separate docs PR after PR #15 merges. Current language still says BSG thesis is "being retired" without naming the replacement.',
    },
];

// ----------------------------------------------------------------------
// Quick links — frequently-needed URLs
// ----------------------------------------------------------------------

export const QUICK_LINKS: QuickLink[] = [
    {
        title: 'GitHub repo',
        href: 'https://github.com/ps2pdx/nertia',
        note: 'main branch; deploys to Vercel.',
    },
    {
        title: 'PR #15 — booking + services',
        href: 'https://github.com/ps2pdx/nertia/pull/15',
        note: 'In review. Merge after Cal setup.',
    },
    {
        title: 'Vercel dashboard',
        href: 'https://vercel.com/dashboard',
        note: 'Env vars + deploy logs.',
    },
    {
        title: 'Firebase console',
        href: 'https://console.firebase.google.com/',
        note: 'RTDB — notepad/, inquiries/, waitlist/.',
    },
    {
        title: 'Cal.com signup',
        href: 'https://cal.com/signup',
        note: 'Step one of the gating blocker.',
    },
    {
        title: 'Live site',
        href: 'https://nertia.ai',
        note: 'Production deploy.',
    },
    {
        title: '/services preview',
        href: '/services',
        note: 'After PR #15 merges, this is the rebuilt page.',
    },
    {
        title: '/book preview',
        href: '/book',
        note: 'After PR #15 + Cal env set.',
    },
    {
        title: '/design-system',
        href: '/design-system',
        note: 'Component catalogue — reach for this before building new UI.',
    },
];
