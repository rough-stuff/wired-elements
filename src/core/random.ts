import { Point } from './geometry';

export function randomSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}

export class Randomizer {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    if (this.seed) {
      return ((2 ** 31 - 1) & (this.seed = Math.imul(48271, this.seed))) / 2 ** 31;
    } else {
      return Math.random();
    }
  }

  rangeOffset(min: number, max: number, roughness: number): number {
    return roughness * ((this.next() * (max - min)) + min);
  }

  valueOffset(x: number, roughness: number): number {
    return this.rangeOffset(-x, x, roughness);
  }

  point(p: Point, offset: number, roughness: number): Point {
    return [p[0] + this.valueOffset(offset, roughness), p[1] + this.valueOffset(offset, roughness)];
  }
}