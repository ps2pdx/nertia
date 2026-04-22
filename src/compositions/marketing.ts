import type { CompositionDef } from "./types";

export const marketing: CompositionDef = {
    id: "marketing",
    displayName: "Marketing",
    tags: ["marketing", "product", "saas", "startup", "landing", "launch", "app", "platform"],
    sections: [
        { id: "navbar", instanceId: "nav-1" },
        { id: "marketing-hero", instanceId: "hero-1" },
        { id: "pricing", instanceId: "pricing-1" },
        { id: "about", instanceId: "about-1" },
        { id: "footer", instanceId: "footer-1" },
    ],
};
