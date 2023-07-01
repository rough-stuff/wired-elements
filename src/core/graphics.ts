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

export function mergedShape(rect: RenderOps): Op[] {
  return (rect.overlay.length ? rect.overlay : rect.shape).filter((d, i) => {
    if (i === 0) {
      return true;
    }
    if (d.op === 'move') {
      return false;
    }
    return true;
  });
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

export function roundedRectangle(topLeft: Point, width: number, height: number, radius: number, randomizer: Randomizer, doubleStroke = true, roughness = 1): RenderOps {
  const radiusOffset = radius - 8;
  const l1 = line([topLeft[0] + radiusOffset, topLeft[1]], [topLeft[0] + width - radiusOffset, topLeft[1]], randomizer, doubleStroke, roughness);
  const l2 = line([topLeft[0] + width - radiusOffset, topLeft[1] + height], [topLeft[0] + radiusOffset, topLeft[1] + height], randomizer, doubleStroke, roughness);
  const shape: Op[] = [...l1.shape];
  const overlay: Op[] = [...l1.overlay];
  {
    const p1Data = l1.shape[l1.shape.length - 1].data;
    const p1 = [p1Data[4], p1Data[5]];
    const p2 = l2.shape[0].data;
    const pMid = randomizer.point([
      (2 * (topLeft[0] + width)) - (p1[0] / 2) - (p2[0] / 2),
      (2 * (topLeft[1] + (height / 2))) - (p1[1] / 2) - (p2[1] / 2)
    ], 2, roughness);
    shape.push(
      { op: 'qcurveTo', data: [...pMid, ...p2] }
    );

    if (doubleStroke) {
      const p1Data = l1.overlay[l1.overlay.length - 1].data;
      const p1 = [p1Data[4], p1Data[5]];
      const p2 = l2.overlay[0].data;
      const pMid = randomizer.point([
        (2 * (topLeft[0] + width)) - (p1[0] / 2) - (p2[0] / 2),
        (2 * (topLeft[1] + (height / 2))) - (p1[1] / 2) - (p2[1] / 2)
      ], 2, roughness);
      overlay.push(
        { op: 'qcurveTo', data: [...pMid, ...p2] }
      );
    }
  }
  l2.shape.shift();
  l2.overlay.shift()
  shape.push(...l2.shape);
  overlay.push(...l2.overlay);
  {
    const p1Data = l2.shape[l2.shape.length - 1].data;
    const p1 = [p1Data[4], p1Data[5]];
    const p2 = l1.shape[0].data;
    const pMid = randomizer.point([
      (2 * topLeft[0]) - (p1[0] / 2) - (p2[0] / 2),
      (2 * (topLeft[1] + (height / 2))) - (p1[1] / 2) - (p2[1] / 2)
    ], 2, roughness);
    shape.push(
      { op: 'qcurveTo', data: [...pMid, ...p2] }
    );

    if (doubleStroke) {
      const p1Data = l2.overlay[l2.overlay.length - 1].data;
      const p1 = [p1Data[4], p1Data[5]];
      const p2 = l1.overlay[0].data;
      const pMid = randomizer.point([
        (2 * topLeft[0]) - (p1[0] / 2) - (p2[0] / 2),
        (2 * (topLeft[1] + (height / 2))) - (p1[1] / 2) - (p2[1] / 2)
      ], 2, roughness);
      overlay.push(
        { op: 'qcurveTo', data: [...pMid, ...p2] }
      );
    }
  }
  return {
    shape,
    overlay
  };
}

// export function arc(center: Point, radius: number, startAngle: number, endAngle: number, randomizer: Randomizer, doubleStroke = true, roughness = 1) {
//   const p1 = randomizer.point([
//     center[0] + radius * Math.cos(startAngle),
//     center[1] + radius * Math.sin(startAngle)
//   ], 2, roughness);
//   const p2 = randomizer.point([
//     center[0] + radius * Math.cos(endAngle),
//     center[1] + radius * Math.sin(endAngle)
//   ], 2, roughness);
//   const pMid = randomizer.point([
//     center[0] + radius * Math.cos((endAngle + startAngle) / 2),
//     center[1] + radius * Math.sin((endAngle + startAngle) / 2)
//   ], 2, roughness);
//   const ops: Op[] = [
//     { op: 'move', data: p1 },
//     { op: 'qcurveTo', data: [...pMid, ...p2] }
//   ];
//   const overlayOps: Op[] = [
//     { op: 'move', data: p1 },
//     {
//       op: 'qcurveTo', data: [
//         ...randomizer.point([
//           center[0] + radius * Math.cos((endAngle + startAngle) / 2),
//           center[1] + radius * Math.sin((endAngle + startAngle) / 2),
//         ], 2, roughness),
//         ...p2]
//     }
//   ];
//   return {
//     shape: ops,
//     overlay: overlayOps
//   };
// }