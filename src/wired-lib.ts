import { Point } from 'roughjs/bin/geometry.js';
import { ResolvedOptions, OpSet, Op } from 'roughjs/bin/core';
import {
  line as roughLine,
  rectangle as roughRectangle,
  ellipse as roughEllipse,
  polygon as roughPolygon,
  doubleLineFillOps,
  generateEllipseParams
} from 'roughjs/bin/renderer';
import { ZigZagFiller } from 'roughjs/bin/fillers/zigzag-filler';
import { RenderHelper } from 'roughjs/bin/fillers/filler-interface';

type Params = { [name: string]: string };

const fillHelper: RenderHelper = {
  randOffset(x: number, _o: ResolvedOptions): number {
    return x;
  },
  randOffsetWithRange(min: number, max: number, _o: ResolvedOptions): number {
    return (min + max) / 2;
  },
  ellipse(x: number, y: number, width: number, height: number, o: ResolvedOptions): OpSet {
    return roughEllipse(x, y, width, height, o);
  },
  doubleLineOps(x1: number, y1: number, x2: number, y2: number, o: ResolvedOptions): Op[] {
    return doubleLineFillOps(x1, y1, x2, y2, o);
  }
};

function options(seed: number): ResolvedOptions {
  return {
    maxRandomnessOffset: 2,
    roughness: 1,
    bowing: 0.85,
    stroke: '#000',
    strokeWidth: 1.5,
    curveTightness: 0,
    curveFitting: 0.95,
    curveStepCount: 9,
    fillStyle: 'hachure',
    fillWeight: 3.5,
    hachureAngle: -41,
    hachureGap: 5,
    dashOffset: -1,
    dashGap: -1,
    zigzagOffset: 0,
    combineNestedSvgPaths: false,
    disableMultiStroke: false,
    disableMultiStrokeFill: false,
    seed
  };
}

function opsToPath(drawing: OpSet, joinPaths: boolean): string {
  let path = '';
  for (const item of drawing.ops) {
    const data = item.data;
    switch (item.op) {
      case 'move':
        if (joinPaths && path) {
          break;
        }
        path += `M${data[0]} ${data[1]} `;
        break;
      case 'bcurveTo':
        path += `C${data[0]} ${data[1]}, ${data[2]} ${data[3]}, ${data[4]} ${data[5]} `;
        break;
      case 'lineTo':
        path += `L${data[0]} ${data[1]} `;
        break;
    }
  }
  return path.trim();
}

export function svgNode(tagName: string, attributes?: Params): SVGElement {
  const n = document.createElementNS('http://www.w3.org/2000/svg', tagName);
  if (attributes) {
    for (const p in attributes) {
      n.setAttributeNS(null, p, attributes[p]);
    }
  }
  return n;
}

function createPathNode(ops: OpSet, parent: SVGElement | null, joinPaths = false): SVGPathElement {
  const path = svgNode('path', { d: opsToPath(ops, joinPaths) });
  if (parent) {
    parent.appendChild(path);
  }
  return path as SVGPathElement;
}

export function rectangle(parent: SVGElement, x: number, y: number, width: number, height: number, seed: number): SVGElement {
  return createPathNode(roughRectangle(x + 2, y + 2, width - 4, height - 4, options(seed)), parent);
}

export function line(parent: SVGElement, x1: number, y1: number, x2: number, y2: number, seed: number): SVGElement {
  return createPathNode(roughLine(x1, y1, x2, y2, options(seed)), parent);
}

export function polygon(parent: SVGElement, vertices: Point[], seed: number): SVGElement {
  return createPathNode(roughPolygon(vertices, options(seed)), parent, true);
}

export function ellipse(parent: SVGElement, x: number, y: number, width: number, height: number, seed: number): SVGElement {
  width = Math.max(width > 10 ? width - 4 : width - 1, 1);
  height = Math.max(height > 10 ? height - 4 : height - 1, 1);
  return createPathNode(roughEllipse(x, y, width, height, options(seed)), parent);
}

export function hachureFill(points: Point[], seed: number): SVGElement {
  const hf = new ZigZagFiller(fillHelper);
  const ops = hf.fillPolygon(points, options(seed));
  return createPathNode(ops, null);
}

export function hachureEllipseFill(cx: number, cy: number, width: number, height: number, seed: number): SVGElement {
  const o = options(seed);
  const ep = generateEllipseParams(width, height, o);
  const vertices: Point[] = [];
  let angle = 0;
  while (angle <= (Math.PI * 2)) {
    vertices.push([
      cx + ep.rx * Math.cos(angle),
      cy + ep.ry * Math.sin(angle)
    ]);
    angle += ep.increment;
  }
  return hachureFill(vertices, seed);
}