import { pointsOnBezierCurves } from 'points-on-curve';
import { _spline } from './core/graphics';
import { Point } from './core/geometry';

const tin2 = document.getElementById('tin2') as HTMLInputElement;
const din = document.getElementById('din') as HTMLInputElement;
const c2 = document.getElementById('c2') as HTMLCanvasElement;
const t2 = document.getElementById('t2') as HTMLSpanElement;
const d = document.getElementById('d') as HTMLSpanElement;

const curve: [number, number][] = [
  [-130 + 200, 90 + 150],
  [-55 + 200, -90 + 150],
  [75 + 200, -60 + 150],
  [100 + 200, 80 + 150],
];

const draw = (canvas: HTMLCanvasElement, t: number, d?: number) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'orange';
  ctx.moveTo(...curve[0]);
  ctx.bezierCurveTo(...curve[1], ...curve[2], ...curve[3]);
  ctx.stroke();

  const points = pointsOnBezierCurves(curve, t, d);
  ctx.fillStyle = 'blue';
  ctx.strokeStyle = 'blue';
  if (d) {
    // ctx.beginPath();
    // for (let i = 0; i < points.length; i++) {
    //   if (i === 0) {
    //     ctx.moveTo(...points[i]);
    //   } else {
    //     ctx.lineTo(...points[i]);
    //   }
    // }
    // ctx.stroke();
  }
  // for (const p of points) {
  //   ctx.beginPath();
  //   ctx.arc(p[0], p[1], 3, 0, Math.PI * 2);
  //   ctx.fill();
  // }

  if (points.length > 1) {
    let maxD = 0;
    let minD = Number.MAX_VALUE;
    for (let i = 0; i < points.length; i++) {
      const p1 = (i === 0) ? points[i] : points[i - 1];
      const p2 = (i === 0) ? points[i + 1] : points[i];
      const d = Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
      if (d > maxD) {
        maxD = d;
      }
      if (d < minD) {
        minD = d;
      }
    }

    const outer: Point[] = [];
    const inner: Point[] = [];

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const p1 = (i === 0) ? points[i] : points[i - 1];
      const p2 = (i === 0) ? points[i + 1] : points[i];
      const dist = Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
      let d = 10;
      if (maxD !== minD) {
        const lerpSlope = 15 / (maxD - minD);
        const c = 20 - (lerpSlope * maxD);
        d = lerpSlope * dist + c;
      }

      let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
      let slope = 0;
      if ((p2[0] - p1[0]) === 0) {
        x1 = x2 = p[0];
        y1 = p[1] + d;
        y2 = p[1] - d;
        slope = 0;
      } else if ((p2[1] - p1[1]) === 0) {
        y1 = y2 = p[1];
        x1 = p[0] + d;
        x2 = p[0] - d;
        slope = 0;
      } else {
        slope = (p2[1] - p1[1]) / (p2[0] - p1[0]);
        const m = -1 / slope;
        x1 = p[0] + (d / Math.sqrt(1 + m * m));
        x2 = p[0] - (d / Math.sqrt(1 + m * m));
        y1 = p[1] + (m * (x1 - p[0]));
        y2 = p[1] + (m * (x2 - p[0]));
      }

      outer.push(slope < 0 ? [x2, y2] : [x1, y1]);
      inner.push(slope < 0 ? [x1, y1] : [x2, y2]);
    }

    outer.forEach((p) => {
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(p[0], p[1], 3, 0, Math.PI * 2);
      ctx.fill();
    });
    inner.forEach((p) => {
      ctx.fillStyle = 'orange';
      ctx.beginPath();
      ctx.arc(p[0], p[1], 3, 0, Math.PI * 2);
      ctx.fill();
    });

    const ops = _spline(outer.concat(inner.reverse()), 1, true);
    ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
    ctx.beginPath();
    for (const item of ops) {
      const { op, data } = item;
      if (op === 'move') {
        ctx.moveTo(data[0], data[1]);
      } else if (op === 'bcurveTo') {
        ctx.bezierCurveTo(data[0], data[1], data[2], data[3], data[4], data[5]);
      }
    }
    ctx.fill();
  }

};

const render2 = () => {
  const tol = +tin2.value;
  const dist = +din.value;
  t2.textContent = tol + '';
  d.textContent = dist + '';
  draw(c2, tol, dist);
};

tin2.addEventListener('input', render2);
din.addEventListener('input', render2);

render2();