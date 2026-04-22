import type { CompositionDef } from "./types";

export const linkinbio: CompositionDef = {
    id: "linkinbio",
    displayName: "Link-in-bio",
    tags: ["links", "bio", "linktree", "link-in-bio", "creator", "musician", "social", "profile"],
    sections: [
        { id: "link-stack", instanceId: "links-1" },
        { id: "footer", instanceId: "footer-1" },
    ],
};
