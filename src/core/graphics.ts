import { Point, lineLength, rotatePoints, centerPoint } from './geometry';
import { Randomizer } from './random';

export declare type OpType = 'move' | 'bcurveTo' | 'qcurveTo' | 'lineTo' | 'ellipse';

export interface Op {
  op: OpType;
  data: number[];
}

export interface RenderOps {
  shape: Op[];
  overlay: Op[];
}

export function line(p1: Point, p2: Point, randomizer: Randomizer, doubleStroke = true, roughness = 1): RenderOps {
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
  const ops: Op[] = [{ op: 'move', data: randomizer.point(p1, 2, roughness) }];
  for (let i = 0; i < controlPointCount; i++) {
    const endPoint = randomizer.point(p2, 2, roughness);
    ops.push({
      op: 'bcurveTo',
      data: [
        ...controls[i * 2],
        ...controls[i * 2 + 1],
        ...endPoint,
      ]
    });
  }
  if (doubleStroke) {
    overlayOps.push({ op: 'move', data: randomizer.point(p1, 2, roughness) });
    for (let i = 0; i < controlPointCount; i++) {
      const endPoint = randomizer.point(p2, 2, roughness);
      overlayOps.push({
        op: 'bcurveTo',
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

export function linearPath(points: Point[], close: boolean, randomizer: Randomizer, doubleStroke = true, roughness = 1): RenderOps {
  const len = (points || []).length;
  if (len > 2) {
    const ops: Op[] = [];
    const overlayOps: Op[] = [];
    for (let i = 0; i < (len - 1); i++) {
      const { shape, overlay } = line(points[i], points[i + 1], randomizer, doubleStroke, roughness);
      ops.push(...shape);
      overlayOps.push(...overlay);
    }
    if (close) {
      const { shape, overlay } = line(points[len - 1], points[0], randomizer, doubleStroke, roughness);
      ops.push(...shape);
      overlayOps.push(...overlay);
    }
    return {
      shape: ops,
      overlay: overlayOps
    };
  } else if (len === 2) {
    return line(points[0], points[1], randomizer, doubleStroke, roughness);
  }
  return {
    shape: [],
    overlay: []
  };
}

export function polygon(points: Point[], randomizer: Randomizer, doubleStroke = true, roughness = 1): RenderOps {
  return linearPath(points, true, randomizer, doubleStroke, roughness);
}

export function rectangle(topLeft: Point, width: number, height: number, randomizer: Randomizer, doubleStroke = true, roughness = 1): RenderOps {
  const points: Point[] = [
    topLeft,
    [topLeft[0] + width, topLeft[1]],
    [topLeft[0] + width, topLeft[1] + height],
    [topLeft[0], topLeft[1] + height]
  ];
  return polygon(points, randomizer, doubleStroke, roughness);
}