declare type Params = {
    [name: string]: string;
};
export declare type Point = [number, number];
export declare function svgNode(tagName: string, attributes?: Params): SVGElement;
export declare function line(parent: SVGElement, x1: number, y1: number, x2: number, y2: number): SVGElement;
export declare function rectangle(parent: SVGElement, x: number, y: number, width: number, height: number): SVGElement;
export declare function polygon(parent: SVGElement, vertices: Point[]): SVGElement;
export declare function ellipse(parent: SVGElement, x: number, y: number, width: number, height: number): SVGElement;
export declare function hachureFill(points: Point[]): SVGElement;
export declare function hachureEllipseFill(cx: number, cy: number, width: number, height: number): SVGElement;
export declare function fire(element: HTMLElement, name: string, detail?: any, bubbles?: boolean, composed?: boolean): void;
export {};
