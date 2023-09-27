import { RenderOps, Op } from './graphics';
export declare function createGroup(parent: SVGElement, id?: string): SVGElement;
export declare function renderSvgPath(parent: SVGElement, ops: RenderOps): SVGElement;
export declare function fillSvgPath(parent: SVGElement, shape: Op[], asStroke?: boolean): SVGElement;
