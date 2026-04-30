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
        status: 'done',
        blurb: 'Particle / Wave / Entanglement live + Cal.com /book embed configured.',
        pr: 'https://github.com/ps2pdx/nertia/pull/15',
    },
    {
        id: 'sp-6',
        number: 6,
        title: 'Mobile butterfly tap-drag fix',
        status: 'done',
        blurb: 'Pointer Events + touch-action: pan-y. Horizontal swipe rotates, vertical scrolls.',
        pr: 'https://github.com/ps2pdx/nertia/pull/17',
    },
    {
        id: 'sp-design',
        number: 7,
        title: 'Design refresh (next active project)',
        status: 'next',
        blurb: 'Holistic site redesign using superpowers:brainstorming → frontend-design skill. Card overflow + hero copy + visual direction in one pass.',
    },
    {
        id: 'sp-2',
        number: 2,
        title: 'Resource hub',
        status: 'queued',
        blurb: 'Pinned — larger ongoing scope. Top-of-funnel build-in-public surface.',
    },
    {
        id: 'sp-3',
        number: 3,
        title: 'Brand System Generator v2',
        status: 'queued',
        blurb: 'Pinned — dependency for #4 (zero-point gen). Customize nertia\'s schema.',
    },
    {
        id: 'sp-4',
        number: 4,
        title: 'Subdomain templates + dogfood sites (#5 folded in)',
        status: 'queued',
        blurb: 'Pinned — depends on #3. _sites/[slug] renderer + scott./s35./rayme. (live-stream/admin)/purplescott./pacificpatterns.',
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
            'Post-launch validation + design-refresh prep. Most gating blockers are now resolved.',
        items: [
            {
                id: 'scott-verify-live',
                title: 'Verify live nertia.ai end-to-end',
                href: 'https://nertia.ai',
                note: 'After Vercel rebuild lands. Walk the funnel: hero → /services → /book → real test booking.',
                stepGroups: [
                    {
                        steps: [
                            'Visit / on desktop and mobile',
                            'Confirm hero shows "See services" + "Book a call" CTAs',
                            'Click "See services" → /services renders Particle / Wave / Entanglement',
                            'Click each tier\'s "Initiate" CTA → lands on /book with the right event preselected',
                            'Book a real test slot for Observation; confirm calendar invite hits Google + iCloud',
                            'Mobile: horizontal swipe rotates butterfly; vertical scrolls page',
                        ],
                    },
                ],
            },
            {
                id: 'scott-cal-teams-decision',
                title: 'Decide on Cal.com Teams upgrade ($12/mo)',
                note: 'Free tier shows the "Cal.com" footer. Teams plan removes it. One Particle ($2,500) booking covers ~23 years of subscription.',
                stepGroups: [
                    {
                        steps: [
                            'Decide if footer is worth removing now or later',
                            'If yes: cal.com → Settings → Billing → Teams plan',
                            'Embed automatically updates after upgrade — no code change needed',
                        ],
                    },
                ],
            },
            {
                id: 'scott-prices',
                title: 'Lock real prices + scope on /services if placeholders need changing',
                note: 'Live placeholders: Particle $2,500 / Wave $10,000 / Entanglement $6,000/mo. Edit live.',
                stepGroups: [
                    {
                        steps: [
                            'Open src/components/sections/services/PackagesGrid.tsx',
                            'Edit price, audience, timeline, deliverables[] for each tier',
                            'Open src/components/sections/services/ServicesMenu.tsx',
                            'Edit priceLabel and oneliner for each Quanta row',
                            'Commit on chore/services-content branch and PR',
                        ],
                    },
                ],
            },
            {
                id: 'scott-enable-frontend-design',
                title: 'Enable frontend-design plugin before design-refresh kickoff',
                note: 'Plugin lives in marketplace at ~/.claude/plugins/marketplaces/claude-plugins-official/plugins/frontend-design but isn\'t active in current session.',
                stepGroups: [
                    {
                        steps: [
                            'Run /plugin in Claude Code',
                            'Find frontend-design in claude-plugins-official',
                            'Install + enable',
                            'Restart session before kicking off design refresh',
                        ],
                    },
                ],
            },
            {
                id: 'scott-claude-md',
                title: 'Update CLAUDE.md to reflect new positioning (deferred docs PR)',
                note: 'Current copy still says BSG thesis is "being retired". Replace with production-engineering-studio framing.',
            },
        ],
    },
    {
        id: 'lane-claude',
        title: 'Claude — code',
        subtitle: 'Awaiting design-refresh kickoff. Pinned sub-projects stay queued until larger scopes resolve.',
        items: [
            {
                id: 'claude-design-refresh',
                title: 'Design refresh project — kickoff when Scott is ready',
                note: 'Holistic site redesign. Brainstorming first to lock aesthetic direction, then frontend-design to execute. Likely scope a single page (probably / or /services) as the design proof before sitewide.',
                stepGroups: [
                    {
                        heading: 'Kickoff sequence',
                        steps: [
                            'Fresh session in a new worktree feature/design-refresh',
                            'superpowers:brainstorming — lock aesthetic direction (minimal / editorial / brutalist / maximalist?)',
                            'frontend-design skill — execute against direction',
                            'Pilot on one page first; react to direction before sitewide rollout',
                        ],
                    },
                    {
                        heading: 'Known issues to absorb',
                        steps: [
                            'Card overflow on /services — Entanglement card pill ("ONGOING") clips at certain desktop widths. Folds into the redesign.',
                            'Hero tagline still pre-pivot: "Identity in motion. Strategy, design, code. Brand systems built to ship." Replace as part of refresh.',
                        ],
                    },
                ],
            },
            {
                id: 'claude-pinned-subprojects',
                title: 'Pinned sub-projects (queued)',
                note: '#2 (resource hub), #3 (BSG v2), #4 (subdomain pipeline + #5 folded in) all stay queued. Each is a larger ongoing scope dependent on earlier work or strategic alignment.',
            },
        ],
    },
];

// ----------------------------------------------------------------------
// Done so far — historical checklist (most recent first)
// ----------------------------------------------------------------------

export const DONE: DoneItem[] = [
    {
        id: 'done-pr18',
        date: '2026-04-30',
        title: 'PR #18 merged — /book embed width cap, hero CTAs renamed (See services + Book a call), inquiry-form fallback dropped',
    },
    {
        id: 'done-cal-live',
        date: '2026-04-30',
        title: 'Cal.com fully wired — scott-campbell handle, 4 event types live, NEXT_PUBLIC_CAL_USERNAME set in Vercel + .env.local',
    },
    {
        id: 'done-pr17',
        date: '2026-04-29',
        title: 'PR #17 merged — mobile butterfly tap-drag via Pointer Events; sub-project #6 closed',
    },
    {
        id: 'done-pr16',
        date: '2026-04-29',
        title: 'PR #16 merged — dev dashboard at /admin/dashboard',
    },
    {
        id: 'done-pr15',
        date: '2026-04-29',
        title: 'PR #15 merged — Particle/Wave/Entanglement /services rebuild + Cal.com /book; sub-project #1 shipped',
    },
    {
        id: 'done-spec-1',
        date: '2026-04-29',
        title: 'Spec + plan written for sub-project #1; brand voice locked (Particle / Wave / Entanglement)',
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
];

// ----------------------------------------------------------------------
// Blocked — awaiting decisions / external dependencies
// ----------------------------------------------------------------------

export const BLOCKERS: Blocker[] = [
    {
        id: 'block-prices',
        priority: 'polish',
        item: 'Real prices + scope on the 3 tiers',
        impact: 'Placeholders ($2.5k / $10k / $6k/mo) are live in prod. Customers see them until Scott edits.',
    },
    {
        id: 'block-cal-branding',
        priority: 'polish',
        item: 'Cal.com footer ("Cal.com" branding) on /book embed',
        impact: 'Free-tier requirement. Removed by upgrading Cal to Teams plan ($12/mo).',
    },
    {
        id: 'block-card-overflow',
        priority: 'polish',
        item: 'Entanglement card "ONGOING" pill clips at certain desktop widths',
        impact: 'Folds into the design-refresh project; not a standalone fix worth shipping.',
    },
    {
        id: 'block-hero-copy',
        priority: 'polish',
        item: 'Hero tagline still pre-pivot ("Identity in motion. Strategy, design, code...")',
        impact: 'Tonal seam between hero and rebuilt /services. Replace in design-refresh pass.',
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
        impact: 'Separate docs PR. Current language still says BSG thesis is "being retired" without naming the replacement.',
    },
];

// ----------------------------------------------------------------------
// Quick links — frequently-needed URLs
// ----------------------------------------------------------------------

export const QUICK_LINKS: QuickLink[] = [
    {
        title: 'Live site',
        href: 'https://nertia.ai',
        note: 'Production deploy.',
    },
    {
        title: 'GitHub repo',
        href: 'https://github.com/ps2pdx/nertia',
        note: 'main branch; deploys to Vercel.',
    },
    {
        title: 'Vercel dashboard',
        href: 'https://vercel.com/dashboard',
        note: 'Env vars + deploy logs.',
    },
    {
        title: 'Cal.com bookings',
        href: 'https://cal.com/scott-campbell',
        note: 'Public booking page; embed source.',
    },
    {
        title: 'Cal.com dashboard',
        href: 'https://app.cal.com/event-types',
        note: 'Manage event types + calendar connections.',
    },
    {
        title: 'Firebase console',
        href: 'https://console.firebase.google.com/',
        note: 'RTDB — notepad/, waitlist/.',
    },
    {
        title: '/services',
        href: '/services',
        note: 'Particle / Wave / Entanglement.',
    },
    {
        title: '/book',
        href: '/book',
        note: 'Cal embed; ?event= preselects tier.',
    },
    {
        title: '/design-system',
        href: '/design-system',
        note: 'Component catalogue — reach for this before building new UI.',
    },
];
