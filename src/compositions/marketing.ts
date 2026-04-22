import type { CompositionDef } from "./types";

export const marketing: CompositionDef = {
    id: "marketing",
    displayName: "Marketing",
    tags: ["marketing", "product", "saas", "startup", "landing", "launch", "app", "platform"],
    sections: [
        { id: "marketing-hero", instanceId: "hero-1" },
        { id: "about", instanceId: "about-1" },
        { id: "footer", instanceId: "footer-1" },
    ],
};
