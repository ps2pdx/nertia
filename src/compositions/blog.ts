import type { CompositionDef } from "./types";

export const blog: CompositionDef = {
    id: "blog",
    displayName: "Blog",
    tags: ["blog", "writer", "writing", "newsletter", "essays", "journal", "field-notes", "columns"],
    sections: [
        { id: "navbar", instanceId: "nav-1" },
        { id: "post-list", instanceId: "posts-1" },
        { id: "about", instanceId: "about-1" },
        { id: "footer", instanceId: "footer-1" },
    ],
};
