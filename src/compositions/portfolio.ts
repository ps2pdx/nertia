import type { CompositionDef } from "./types";

export const portfolio: CompositionDef = {
    id: "portfolio",
    displayName: "Portfolio",
    tags: ["portfolio", "personal", "bio", "resume", "about-me", "consultant", "creator", "designer", "engineer"],
    sections: [
        { id: "navbar", instanceId: "nav-1" },
        { id: "marketing-hero", instanceId: "hero-1" },
        { id: "projects-grid", instanceId: "projects-1" },
        { id: "about", instanceId: "about-1" },
        { id: "footer", instanceId: "footer-1" },
    ],
};
