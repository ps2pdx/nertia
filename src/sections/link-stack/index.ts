import type { Section } from "../types";
import { Component } from "./Component";
import { schema } from "./schema";
import { meta } from "./meta";

export const linkStack: Section = { meta, schema, Component };
