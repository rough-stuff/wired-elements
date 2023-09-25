import { Point, Line, lineLength } from './geometry.js';
import { RenderOps, Op, _rectangle, _line, _spline, _linearPath, ResolvedRenderStyle, _roundedRectangle } from './graphics.js';
import { Randomizer } from './random';
import { pointsOnBezierCurves } from 'points-on-curve';

const TOLERANCE = 0.125;
const TOLERANCE_DISTANCE = 0.125;
const MAX_STROKE_WIDTH = 1.5;
const MIN_STROKE_WIDTH = 0.8;

export function linearPath(points: Point[], close: boolean, randomizer: Randomizer, style: ResolvedRenderStyle, roughness = 1): RenderOps {
  const ops = _linearPath(points, close, randomizer, style === 'classic', roughness);
  if (style !== 'classic') {
    ops.textured = _renderOutilneCurve(ops.shape);
  }
  return ops;
}

export function rectangle(topLeft: Point, width: number, height: number, randomizer: Randomizer, style: ResolvedRenderStyle, roughness = 1): RenderOps {
  const ops = _rectangle(topLeft, width, height, randomizer, style === 'classic', roughness);
  if (style !== 'classic') {
    ops.textured = _renderOutilneCurve(ops.shape);
  }
  return ops;
}

export function line(p1: Point, p2: Point, randomizer: Randomizer, style: ResolvedRenderStyle, roughness = 1): RenderOps {
  const ops = _line(p1, p2, randomizer, style === 'classic', roughness);
  if (style !== 'classic') {
    ops.textured = _renderOutilneCurve(ops.shape);
  }
  return ops;
}

export function roundedRectangle(topLeft: Point, width: number, height: number, radius: number, randomizer: Randomizer, style: ResolvedRenderStyle, roughness = 1): RenderOps {
  const ops = _roundedRectangle(topLeft, width, height, radius, randomizer, style === 'classic', roughness);
  if (style !== 'classic') {
    ops.textured = _renderOutilneCurve(ops.shape);
  }
  return ops;
}

function _renderOutilneCurve(ops: Op[]): Op[][] {
  const curves = _extractCurves(ops);
  const out: Op[][] = [];
  for (const curve of curves) {
    const { outer, inner } = _curveOutline(curve);
    out.push(_spline(outer.concat(inner.reverse()), 1, true));
  }
  return out;
}

function _extractCurves(ops: Op[]): Point[][] {
  const curves: Point[][] = [];
  let current: Point[] = [];
  for (const item of ops) {
    const { type, data } = item;
    switch (type) {
      case 'move':
        if (current.length >= 4) {
          curves.push(current);
        }
        current = [];
        current.push([data[0], data[1]]);
        break;
      case 'bcurveTo':
        current.push([data[0], data[1]]);
        current.push([data[2], data[3]]);
        current.push([data[4], data[5]]);
        break;
    }
  }
  if (current.length >= 4) {
    curves.push(current);
  }
  return curves;
}

export function _curveOutline(curve: Point[]): { outer: Point[], inner: Point[] } {
  const outer: Point[] = [];
  const inner: Point[] = [];
  const points = pointsOnBezierCurves(curve, TOLERANCE, TOLERANCE_DISTANCE);
  if (points.length > 1) {
    let maxD = 0;
    let minD = Number.MAX_VALUE;
    for (let i = 0; i < points.length; i++) {
      const p1 = (i === 0) ? points[i] : points[i - 1];
      const p2 = (i === 0) ? points[i + 1] : points[i];
      const d = lineLength([p1, p2] as Line);
      if (d > maxD) {
        maxD = d;
      }
      if (d < minD) {
        minD = d;
      }
    }


    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const p1 = (i === 0) ? points[i] : points[i - 1];
      const p2 = (i === 0) ? points[i + 1] : points[i];
      const dist = lineLength([p1, p2] as Line);
      let strokeOffset = 0.5;
      if (maxD !== minD) {
        strokeOffset = MAX_STROKE_WIDTH - ((maxD - dist) * ((MAX_STROKE_WIDTH - MIN_STROKE_WIDTH) / (maxD - minD)));
      }
      let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
      let slope = 0;
      if (Math.round(p2[0] - p1[0]) === 0) {
        y1 = y2 = p[1];
        x1 = p[0] + strokeOffset;
        x2 = p[0] - strokeOffset;
      } else if (Math.round(p2[1] - p1[1]) === 0) {
        x1 = x2 = p[0];
        y1 = p[1] - strokeOffset;
        y2 = p[1] + strokeOffset;
      } else {
        slope = (p2[1] - p1[1]) / (p2[0] - p1[0]);
        const m = -1 / slope;
        x1 = p[0] + (strokeOffset / Math.sqrt(1 + m * m));
        x2 = p[0] - (strokeOffset / Math.sqrt(1 + m * m));
        y1 = p[1] + (m * (x1 - p[0]));
        y2 = p[1] + (m * (x2 - p[0]));
      }

      outer.push(slope < 0 ? [x2, y2] : [x1, y1]);
      inner.push(slope < 0 ? [x1, y1] : [x2, y2]);
    }
  }

  return { outer, inner };
}