export type Point = [number, number];
export type Line = [Point, Point];
export declare function rotatePoints(points: Point[], center: Point, angle: number): Point[];
export declare function lineLength(line: Line): number;
export declare function centerPoint(p1: Point, p2: Point): Point;
