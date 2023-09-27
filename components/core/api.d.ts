export type FillType = 'none' | 'solid' | 'hachure' | 'cross-hatch' | 'zigzag' | 'dots';
export declare type OpType = 'move' | 'bcurveTo' | 'qcurveTo' | 'lineTo' | 'ellipse';
export declare type OpSetType = 'path' | 'fillPath' | 'fillSketch';
export interface DrawingOptions {
    roughness?: number;
    controlPointMultiplier?: number;
    controlIncrementLength?: number;
    strokeWidth?: number;
    strokeColor?: string;
    fillWidth?: number;
    fillAngle?: number;
    fillGap?: number;
    fillColor?: string;
    fillType?: FillType;
    seed?: number;
    doubleStroke?: boolean;
}
export interface ResolvedDrawingOptions {
    roughness: number;
    controlPointMultiplier: number;
    controlIncrementLength: number;
    strokeWidth: number;
    strokeColor: string;
    fillWidth: number;
    fillAngle: number;
    fillGap: number;
    fillColor: string;
    fillType: FillType;
    seed: number;
    doubleStroke: boolean;
}
export declare const DefaultDrawingOptions: ResolvedDrawingOptions;
export interface Drawable {
    shape: string;
    options: ResolvedDrawingOptions;
    sets: OpSet[];
}
export interface Op {
    op: OpType;
    data: number[];
}
export interface OpSet {
    type: OpSetType;
    ops: Op[];
    fillRule?: CanvasFillRule;
}
export declare function resolveOptions(options?: DrawingOptions): ResolvedDrawingOptions;
