import { Point, lineLength, rotatePoints, centerPoint } from './geometry';
import { Randomizer } from './random';

export type ResolvedRenderStyle = 'classic' | 'pen' | 'pencil'
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
}

export function mergedShape(rect: RenderOps): Op[] {
  return (rect.overlay.length ? rect.overlay : rect.shape).filter((d, i) => {
    if (i === 0) {
      return true;
    }
    if (d.type === 'move') {
      return false;
    }
    return true;
  });
}

export function _line(p1: Point, p2: Point, randomizer: Randomizer, doubleStroke = true, roughness = 1): RenderOps {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  const length = lineLength([p1, p2]);
  if (length === 0) {
    return {
      shape: [],
      overlay: []
    };
  }
  const center = centerPoint(p1, p2);
  const slope = Math.atan2(y2 - y1, x2 - x1);
  const [q1] = rotatePoints([p1], center, -slope);
  const bowing = 2;
  const controlPointCount = 1;
  let controls: Point[] = [];
  let overlayControls: Point[] = [];
  for (let i = 0; i < (controlPointCount * 2); i++) {
    const curveIndex = Math.floor(i / 2);
    const x = q1[0] + (0.2 + randomizer.next() * 0.6) * length + (curveIndex * length);
    const y = q1[1] + randomizer.valueOffset(bowing, roughness / 2);
    controls.push([x, y]);
  }
  controls.sort((a, b) => a[0] - b[0]);
  if (doubleStroke) {
    const overlayRoughness = 0.75 + ((roughness + 0.75) * 0.25);
    overlayControls = controls.map((p) => randomizer.point(p, bowing, overlayRoughness));
  }
  controls = rotatePoints(controls, center, slope);
  overlayControls = rotatePoints(overlayControls, center, slope);

  // collate ops
  const overlayOps: Op[] = [];
  const ops: Op[] = [{ type: 'move', data: randomizer.point(p1, 2, roughness) }];
  for (let i = 0; i < controlPointCount; i++) {
    const endPoint = randomizer.point(p2, 2, roughness);
    ops.push({
      type: 'bcurveTo',
      data: [
        ...controls[i * 2],
        ...controls[i * 2 + 1],
        ...endPoint,
      ]
    });
  }
  if (doubleStroke) {
    overlayOps.push({ type: 'move', data: randomizer.point(p1, 2, roughness) });
    for (let i = 0; i < controlPointCount; i++) {
      const endPoint = randomizer.point(p2, 2, roughness);
      overlayOps.push({
        type: 'bcurveTo',
        data: [
          ...overlayControls[i * 2],
          ...overlayControls[i * 2 + 1],
          ...endPoint,
        ]
      });
    }
  }
  return {
    shape: ops,
    overlay: overlayOps
  };
}

export function _linearPath(points: Point[], close: boolean, randomizer: Randomizer, doubleStroke = true, roughness = 1): RenderOps {
  const len = (points || []).length;
  if (len > 2) {
    const ops: Op[] = [];
    const overlayOps: Op[] = [];
    for (let i = 0; i < (len - 1); i++) {
      const { shape, overlay } = _line(points[i], points[i + 1], randomizer, doubleStroke, roughness);
      ops.push(...shape);
      overlayOps.push(...overlay);
    }
    if (close) {
      const { shape, overlay } = _line(points[len - 1], points[0], randomizer, doubleStroke, roughness);
      ops.push(...shape);
      overlayOps.push(...overlay);
    }
    return {
      shape: ops,
      overlay: overlayOps
    };
  } else if (len === 2) {
    return _line(points[0], points[1], randomizer, doubleStroke, roughness);
  }
  return {
    shape: [],
    overlay: []
  };
}

export function polygon(points: Point[], randomizer: Randomizer, doubleStroke = true, roughness = 1): RenderOps {
  return _linearPath(points, true, randomizer, doubleStroke, roughness);
}

export function _rectangle(topLeft: Point, width: number, height: number, randomizer: Randomizer, doubleStroke = true, roughness = 1): RenderOps {
  const points: Point[] = [
    topLeft,
    [topLeft[0] + width, topLeft[1]],
    [topLeft[0] + width, topLeft[1] + height],
    [topLeft[0], topLeft[1] + height]
  ];
  return polygon(points, randomizer, doubleStroke, roughness);
}

export function _roundedRectangle(topLeft: Point, width: number, height: number, radius: number, randomizer: Randomizer, doubleStroke = true, roughness = 1): RenderOps {
  const radiusOffset = radius - 8;
  const l1 = _line([topLeft[0] + radiusOffset, topLeft[1]], [topLeft[0] + width - radiusOffset, topLeft[1]], randomizer, doubleStroke, roughness);
  const l2 = _line([topLeft[0] + width - radiusOffset, topLeft[1] + height], [topLeft[0] + radiusOffset, topLeft[1] + height], randomizer, doubleStroke, roughness);
  const shape: Op[] = [...l1.shape];
  const overlay: Op[] = [...l1.overlay];
  {
    const p1Data = l1.shape[l1.shape.length - 1].data;
    const p1: Point = [p1Data[4], p1Data[5]];
    const p2 = l2.shape[0].data as Point;
    const p3: Point = [topLeft[0] + width, (p1[1] + p2[1]) / 2];
    const center: Point = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
    const r = topLeft[0] + width - ((p1[0] + p2[0]) / 2);
    const pa: Point = [center[0] + r * Math.cos(-Math.PI / 4), center[1] + r * Math.sin(-Math.PI / 4)];
    const pb: Point = [center[0] + r * Math.cos(Math.PI / 4), center[1] + r * Math.sin(Math.PI / 4)];
    const sops = _spline([p1, pa, p3, pb, p2], 1, false);
    sops.shift();
    shape.push(...sops);

    if (doubleStroke) {
      const p1Data = l1.overlay[l1.overlay.length - 1].data;
      const p1: Point = [p1Data[4], p1Data[5]];
      const p2 = l2.overlay[0].data as Point;
      const p3: Point = randomizer.point([topLeft[0] + width, (p1[1] + p2[1]) / 2], 1, roughness);
      const center: Point = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
      const r = topLeft[0] + width - ((p1[0] + p2[0]) / 2);
      const pa: Point = [center[0] + r * Math.cos(-Math.PI / 4), center[1] + r * Math.sin(-Math.PI / 4)];
      const pb: Point = [center[0] + r * Math.cos(Math.PI / 4), center[1] + r * Math.sin(Math.PI / 4)];
      const sops = _spline([p1, pa, p3, pb, p2], 1, false);
      sops.shift();
      overlay.push(...sops);
    }
  }
  l2.shape.shift();
  l2.overlay.shift();
  shape.push(...l2.shape);
  overlay.push(...l2.overlay);
  {
    const p1Data = l2.shape[l2.shape.length - 1].data;
    const p1: Point = [p1Data[4], p1Data[5]];
    const p2 = l1.shape[0].data as Point;
    const p3: Point = [topLeft[0], (p1[1] + p2[1]) / 2];
    const center: Point = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
    const r = Math.abs(topLeft[0] - ((p1[0] + p2[0]) / 2));
    const pa: Point = [center[0] + r * Math.cos(3 * Math.PI / 4), center[1] + r * Math.sin(3 * Math.PI / 4)];
    const pb: Point = [center[0] + r * Math.cos(5 * Math.PI / 4), center[1] + r * Math.sin(5 * Math.PI / 4)];
    const sops = _spline([p1, pa, p3, pb, p2], 1, false);
    sops.shift();
    shape.push(...sops);

    if (doubleStroke) {
      const p1Data = l2.overlay[l2.overlay.length - 1].data;
      const p1: Point = [p1Data[4], p1Data[5]];
      const p2 = l1.overlay[0].data as Point;
      const p3: Point = [topLeft[0], (p1[1] + p2[1]) / 2];
      const center: Point = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
      const r = Math.abs(topLeft[0] - ((p1[0] + p2[0]) / 2));
      const pa: Point = [center[0] + r * Math.cos(3 * Math.PI / 4), center[1] + r * Math.sin(3 * Math.PI / 4)];
      const pb: Point = [center[0] + r * Math.cos(5 * Math.PI / 4), center[1] + r * Math.sin(5 * Math.PI / 4)];
      const sops = _spline([p1, pa, p3, pb, p2], 1, false);
      sops.shift();
      overlay.push(...sops);
    }
  }
  return {
    shape,
    overlay
  };
}

const POINT_COUNT_MARKER = 20;

export function ellipse(center: Point, width: number, height: number, randomizer: Randomizer, doubleStroke = true, roughness = 1): RenderOps {
  const a = width / 2;
  const b = height / 2;
  if (a <= 0 || b <= 0) {
    return {
      shape: [],
      overlay: []
    };
  }
  const pointCount = (Math.max(a, b) > POINT_COUNT_MARKER) ? 10 : 6;
  const startAngle = randomizer.next() * Math.PI * 2;

  const ellipsePoints: Point[] = [];
  const overlayEllipsePoints: Point[] = [];
  const bowing = 2;
  const r = roughness / ((Math.max(a, b) > POINT_COUNT_MARKER) ? 1.25 : 2);
  for (let i = 0; i < pointCount; i++) {
    const angle = startAngle + (i / pointCount) * 2 * Math.PI;
    const x = center[0] + (a * Math.cos(angle));
    const y = center[1] + (b * Math.sin(angle));
    overlayEllipsePoints[i] = [x + randomizer.valueOffset(bowing, r), y + randomizer.valueOffset(bowing, r)];
    ellipsePoints[i] = [x + randomizer.valueOffset(bowing, r), y + randomizer.valueOffset(bowing, r)];
  }
  return {
    shape: _spline(ellipsePoints),
    overlay: doubleStroke ? _spline(overlayEllipsePoints) : []
  };
}

export function arc(center: Point, radius: number, startAngle: number, endAngle: number, randomizer: Randomizer, doubleStroke = true, roughness = 1): RenderOps {
  const pointCount = radius > POINT_COUNT_MARKER ? 10 : 6;
  const arcPoints: Point[] = [];
  const overlayPoints: Point[] = [];
  const bowing = 2;
  const r = roughness / ((radius > POINT_COUNT_MARKER) ? 1.25 : 2);
  const step = (endAngle - startAngle) / pointCount;
  for (let i = 0; i <= pointCount; i++) {
    const angle = startAngle + (i * step);
    const x = center[0] + (radius * Math.cos(angle));
    const y = center[1] + (radius * Math.sin(angle));
    overlayPoints[i] = [x + randomizer.valueOffset(bowing, r), y + randomizer.valueOffset(bowing, r)];
    arcPoints[i] = [x + randomizer.valueOffset(bowing, r), y + randomizer.valueOffset(bowing, r)];
  }
  return {
    shape: _spline(arcPoints, 1, false),
    overlay: doubleStroke ? _spline(overlayPoints, 1, false) : []
  };
}

function _formatSplinePoints(input: Point[], close: boolean) {
  const points = [...input];

  if (close) {
    const lastPoint = points[points.length - 1];
    const secondToLastPoint = points[points.length - 2];

    const firstPoint = points[0];
    const secondPoint = points[1];

    points.unshift(lastPoint);
    points.unshift(secondToLastPoint);

    points.push(firstPoint);
    points.push(secondPoint);
  }

  return points.flat();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function _spline(input: Point[] = [], tension = 1, close = true): Op[] {
  const points = _formatSplinePoints(input, close);
  const ops: Op[] = [];

  const size = points.length;
  const last = size - 4;

  const startPointX = close ? points[2] : points[0];
  const startPointY = close ? points[3] : points[1];

  ops.push({ type: 'move', data: [startPointX, startPointY] });

  const startIteration = close ? 2 : 0;
  const maxIteration = close ? size - 4 : size - 2;
  const inc = 2;

  for (let i = startIteration; i < maxIteration; i += inc) {
    const x0 = i ? points[i - 2] : points[0];
    const y0 = i ? points[i - 1] : points[1];

    const x1 = points[i + 0];
    const y1 = points[i + 1];

    const x2 = points[i + 2];
    const y2 = points[i + 3];

    const x3 = i !== last ? points[i + 4] : x2;
    const y3 = i !== last ? points[i + 5] : y2;

    const cp1x = x1 + ((x2 - x0) / 6) * tension;
    const cp1y = y1 + ((y2 - y0) / 6) * tension;

    const cp2x = x2 - ((x3 - x1) / 6) * tension;
    const cp2y = y2 - ((y3 - y1) / 6) * tension;

    ops.push({ type: 'bcurveTo', data: [cp1x, cp1y, cp2x, cp2y, x2, y2] });
  }

  return ops;
}