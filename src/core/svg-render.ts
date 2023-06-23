import { Op } from './api';

const SVGNS = 'http://www.w3.org/2000/svg';

function _opsToPath(ops: Op[]): string {
  let path = '';
  for (const item of ops) {
    const data = item.data;
    switch (item.op) {
      case 'move':
        path += `M${data[0]} ${data[1]} `;
        break;
      case 'bcurveTo':
        path += `C${data[0]} ${data[1]}, ${data[2]} ${data[3]}, ${data[4]} ${data[5]} `;
        break;
      case 'qcurveTo':
        path += `Q${data[0]} ${data[1]}, ${data[2]} ${data[3]} `;
        break;
      case 'lineTo':
        path += `L${data[0]} ${data[1]} `;
        break;
    }
  }
  return path.trim();
}

export function renderSvgPath(parent: SVGElement, ops: Op[]) {
  const doc = parent.ownerDocument || window.document;
  const path = doc.createElementNS(SVGNS, 'path');
  path.setAttribute('d', _opsToPath(ops));
  parent.appendChild(path);
  return path;
}