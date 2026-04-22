import type { ReactNode } from "react";

/**
 * Preview pages render edge-to-edge like hosted sites. Cancel the body's
 * header-height padding since there's no nertia header overlay here either.
 */
export default function PreviewLayout({ children }: { children: ReactNode }) {
    return (
        <div style={{ marginTop: "calc(-1 * var(--header-height))" }}>
            {children}
        </div>
    );
}
