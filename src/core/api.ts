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
  seed: number,
  doubleStroke: boolean;
}

export const DefaultDrawingOptions: ResolvedDrawingOptions = {
  roughness: 2,
  controlIncrementLength: 400,
  controlPointMultiplier: 1,
  strokeWidth: 2,
  strokeColor: '#000000',
  fillWidth: 2,
  fillAngle: -45,
  fillGap: -1,
  fillColor: '#000000',
  fillType: 'none',
  seed: 0,
  doubleStroke: true
};

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

export function resolveOptions(options?: DrawingOptions): ResolvedDrawingOptions {
  const o: ResolvedDrawingOptions = {
    ...DefaultDrawingOptions,
    ...options
  };
  let gap = o.fillGap;
  if (gap < 0) {
    gap = o.strokeWidth * 4;
  }
  gap = Math.max(gap, 0.1);
  o.fillGap = gap;
  return o;
}