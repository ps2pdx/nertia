import type { Section } from "../types";
import { Component } from "./Component";
import { schema } from "./schema";
import { meta } from "./meta";
import { writeCopy } from "./writeCopy";

export const footer: Section = { meta, schema, Component, writeCopy };
