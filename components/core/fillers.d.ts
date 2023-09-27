import { OpSet, ResolvedDrawingOptions } from './api';
import { Point } from './geometry';
import { Randomizer } from './random';
export declare function HachureFillPolygon(points: Point[], randomizer: Randomizer, o: ResolvedDrawingOptions): OpSet;
export declare function CrossHatchFillPolygon(points: Point[], randomizer: Randomizer, o: ResolvedDrawingOptions): OpSet;
export declare function ZigzagFillPolygon(points: Point[], randomizer: Randomizer, o: ResolvedDrawingOptions, forceApproximation?: boolean): OpSet;
export declare function DotFillPolygon(points: Point[], randomizer: Randomizer, o: ResolvedDrawingOptions): OpSet;
