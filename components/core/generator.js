"use strict";
// import { Point } from './geometry';
// import { Randomizer } from './random';
// import { _line, _rectangle, _spline, RenderOps, Op } from './graphics.js';
// import { pointsOnBezierCurves } from 'points-on-curve';
// export type RenderStyle = 'classic' | 'marker';
// export function line(p1: Point, p2: Point, randomizer: Randomizer, roughness = 1, style: RenderStyle = 'classic'): RenderOps {
//   const ops = _line(p1, p2, randomizer, style === 'classic', roughness);
//   if (style === 'marker') {
//     // TODO:
//   }
//   return ops;
// }
// export function rectangle(topLeft: Point, width: number, height: number, randomizer: Randomizer, roughness = 1, style: RenderStyle = 'marker'): RenderOps {
//   const ops = _rectangle(topLeft, width, height, randomizer, style === 'classic', roughness);
//   if (style === 'marker') {
//     ops.shape = _createNormalPoints(ops.shape);
//   }
//   console.log(ops);
//   return ops;
// }
// function _createNormalPoints(ops: Op[]) {
//   const curvePoints: Point[] = [];
//   let moved = false;
//   ops.forEach((d) => {
//     const { op, data } = d;
//     switch (op) {
//       case 'move':
//         if (!moved) {
//           moved = true;
//           curvePoints.push([data[0], data[1]]);
//         }
//         break;
//       case 'bcurveTo':
//         curvePoints.push([data[0], data[1]]);
//         curvePoints.push([data[2], data[3]]);
//         curvePoints.push([data[4], data[5]]);
//         break;
//     }
//   });
//   const points = pointsOnBezierCurves(curvePoints);
//   const upper: Point[] = [];
//   const lower: Point[] = [];
//   if (points.length >= 2) {
//     for (let i = 0; i < points.length; i++) {
//       if (i === 0) {
//         const slope = Math.atan2(points[i + 1][1] - points[i][1], points[i + 1][0] - points[i][0]);
//         const a1 = slope - (Math.PI / 2);
//         const a2 = (Math.PI / 2) - slope;
//         upper.push([points[i][0] + (Math.cos(a1) * (Math.random() * 2)), points[i][1] + (Math.sin(a1) * (Math.random() * 2))]);
//         lower.push([points[i][0] + (Math.cos(a2) * (Math.random() * 2)), points[i][1] + (Math.sin(a2) * (Math.random() * 2))]);
//       } else {
//         const slope = Math.atan2(points[i][1] - points[i - 1][1], points[i][0] - points[i - 1][0]);
//         const a1 = slope - (Math.PI / 2);
//         const a2 = (Math.PI / 2) - slope;
//         upper.push([points[i][0] + (Math.cos(a1) * (Math.random() * 2)), points[i][1] + (Math.sin(a1) * (Math.random() * 2))]);
//         lower.push([points[i][0] + (Math.cos(a2) * (Math.random() * 2)), points[i][1] + (Math.sin(a2) * (Math.random() * 2))]);
//       }
//     }
//   }
//   return _spline(upper.concat(lower.reverse()));
// }
