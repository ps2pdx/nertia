/**
 * Mini-preview thumbnails for each composition, used by the emerge-step
 * "pick a layout" cards. Static sketches — they don't render real copy,
 * just colored-div representations of the layout shape so users can see
 * the structure before choosing.
 *
 * Brand color is passed via prop (not CSS var) — the emerge step shows
 * multiple cards at once and each one wants to preview the user's chosen
 * brand color as an accent. Everything else (bg, borders, foreground)
 * uses nertia's design-system CSS vars so thumbnails respect dark/light.
 *
 * Visual structure mirrors the composition recipes:
 *   marketing  → nav + hero + pricing strip + footer
 *   portfolio  → nav + hero + 2x2 projects grid + footer
 *   docs       → nav + sidebar split + footer
 *   blog       → nav + 3 post cards + footer
 *   linkinbio  → centered avatar + 4 link pills + footer
 */
import type { ComponentType } from "react";

interface ThumbnailProps {
    brandColor: string;
}

function Frame({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="w-full h-full flex flex-col gap-1 p-2 overflow-hidden bg-[var(--background)] border"
            style={{ borderColor: "var(--card-border)" }}
        >
            {children}
        </div>
    );
}

function Nav() {
    return (
        <div
            className="h-2 border-b"
            style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--card-border)",
            }}
        />
    );
}

function Footer() {
    return (
        <div
            className="h-2 border-t"
            style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--card-border)",
            }}
        />
    );
}

function Hero({ brandColor, compact = false }: { brandColor: string; compact?: boolean }) {
    return (
        <div
            className={`${compact ? "flex-1" : "flex-[1.5]"} flex flex-col items-center justify-center gap-1 px-2`}
            style={{ backgroundColor: "var(--background)" }}
        >
            <div
                className="w-3/4 h-1.5 rounded-sm"
                style={{ backgroundColor: "var(--foreground)" }}
            />
            <div
                className="w-1/2 h-1 rounded-sm"
                style={{ backgroundColor: "var(--muted)" }}
            />
            <div
                className="mt-1 w-10 h-3 border"
                style={{ borderColor: brandColor }}
            />
        </div>
    );
}

export function MarketingThumbnail({ brandColor }: ThumbnailProps) {
    return (
        <Frame>
            <Nav />
            <Hero brandColor={brandColor} compact />
            <div
                className="grid grid-cols-3 gap-1 p-1"
                style={{ backgroundColor: "var(--background)" }}
            >
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="flex flex-col gap-0.5 p-1 border rounded-sm"
                        style={{
                            backgroundColor: "var(--card-bg)",
                            borderColor: "var(--card-border)",
                        }}
                    >
                        <div
                            className="h-0.5 w-1/2"
                            style={{ backgroundColor: brandColor }}
                        />
                        <div
                            className="h-1 w-3/4"
                            style={{ backgroundColor: "var(--foreground)" }}
                        />
                        <div
                            className="h-0.5 w-2/3"
                            style={{ backgroundColor: "var(--muted)" }}
                        />
                    </div>
                ))}
            </div>
            <Footer />
        </Frame>
    );
}

export function PortfolioThumbnail({ brandColor }: ThumbnailProps) {
    return (
        <Frame>
            <Nav />
            <Hero brandColor={brandColor} compact />
            <div
                className="grid grid-cols-2 gap-1 flex-[1.2] p-1"
                style={{ backgroundColor: "var(--background)" }}
            >
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="border rounded-sm"
                        style={{
                            backgroundColor: "var(--card-bg)",
                            borderColor: "var(--card-border)",
                        }}
                    />
                ))}
            </div>
            <Footer />
        </Frame>
    );
}

export function DocsThumbnail({ brandColor }: ThumbnailProps) {
    return (
        <Frame>
            <Nav />
            <div
                className="flex flex-1"
                style={{ backgroundColor: "var(--background)" }}
            >
                <div
                    className="w-[35%] flex flex-col gap-1 p-1.5 border-r"
                    style={{
                        backgroundColor: "var(--card-bg)",
                        borderColor: "var(--card-border)",
                    }}
                >
                    <div
                        className="h-0.5 w-1/2"
                        style={{ backgroundColor: brandColor }}
                    />
                    <div
                        className="h-0.5 w-3/4 mt-1"
                        style={{ backgroundColor: "var(--muted)" }}
                    />
                    <div
                        className="h-0.5 w-2/3"
                        style={{ backgroundColor: "var(--muted)" }}
                    />
                    <div
                        className="h-0.5 w-3/4"
                        style={{ backgroundColor: "var(--muted)" }}
                    />
                    <div
                        className="h-0.5 w-1/2"
                        style={{ backgroundColor: "var(--muted)" }}
                    />
                </div>
                <div className="flex-1 flex flex-col gap-1 p-1.5">
                    <div
                        className="h-1 w-4/5"
                        style={{ backgroundColor: "var(--foreground)" }}
                    />
                    <div
                        className="h-0.5 w-3/4 mt-1"
                        style={{ backgroundColor: "var(--muted)" }}
                    />
                    <div
                        className="h-0.5 w-2/3"
                        style={{ backgroundColor: "var(--muted)" }}
                    />
                    <div
                        className="h-0.5 w-4/5"
                        style={{ backgroundColor: "var(--muted)" }}
                    />
                    <div
                        className="h-0.5 w-1/2"
                        style={{ backgroundColor: "var(--muted)" }}
                    />
                </div>
            </div>
            <Footer />
        </Frame>
    );
}

export function BlogThumbnail({ brandColor }: ThumbnailProps) {
    return (
        <Frame>
            <Nav />
            <div
                className="flex-1 flex flex-col gap-1 p-1.5"
                style={{ backgroundColor: "var(--background)" }}
            >
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="flex flex-col gap-0.5 border rounded-sm p-1.5"
                        style={{
                            backgroundColor: "var(--card-bg)",
                            borderColor: "var(--card-border)",
                        }}
                    >
                        <div
                            className="h-0.5 w-1/4"
                            style={{ backgroundColor: brandColor }}
                        />
                        <div
                            className="h-1 w-4/5"
                            style={{ backgroundColor: "var(--foreground)" }}
                        />
                    </div>
                ))}
            </div>
            <Footer />
        </Frame>
    );
}

export function LinkinbioThumbnail({ brandColor }: ThumbnailProps) {
    return (
        <Frame>
            <div
                className="flex-1 flex flex-col gap-1.5 items-center justify-center px-4"
                style={{ backgroundColor: "var(--background)" }}
            >
                <div
                    className="w-6 h-6 rounded-full border-2"
                    style={{ borderColor: brandColor }}
                />
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="w-3/4 h-2 rounded-full border"
                        style={{ borderColor: brandColor }}
                    />
                ))}
            </div>
            <Footer />
        </Frame>
    );
}

export const thumbnails: Record<string, ComponentType<ThumbnailProps>> = {
    marketing: MarketingThumbnail,
    portfolio: PortfolioThumbnail,
    docs: DocsThumbnail,
    blog: BlogThumbnail,
    linkinbio: LinkinbioThumbnail,
};

export function getThumbnail(id: string): ComponentType<ThumbnailProps> | null {
    return thumbnails[id] ?? null;
}
