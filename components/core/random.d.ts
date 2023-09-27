import { Point } from './geometry';
export declare function randomSeed(): number;
export declare class Randomizer {
    private seed;
    constructor(seed: number);
    next(): number;
    rangeOffset(min: number, max: number, roughness: number): number;
    valueOffset(x: number, roughness: number): number;
    point(p: Point, offset: number, roughness: number): Point;
}
