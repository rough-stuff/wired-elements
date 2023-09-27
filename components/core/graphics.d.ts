import { Point } from './geometry';
import { Randomizer } from './random';
export type ResolvedRenderStyle = 'classic' | 'pen' | 'pencil';
export type RenderStyle = ResolvedRenderStyle | 'inherit';
export type OpType = 'move' | 'bcurveTo' | 'lineTo' | 'ellipse';
export interface Op {
    type: OpType;
    data: number[];
}
export interface RenderOps {
    shape: Op[];
    overlay: Op[];
    textured?: Op[][];
    adjacentCurveList?: Point[][];
}
export declare function mergedShape(rect: RenderOps): Op[];
export declare function _line(p1: Point, p2: Point, randomizer: Randomizer, doubleStroke?: boolean, roughness?: number): RenderOps;
export declare function _linearPath(points: Point[], close: boolean, randomizer: Randomizer, doubleStroke?: boolean, roughness?: number): RenderOps;
export declare function polygon(points: Point[], randomizer: Randomizer, doubleStroke?: boolean, roughness?: number): RenderOps;
export declare function _rectangle(topLeft: Point, width: number, height: number, randomizer: Randomizer, doubleStroke?: boolean, roughness?: number): RenderOps;
export declare function _roundedRectangle(topLeft: Point, width: number, height: number, radius: number, randomizer: Randomizer, doubleStroke: boolean | undefined, roughness: number | undefined, ignoreAdjacentCurves: boolean): RenderOps;
export declare function _ellipsePoints(center: Point, width: number, height: number, randomizer: Randomizer, doubleStroke?: boolean, roughness?: number): {
    ellipsePoints: Point[];
    overlayEllipsePoints: Point[];
};
export declare function _ellipse(center: Point, width: number, height: number, randomizer: Randomizer, doubleStroke?: boolean, roughness?: number): RenderOps;
export declare function arc(center: Point, radius: number, startAngle: number, endAngle: number, randomizer: Randomizer, doubleStroke?: boolean, roughness?: number): RenderOps;
export declare function _spline(input?: Point[], tension?: number, close?: boolean): Op[];
