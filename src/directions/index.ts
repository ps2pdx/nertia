import { direction as zeroPoint } from "./zero-point/direction";
import type { Direction } from "./types";

export const directions: Record<string, Direction> = {
  "zero-point": zeroPoint,
};

export function getDirection(name: string): Direction | null {
  return directions[name] ?? null;
}

export function listStableDirections(): Direction[] {
  return Object.values(directions).filter((d) => d.status === "stable");
}
