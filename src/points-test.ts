import { _spline } from './core/graphics';
import { _curveOutline } from './core/renderer.js';

const tin2 = document.getElementById('tin2') as HTMLInputElement;
const din = document.getElementById('din') as HTMLInputElement;
const c2 = document.getElementById('c2') as HTMLCanvasElement;
const t2 = document.getElementById('t2') as HTMLSpanElement;
const d = document.getElementById('d') as HTMLSpanElement;

// const curve: [number, number][] = [
//   [-130 + 200, 90 + 150],
//   [-55 + 200, -90 + 150],
//   [75 + 200, -60 + 150],
//   [100 + 200, 80 + 150],
// ];

const curve1: [number, number][] = [
  [0.3069891333580017, 2.6724563241004944],
  [83.74784394730814, 1.7376125156879425],
  [87.83845275719649, 1.3539216816425323],
  [148.09234565496445, 2.320235788822174]
].map((row) => [row[0] + 50, row[1] + 50]);

const curve2: [number, number][] = [
  [148.09234565496445, 2.320235788822174],
  [148.87069818377495, 9.318987399339676],
  [148.81188413500786, 47.213429194688786],
  [148.46265357732773, 135.45395618677139],
].map((row) => [row[0] + 50, row[1] + 50]);

const curve3: [number, number][] = [
  [146.67602294683456, 137.00679165124893],
  [94.4754171125125, 136.1529820408256],
  [32.9619491554331, 135.763676198785],
  [0.8397974371910095, 135.86209064722061],

].map((row) => [row[0] + 50, row[1] + 50]);

const curve4: [number, number][] = [
  [2.5739187598228455, 135.63245540857315],
  [2.90875032544136, 88.7453434705734],
  [2.63680151104927, 84.2176870679854],
  [0.25502723455429077, 2.4196391701698303]
].map((row) => [row[0] + 50, row[1] + 50]);

const curve5: [number, number][] = [
  [0.3069891333580017, 2.6724563241004944],
  [83.74784394730814, 1.7376125156879425],
  [87.83845275719649, 1.3539216816425323],
  [148.09234565496445, 2.320235788822174],
  [148.87069818377495, 9.318987399339676],
  [148.81188413500786, 47.213429194688786],
  [148.46265357732773, 135.45395618677139],
  [94.4754171125125, 136.1529820408256],
  [32.9619491554331, 135.763676198785],
  [0.8397974371910095, 135.86209064722061],
  [2.90875032544136, 88.7453434705734],
  [2.63680151104927, 84.2176870679854],
  [0.25502723455429077, 2.4196391701698303]
].map((row) => [row[0] + 250, row[1] + 50]);

const draw = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  [curve1, curve2, curve3, curve4, curve5].forEach((curve) => {
    // ctx.strokeStyle = 'orange';
    // ctx.beginPath();
    // ctx.moveTo(...curve[0]);
    // ctx.bezierCurveTo(...curve[1], ...curve[2], ...curve[3]);
    // ctx.stroke();

    const { outer, inner } = _curveOutline(curve, true);
    // outer.forEach((p) => {
    //   ctx.fillStyle = 'red';
    //   ctx.beginPath();
    //   ctx.arc(p[0], p[1], 3, 0, Math.PI * 2);
    //   ctx.fill();
    // });
    // inner.forEach((p) => {
    //   ctx.fillStyle = 'orange';
    //   ctx.beginPath();
    //   ctx.arc(p[0], p[1], 3, 0, Math.PI * 2);
    //   ctx.fill();
    // });

    const ops = _spline(outer.concat(inner.reverse()), 1, true);
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.beginPath();
    for (const item of ops) {
      const { type, data } = item;
      if (type === 'move') {
        ctx.moveTo(data[0], data[1]);
      } else if (type === 'bcurveTo') {
        ctx.bezierCurveTo(data[0], data[1], data[2], data[3], data[4], data[5]);
      }
    }
    ctx.fill();
  });


};

const render2 = () => {
  const tol = +tin2.value;
  const dist = +din.value;
  t2.textContent = tol + '';
  d.textContent = dist + '';
  draw(c2);
};

tin2.addEventListener('input', render2);
din.addEventListener('input', render2);

render2();