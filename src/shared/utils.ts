import { mergeWith } from "lodash";

export function formatNumber(n: number, minimumFractionDigits: number, maximumFractionDigits: number): string {
  if (isNaN(n)) return '';

  return n.toLocaleString(undefined, {minimumFractionDigits, maximumFractionDigits});
}

export function autoFormatNumber(n: number): string {
  const min = (n >= 1 ? 0 : 1);
  const max = (n > 100 ?
    0 :
    (n > 1 ? 1 : 2)
  );
  return formatNumber(n, min, max);
}

export function enumFromKey<T> (enm: { [s: string]: T}, value: string): T | undefined {
  return (Object.values(enm) as unknown as string[]).includes(value)
    ? value as unknown as T
    : undefined;
}

export function getRandomFromArray<T>(array: T[]) {
  const r = Math.random() * array.length;
  return array[Math.floor(r)];
}

export function getExponentialValue(base: number, growth: number, growthCount: number) {
  return base * Math.pow(growth, growthCount);
}

// TODO: https://www.youtube.com/watch?v=mglS3_gG-n8
export function getExpValueMultiple(base: number, growth: number, growthCount: number, numIterations: number) {
  return getExponentialValue(base, growth, growthCount) *
    (Math.pow(growth, numIterations) - 1) / (growth - 1);
}

export function getMultipleFromExpValue(base: number, growth: number, growthCount: number, currentValue: number) {
  const inner = ((currentValue) * (growth - 1) / (base * Math.pow(growth, growthCount))) + 1;
  const multiple = Math.log(inner) / Math.log(growth);
  return Math.round(multiple * 10000) / 10000;
}

export function using<T>(thing: T | undefined, closure: (thing: T) => void) {
  if (thing) {
    closure(thing);
  }
}

export function mergeSum<T extends {[s: string]: number}>(a: T, b: T): T {
  return mergeWith(a, b, (aVal, bVal) => (aVal ?? 0) + (bVal ?? 0));
}

export function mergeSumPartial<T extends {[s: string]: number}>(a: T, b: Partial<T>): T {
  return mergeWith(a, b, (aVal, bVal) => (aVal ?? 0) + (bVal ?? 0));
}

export interface Point {
  x: number;
  y: number;
}

export function lerpLineSegment(a: Point, b: Point, inter: number): Point {
  const delta = {x: b.x - a.x, y: b.y - a.y};
  return {x: a.x + delta.x * inter, y: a.y + delta.y * inter};
}

export function getMagnitude(v: Point) {
  return Math.sqrt(v.x*v.x + v.y*v.y);
}

export function subtractVector(a: Point, b: Point) {
  return {x: b.x - a.x, y: b.y - a.y};
}

export function normalizeVector(v: Point): Point {
  const mag = getMagnitude(v);
  return {x: v.x / mag, y: v.y / mag};
}

export function scaleVector(v: Point, scalar: number) {
  return {x: v.x * scalar, y: v.y * scalar};
}

export function lineSegmentBetweenCircles(ca: Point, cb: Point, radius: number): [Point, Point] {
  const deltaVector = normalizeVector(subtractVector(ca, cb));

  return [
    subtractVector(scaleVector(deltaVector, -radius), ca),
    subtractVector(scaleVector(deltaVector, radius), cb),
  ];
}