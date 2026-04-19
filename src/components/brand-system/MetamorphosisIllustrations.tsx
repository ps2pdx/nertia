'use client';

// Flip-book style line drawings showing metamorphosis stages
// Each illustration corresponds to a step in the "How It Works" section

interface IllustrationProps {
    className?: string;
}

// Step 1: Caterpillar - Discovery/Understanding phase
export const Caterpillar = ({ className = '' }: IllustrationProps) => (
    <svg
        className={className}
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {/* Body segments with internal detail */}
        <circle cx="10" cy="38" r="5" />
        <path d="M8 36 Q10 34 12 36" opacity="0.3" />
        <circle cx="18" cy="36" r="5.5" />
        <path d="M16 34 Q18 32 20 34" opacity="0.3" />
        <circle cx="27" cy="34" r="6" />
        <path d="M24 32 Q27 29 30 32" opacity="0.3" />
        <circle cx="37" cy="34" r="6" />
        <path d="M34 32 Q37 29 40 32" opacity="0.3" />
        <circle cx="47" cy="36" r="5.5" />
        <path d="M45 34 Q47 32 49 34" opacity="0.3" />
        {/* Head with more detail */}
        <circle cx="56" cy="38" r="6" />
        <circle cx="58" cy="36" r="1.5" fill="currentColor" />
        <circle cx="54" cy="36" r="1" fill="currentColor" opacity="0.5" />
        <path d="M54 41 Q56 42 58 41" opacity="0.5" />
        {/* Antennae with bulbs */}
        <path d="M58 32 Q60 26 62 24" />
        <circle cx="62" cy="24" r="1.5" />
        <path d="M54 32 Q52 26 50 24" />
        <circle cx="50" cy="24" r="1.5" />
        {/* Prolegs (front) */}
        <path d="M10 43 L8 48 L10 50" />
        <path d="M18 41 L16 46 L18 48" />
        {/* True legs (middle) */}
        <path d="M27 40 L24 44 L26 46" />
        <path d="M37 40 L34 44 L36 46" />
        {/* Prolegs (rear) */}
        <path d="M47 41 L45 46 L47 48" />
        <path d="M56 43 L54 48 L56 50" />
        {/* Spots/markings */}
        <circle cx="18" cy="36" r="1" opacity="0.2" fill="currentColor" />
        <circle cx="27" cy="34" r="1.5" opacity="0.2" fill="currentColor" />
        <circle cx="37" cy="34" r="1.5" opacity="0.2" fill="currentColor" />
        <circle cx="47" cy="36" r="1" opacity="0.2" fill="currentColor" />
        {/* Branch/twig */}
        <path d="M2 52 L62 52" opacity="0.4" />
        <path d="M58 52 L62 48" opacity="0.3" />
        <path d="M4 52 L2 56" opacity="0.3" />
        {/* Leaf being eaten */}
        <path d="M60 40 Q66 36 62 30" opacity="0.4" />
        <path d="M62 30 Q58 34 60 40" opacity="0.4" />
        <path d="M61 35 L64 33" opacity="0.2" />
    </svg>
);

// Step 2: Forming Chrysalis - Strategy/Shaping phase
export const FormingChrysalis = ({ className = '' }: IllustrationProps) => (
    <svg
        className={className}
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {/* Branch with texture */}
        <path d="M16 6 L48 6" />
        <path d="M18 6 L16 4" opacity="0.4" />
        <path d="M24 6 L22 4" opacity="0.3" />
        <path d="M40 6 L42 4" opacity="0.3" />
        <path d="M46 6 L48 4" opacity="0.4" />
        {/* Silk pad attachment */}
        <path d="M32 6 L32 12" />
        <ellipse cx="32" cy="10" rx="4" ry="2" opacity="0.3" />
        {/* Silk threads being spun */}
        <path d="M26 14 Q32 18 38 14" strokeDasharray="1 2" opacity="0.3" />
        <path d="M24 18 Q32 24 40 18" strokeDasharray="1 2" opacity="0.3" />
        <path d="M22 22 Q32 30 42 22" strokeDasharray="1 2" opacity="0.25" />
        {/* Caterpillar in J-shape, curling */}
        <path d="M32 14
                 Q38 18 40 28
                 Q40 42 32 52
                 Q24 42 24 28
                 Q26 18 32 14" />
        {/* Body segments still visible */}
        <path d="M27 20 Q32 18 37 20" opacity="0.4" />
        <path d="M25 26 Q32 23 39 26" opacity="0.35" />
        <path d="M24 33 Q32 30 40 33" opacity="0.3" />
        <path d="M25 40 Q32 37 39 40" opacity="0.25" />
        <path d="M27 47 Q32 44 37 47" opacity="0.2" />
        {/* Head tucking in */}
        <circle cx="32" cy="50" r="3" opacity="0.5" />
        <circle cx="33" cy="49" r="0.8" fill="currentColor" opacity="0.4" />
        {/* Old skin starting to split */}
        <path d="M30 16 L28 14" opacity="0.2" />
        <path d="M34 16 L36 14" opacity="0.2" />
        {/* Cremaster forming */}
        <circle cx="32" cy="13" r="1.5" fill="currentColor" opacity="0.4" />
    </svg>
);

// Step 3: Chrysalis - Design/Building phase
export const Chrysalis = ({ className = '' }: IllustrationProps) => (
    <svg
        className={className}
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {/* Branch with bark texture */}
        <path d="M16 5 L48 5" />
        <path d="M18 5 L17 3" opacity="0.3" />
        <path d="M28 5 L27 3" opacity="0.25" />
        <path d="M36 5 L37 3" opacity="0.25" />
        <path d="M46 5 L47 3" opacity="0.3" />
        {/* Silk button/cremaster */}
        <path d="M32 5 L32 10" />
        <ellipse cx="32" cy="8" rx="3" ry="1.5" opacity="0.4" />
        <circle cx="32" cy="10" r="2" fill="currentColor" opacity="0.3" />
        {/* Chrysalis main shape - elegant jade form */}
        <path d="M32 10
                 Q40 16 42 30
                 Q42 46 32 56
                 Q22 46 22 30
                 Q24 16 32 10" />
        {/* Ridge/keel line */}
        <path d="M32 14 L32 52" opacity="0.15" />
        {/* Horizontal segment ridges */}
        <path d="M26 18 Q32 16 38 18" opacity="0.3" />
        <path d="M24 24 Q32 21 40 24" opacity="0.3" />
        <path d="M23 32 Q32 28 41 32" opacity="0.3" />
        <path d="M24 40 Q32 36 40 40" opacity="0.25" />
        <path d="M26 48 Q32 44 38 48" opacity="0.2" />
        {/* Wing case outlines visible through shell */}
        <path d="M28 22 Q26 32 28 42" opacity="0.15" />
        <path d="M36 22 Q38 32 36 42" opacity="0.15" />
        {/* Spiracles (breathing holes) */}
        <circle cx="24" cy="28" r="0.8" opacity="0.3" />
        <circle cx="40" cy="28" r="0.8" opacity="0.3" />
        <circle cx="24" cy="36" r="0.8" opacity="0.3" />
        <circle cx="40" cy="36" r="0.8" opacity="0.3" />
        {/* Metallic spots/tubercles */}
        <circle cx="32" cy="16" r="1.2" fill="currentColor" opacity="0.35" />
        <circle cx="28" cy="20" r="0.8" fill="currentColor" opacity="0.3" />
        <circle cx="36" cy="20" r="0.8" fill="currentColor" opacity="0.3" />
        <circle cx="30" cy="32" r="1" fill="currentColor" opacity="0.25" />
        <circle cx="34" cy="32" r="1" fill="currentColor" opacity="0.25" />
        <circle cx="32" cy="44" r="0.8" fill="currentColor" opacity="0.2" />
        {/* Surface texture */}
        <path d="M27 26 L29 27" opacity="0.15" />
        <path d="M35 26 L37 27" opacity="0.15" />
        <path d="M27 38 L29 39" opacity="0.15" />
        <path d="M35 38 L37 39" opacity="0.15" />
    </svg>
);

// Step 4: Butterfly Emerging - Ship It phase
export const ButterflyEmerging = ({ className = '' }: IllustrationProps) => (
    <svg
        className={className}
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {/* Thorax */}
        <ellipse cx="32" cy="28" rx="3" ry="5" />
        {/* Abdomen with segments */}
        <ellipse cx="32" cy="40" rx="2.5" ry="8" />
        <path d="M30 34 L34 34" opacity="0.3" />
        <path d="M29.5 38 L34.5 38" opacity="0.25" />
        <path d="M30 42 L34 42" opacity="0.2" />
        <path d="M30.5 46 L33.5 46" opacity="0.15" />
        {/* Head */}
        <circle cx="32" cy="20" r="4" />
        {/* Compound eyes */}
        <ellipse cx="30" cy="19" rx="1.5" ry="2" fill="currentColor" opacity="0.6" />
        <ellipse cx="34" cy="19" rx="1.5" ry="2" fill="currentColor" opacity="0.6" />
        {/* Proboscis coiled */}
        <path d="M32 23 Q33 25 32 26 Q31 27 32 28" opacity="0.4" />
        {/* Antennae - clubbed */}
        <path d="M30 16 Q26 10 22 6" />
        <ellipse cx="22" cy="6" rx="1" ry="2" fill="currentColor" opacity="0.5" transform="rotate(-30 22 6)" />
        <path d="M34 16 Q38 10 42 6" />
        <ellipse cx="42" cy="6" rx="1" ry="2" fill="currentColor" opacity="0.5" transform="rotate(30 42 6)" />
        {/* Left forewing */}
        <path d="M29 24 Q20 16 10 18 Q4 24 6 34 Q10 42 20 42 Q26 40 29 34" />
        {/* Left forewing veins */}
        <path d="M29 28 Q20 26 12 30" opacity="0.25" />
        <path d="M28 32 Q22 34 16 36" opacity="0.2" />
        <path d="M10 22 L18 30" opacity="0.15" />
        {/* Left hindwing */}
        <path d="M29 36 Q20 38 14 46 Q16 54 24 56 Q30 54 30 46 Q30 42 29 38" />
        {/* Left hindwing details */}
        <path d="M28 42 Q22 46 18 50" opacity="0.2" />
        <path d="M26 48 L22 52" opacity="0.15" />
        {/* Right forewing */}
        <path d="M35 24 Q44 16 54 18 Q60 24 58 34 Q54 42 44 42 Q38 40 35 34" />
        {/* Right forewing veins */}
        <path d="M35 28 Q44 26 52 30" opacity="0.25" />
        <path d="M36 32 Q42 34 48 36" opacity="0.2" />
        <path d="M54 22 L46 30" opacity="0.15" />
        {/* Right hindwing */}
        <path d="M35 36 Q44 38 50 46 Q48 54 40 56 Q34 54 34 46 Q34 42 35 38" />
        {/* Right hindwing details */}
        <path d="M36 42 Q42 46 46 50" opacity="0.2" />
        <path d="M38 48 L42 52" opacity="0.15" />
        {/* Wing spots/eyespots */}
        <circle cx="14" cy="28" r="3" opacity="0.2" />
        <circle cx="14" cy="28" r="1.5" opacity="0.3" />
        <circle cx="50" cy="28" r="3" opacity="0.2" />
        <circle cx="50" cy="28" r="1.5" opacity="0.3" />
        <circle cx="20" cy="48" r="2.5" opacity="0.2" />
        <circle cx="20" cy="48" r="1" opacity="0.3" />
        <circle cx="44" cy="48" r="2.5" opacity="0.2" />
        <circle cx="44" cy="48" r="1" opacity="0.3" />
        {/* Wing edge scalloping */}
        <path d="M6 34 Q8 36 6 38" opacity="0.2" />
        <path d="M58 34 Q56 36 58 38" opacity="0.2" />
        {/* Legs (3 pairs) */}
        <path d="M30 26 L26 30 L24 34" opacity="0.4" />
        <path d="M34 26 L38 30 L40 34" opacity="0.4" />
        <path d="M30 30 L26 36" opacity="0.3" />
        <path d="M34 30 L38 36" opacity="0.3" />
    </svg>
);

// Export all as a collection
export const MetamorphosisStages = {
    1: Caterpillar,
    2: FormingChrysalis,
    3: Chrysalis,
    4: ButterflyEmerging,
};

export default MetamorphosisStages;
