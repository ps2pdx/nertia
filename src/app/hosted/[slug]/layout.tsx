import type { ReactNode } from "react";

/**
 * Hosted user sites render edge-to-edge with their own chrome (navbar
 * section, footer section). Cancel the body-level header-height padding
 * that every nertia-site route inherits from globals.css.
 */
export default function HostedLayout({ children }: { children: ReactNode }) {
    return (
        <div style={{ marginTop: "calc(-1 * var(--header-height))" }}>
            {children}
        </div>
    );
}
