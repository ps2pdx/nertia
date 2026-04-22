import type { Section } from "../types";
import { Component } from "./Component";
import { schema } from "./schema";
import { meta } from "./meta";

export const postList: Section = { meta, schema, Component };
