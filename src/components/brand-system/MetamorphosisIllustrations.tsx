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
        {/* Body segments */}
        <circle cx="12" cy="40" r="6" />
        <circle cx="22" cy="38" r="6" />
        <circle cx="32" cy="36" r="6" />
        <circle cx="42" cy="38" r="6" />
        {/* Head */}
        <circle cx="52" cy="40" r="7" />
        {/* Antennae */}
        <path d="M54 33 L58 26" />
        <path d="M50 33 L46 26" />
        {/* Eye */}
        <circle cx="54" cy="39" r="1.5" fill="currentColor" />
        {/* Legs */}
        <path d="M12 46 L10 52" />
        <path d="M22 44 L20 50" />
        <path d="M32 42 L30 48" />
        <path d="M42 44 L40 50" />
        {/* Ground line */}
        <path d="M4 54 L60 54" strokeDasharray="2 2" opacity="0.3" />
        {/* Leaf being eaten */}
        <path d="M56 44 Q62 40 58 34 Q54 38 56 44" opacity="0.5" />
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
        {/* Branch */}
        <path d="M20 8 L32 8 L44 8" />
        <path d="M32 8 L32 16" />
        {/* Silk threads forming */}
        <path d="M28 16 Q32 20 36 16" strokeDasharray="2 1" opacity="0.4" />
        <path d="M26 20 Q32 26 38 20" strokeDasharray="2 1" opacity="0.4" />
        {/* Caterpillar curling up */}
        <ellipse cx="32" cy="36" rx="10" ry="14" />
        {/* Internal segments showing through */}
        <path d="M26 28 Q32 26 38 28" opacity="0.3" />
        <path d="M25 34 Q32 32 39 34" opacity="0.3" />
        <path d="M25 40 Q32 38 39 40" opacity="0.3" />
        <path d="M26 46 Q32 44 38 46" opacity="0.3" />
        {/* Attachment point */}
        <circle cx="32" cy="20" r="2" fill="currentColor" opacity="0.5" />
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
        {/* Branch */}
        <path d="M20 6 L32 6 L44 6" />
        <path d="M32 6 L32 12" />
        {/* Chrysalis shape - elegant pointed oval */}
        <path d="M32 12
                 Q38 16 40 28
                 Q40 44 32 54
                 Q24 44 24 28
                 Q26 16 32 12" />
        {/* Surface texture lines */}
        <path d="M28 20 L36 20" opacity="0.3" />
        <path d="M26 28 L38 28" opacity="0.3" />
        <path d="M26 36 L38 36" opacity="0.3" />
        <path d="M28 44 L36 44" opacity="0.3" />
        {/* Hint of wing patterns inside */}
        <path d="M30 24 Q32 30 30 36" opacity="0.2" />
        <path d="M34 24 Q32 30 34 36" opacity="0.2" />
        {/* Golden spots */}
        <circle cx="32" cy="18" r="1" fill="currentColor" opacity="0.4" />
        <circle cx="30" cy="32" r="1" fill="currentColor" opacity="0.4" />
        <circle cx="34" cy="32" r="1" fill="currentColor" opacity="0.4" />
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
        {/* Body */}
        <ellipse cx="32" cy="34" rx="3" ry="12" />
        {/* Head */}
        <circle cx="32" cy="20" r="4" />
        {/* Antennae */}
        <path d="M30 16 Q28 10 24 8" />
        <path d="M34 16 Q36 10 40 8" />
        {/* Antenna tips */}
        <circle cx="24" cy="8" r="1.5" fill="currentColor" />
        <circle cx="40" cy="8" r="1.5" fill="currentColor" />
        {/* Left wing - upper */}
        <path d="M29 26 Q16 18 10 24 Q8 32 14 38 Q22 42 29 36" />
        {/* Left wing - lower */}
        <path d="M29 38 Q18 42 14 50 Q20 56 28 52 Q30 46 29 42" />
        {/* Right wing - upper */}
        <path d="M35 26 Q48 18 54 24 Q56 32 50 38 Q42 42 35 36" />
        {/* Right wing - lower */}
        <path d="M35 38 Q46 42 50 50 Q44 56 36 52 Q34 46 35 42" />
        {/* Wing patterns */}
        <circle cx="18" cy="30" r="3" opacity="0.3" />
        <circle cx="46" cy="30" r="3" opacity="0.3" />
        <circle cx="20" cy="48" r="2" opacity="0.3" />
        <circle cx="44" cy="48" r="2" opacity="0.3" />
        {/* Eye */}
        <circle cx="32" cy="19" r="1" fill="currentColor" />
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
