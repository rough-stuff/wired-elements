import { Point } from './geometry.js';
import { RenderOps, ResolvedRenderStyle } from './graphics.js';
import { Randomizer } from './random';
export declare function linearPath(points: Point[], close: boolean, randomizer: Randomizer, style: ResolvedRenderStyle, roughness?: number): RenderOps;
export declare function rectangle(topLeft: Point, width: number, height: number, randomizer: Randomizer, style: ResolvedRenderStyle, roughness?: number): RenderOps;
export declare function line(p1: Point, p2: Point, randomizer: Randomizer, style: ResolvedRenderStyle, roughness?: number): RenderOps;
export declare function roundedRectangle(topLeft: Point, width: number, height: number, radius: number, randomizer: Randomizer, style: ResolvedRenderStyle, roughness?: number): RenderOps;
export declare function ellipse(center: Point, width: number, height: number, randomizer: Randomizer, style: ResolvedRenderStyle, roughness?: number): RenderOps;
export declare function _curveOutline(curve: Point[], bezier: boolean): {
    outer: Point[];
    inner: Point[];
};
