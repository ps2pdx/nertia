import type { CompositionDef } from "./types";

export const docs: CompositionDef = {
    id: "docs",
    displayName: "Docs home",
    tags: ["docs", "documentation", "api", "reference", "guide", "sdk", "developer"],
    sections: [
        { id: "navbar", instanceId: "nav-1" },
        { id: "docs-sidebar", instanceId: "docs-1" },
        { id: "footer", instanceId: "footer-1" },
    ],
};
