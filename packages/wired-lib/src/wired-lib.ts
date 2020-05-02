import { hachureLinesForPolygon, hachureLinesForEllipse } from 'roughjs/bin/fillers/filler-utils';
import { Line } from 'roughjs/bin/geometry';
import { ResolvedOptions, Options } from 'roughjs/bin/core';
import { RoughSVG } from 'roughjs/bin/svg';

const __maxRandomnessOffset = 2;
const __roughness = 1;
const __bowing = 0.85;
const __curveTightness = 0;
const __curveStepCount = 9;

declare type Params = { [name: string]: string };
export declare type Point = [number, number];
export { Options };

class WiresPath {
  private p = '';

  get value() {
    return this.p.trim();
  }

  moveTo(x: number, y: number): void {
    this.p = `${this.p}M ${x} ${y} `;
  }

  bcurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {
    this.p = `${this.p}C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y} `;
  }
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

function _getOffset(min: number, max: number): number {
  return __roughness * ((Math.random() * (max - min)) + min);
}

function _line(x1: number, y1: number, x2: number, y2: number, existingPath?: WiresPath): WiresPath {
  const lengthSq = Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2);
  let offset = __maxRandomnessOffset || 0;
  if ((offset * offset * 100) > lengthSq) {
    offset = Math.sqrt(lengthSq) / 10;
  }
  const halfOffset = offset / 2;
  const divergePoint = 0.2 + Math.random() * 0.2;
  let midDispX = __bowing * __maxRandomnessOffset * (y2 - y1) / 200;
  let midDispY = __bowing * __maxRandomnessOffset * (x1 - x2) / 200;
  midDispX = _getOffset(-midDispX, midDispX);
  midDispY = _getOffset(-midDispY, midDispY);

  const path = existingPath || new WiresPath();
  path.moveTo(x1 + _getOffset(-offset, offset), y1 + _getOffset(-offset, offset));
  path.bcurveTo(midDispX + x1 + (x2 - x1) * divergePoint + _getOffset(-offset, offset),
    midDispY + y1 + (y2 - y1) * divergePoint + _getOffset(-offset, offset),
    midDispX + x1 + 2 * (x2 - x1) * divergePoint + _getOffset(-offset, offset),
    midDispY + y1 + 2 * (y2 - y1) * divergePoint + _getOffset(-offset, offset),
    x2 + _getOffset(-offset, offset),
    y2 + _getOffset(-offset, offset)
  );
  path.moveTo(x1 + _getOffset(-halfOffset, halfOffset), y1 + _getOffset(-halfOffset, halfOffset));
  path.bcurveTo(midDispX + x1 + (x2 - x1) * divergePoint + _getOffset(-halfOffset, halfOffset),
    midDispY + y1 + (y2 - y1) * divergePoint + _getOffset(-halfOffset, halfOffset),
    midDispX + x1 + 2 * (x2 - x1) * divergePoint + _getOffset(-halfOffset, halfOffset),
    midDispY + y1 + 2 * (y2 - y1) * divergePoint + _getOffset(-halfOffset, halfOffset),
    x2 + _getOffset(-halfOffset, halfOffset),
    y2 + _getOffset(-halfOffset, halfOffset)
  );
  return path;
}

function _continuousLine(x1: number, y1: number, x2: number, y2: number, move: boolean = false, overwrite: boolean = false, path?: WiresPath): WiresPath {
  path = path || new WiresPath();
  const lengthSq = Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2);
  let offset = __maxRandomnessOffset || 0;
  if ((offset * offset * 100) > lengthSq) {
    offset = Math.sqrt(lengthSq) / 10;
  }
  const halfOffset = offset / 2;
  const divergePoint = 0.2 + Math.random() * 0.2;
  let midDispX = __bowing * __maxRandomnessOffset * (y2 - y1) / 200;
  let midDispY = __bowing * __maxRandomnessOffset * (x1 - x2) / 200;
  midDispX = _getOffset(-midDispX, midDispX);
  midDispY = _getOffset(-midDispY, midDispY);
  if (move) {
    path.moveTo(x1 + _getOffset(-offset, offset), y1 + _getOffset(-offset, offset));
  }
  if (!overwrite) {
    path.bcurveTo(midDispX + x1 + (x2 - x1) * divergePoint + _getOffset(-offset, offset),
      midDispY + y1 + (y2 - y1) * divergePoint + _getOffset(-offset, offset),
      midDispX + x1 + 2 * (x2 - x1) * divergePoint + _getOffset(-offset, offset),
      midDispY + y1 + 2 * (y2 - y1) * divergePoint + _getOffset(-offset, offset),
      x2 + _getOffset(-offset, offset),
      y2 + _getOffset(-offset, offset)
    );
  } else {
    path.bcurveTo(midDispX + x1 + (x2 - x1) * divergePoint + _getOffset(-halfOffset, halfOffset),
      midDispY + y1 + (y2 - y1) * divergePoint + _getOffset(-halfOffset, halfOffset),
      midDispX + x1 + 2 * (x2 - x1) * divergePoint + _getOffset(-halfOffset, halfOffset),
      midDispY + y1 + 2 * (y2 - y1) * divergePoint + _getOffset(-halfOffset, halfOffset),
      x2 + _getOffset(-halfOffset, halfOffset),
      y2 + _getOffset(-halfOffset, halfOffset)
    );
  }
  return path;
}

function _curve(vertArray: Point[], existingPath?: WiresPath): WiresPath {
  const vertArrayLength = vertArray.length;
  let path = existingPath || new WiresPath();
  if (vertArrayLength > 3) {
    const b = [];
    const s = 1 - __curveTightness;
    path.moveTo(vertArray[1][0], vertArray[1][1]);
    for (let i = 1; (i + 2) < vertArrayLength; i++) {
      const cachedVertArray = vertArray[i];
      b[0] = [cachedVertArray[0], cachedVertArray[1]];
      b[1] = [cachedVertArray[0] + (s * vertArray[i + 1][0] - s * vertArray[i - 1][0]) / 6, cachedVertArray[1] + (s * vertArray[i + 1][1] - s * vertArray[i - 1][1]) / 6];
      b[2] = [vertArray[i + 1][0] + (s * vertArray[i][0] - s * vertArray[i + 2][0]) / 6, vertArray[i + 1][1] + (s * vertArray[i][1] - s * vertArray[i + 2][1]) / 6];
      b[3] = [vertArray[i + 1][0], vertArray[i + 1][1]];
      path.bcurveTo(b[1][0], b[1][1], b[2][0], b[2][1], b[3][0], b[3][1]);
    }
  } else if (vertArrayLength === 3) {
    path.moveTo(vertArray[0][0], vertArray[0][1]);
    path.bcurveTo(vertArray[1][0], vertArray[1][1],
      vertArray[2][0], vertArray[2][1],
      vertArray[2][0], vertArray[2][1]);
  } else if (vertArrayLength === 2) {
    path = _line(vertArray[0][0], vertArray[0][1], vertArray[1][0], vertArray[1][1], path);
  }
  return path;
}

function _ellipse(ellipseInc: number, cx: number, cy: number, rx: number, ry: number, offset: number, overlap: number, existingPath?: WiresPath): WiresPath {
  const radOffset = _getOffset(-0.5, 0.5) - Math.PI / 2;
  const points: Point[] = [];
  points.push([
    _getOffset(-offset, offset) + cx + 0.9 * rx * Math.cos(radOffset - ellipseInc),
    _getOffset(-offset, offset) + cy + 0.9 * ry * Math.sin(radOffset - ellipseInc)
  ]);
  for (let angle = radOffset; angle < (Math.PI * 2 + radOffset - 0.01); angle = angle + ellipseInc) {
    points.push([
      _getOffset(-offset, offset) + cx + rx * Math.cos(angle),
      _getOffset(-offset, offset) + cy + ry * Math.sin(angle)
    ]);
  }
  points.push([
    _getOffset(-offset, offset) + cx + rx * Math.cos(radOffset + Math.PI * 2 + overlap * 0.5),
    _getOffset(-offset, offset) + cy + ry * Math.sin(radOffset + Math.PI * 2 + overlap * 0.5)
  ]);
  points.push([
    _getOffset(-offset, offset) + cx + 0.98 * rx * Math.cos(radOffset + overlap),
    _getOffset(-offset, offset) + cy + 0.98 * ry * Math.sin(radOffset + overlap)
  ]);
  points.push([
    _getOffset(-offset, offset) + cx + 0.9 * rx * Math.cos(radOffset + overlap * 0.5),
    _getOffset(-offset, offset) + cy + 0.9 * ry * Math.sin(radOffset + overlap * 0.5)
  ]);
  return _curve(points, existingPath);
}

export function line(parent: SVGElement, x1: number, y1: number, x2: number, y2: number): SVGElement {
  const path = _line(x1, y1, x2, y2);
  const node = svgNode('path', { d: path.value });
  parent.appendChild(node);
  return node;
}

export function rectangle(parent: SVGElement, x: number, y: number, width: number, height: number): SVGElement {
  x = x + 2;
  y = y + 2;
  width = width - 4;
  height = height - 4;
  let path = _line(x, y, x + width, y);
  path = _line(x + width, y, x + width, y + height, path);
  path = _line(x + width, y + height, x, y + height, path);
  path = _line(x, y + height, x, y, path);
  const node = svgNode('path', { d: path.value });
  parent.appendChild(node);
  return node;
}

export function polygon(parent: SVGElement, vertices: Point[]): SVGElement {
  let path: WiresPath | undefined;
  const vCount = vertices.length;
  if (vCount > 2) {
    for (let i = 0; i < 2; i++) {
      let move = true;
      for (let i = 1; i < vCount; i++) {
        path = _continuousLine(vertices[i - 1][0], vertices[i - 1][1], vertices[i][0], vertices[i][1], move, i > 0, path);
        move = false;
      }
      path = _continuousLine(vertices[vCount - 1][0], vertices[vCount - 1][1], vertices[0][0], vertices[0][1], move, i > 0, path);
    }
  } else if (vCount === 2) {
    path = _line(vertices[0][0], vertices[0][1], vertices[1][0], vertices[1][1]);
  } else {
    path = new WiresPath();
  }

  const node = svgNode('path', { d: path!.value });
  parent.appendChild(node);
  return node;
}

export function ellipse(parent: SVGElement, x: number, y: number, width: number, height: number): SVGElement {
  width = Math.max(width > 10 ? width - 4 : width - 1, 1);
  height = Math.max(height > 10 ? height - 4 : height - 1, 1);
  const ellipseInc = (Math.PI * 2) / __curveStepCount;
  let rx = Math.abs(width / 2);
  let ry = Math.abs(height / 2);
  rx += _getOffset(-rx * 0.05, rx * 0.05);
  ry += _getOffset(-ry * 0.05, ry * 0.05);
  let path = _ellipse(ellipseInc, x, y, rx, ry, 1, ellipseInc * _getOffset(0.1, _getOffset(0.4, 1)));
  path = _ellipse(ellipseInc, x, y, rx, ry, 1.5, 0, path);
  const node = svgNode('path', { d: path.value });
  parent.appendChild(node);
  return node;
}

function renderHachureLines(lines: Line[]): SVGElement {
  const gNode = svgNode('g') as SVGGElement;
  let prevPoint: Point | null = null;
  lines.forEach((l) => {
    line(gNode, l[0][0], l[0][1], l[1][0], l[1][1]);
    if (prevPoint) {
      line(gNode, prevPoint[0], prevPoint[1], l[0][0], l[0][1]);
    }
    prevPoint = l[1];
  });
  return gNode;
}

const options: ResolvedOptions = {
  bowing: __bowing,
  curveStepCount: __curveStepCount,
  curveTightness: __curveTightness,
  dashGap: 0,
  dashOffset: 0,
  fill: '#000',
  fillStyle: 'hachure',
  fillWeight: 1,
  hachureAngle: -41,
  hachureGap: 5,
  maxRandomnessOffset: __maxRandomnessOffset,
  roughness: __roughness,
  simplification: 1,
  stroke: '#000',
  strokeWidth: 2,
  zigzagOffset: 0
};

export function hachureFill(points: Point[]): SVGElement {
  const lines = hachureLinesForPolygon(points, options);
  return renderHachureLines(lines);
}

export function hachureEllipseFill(cx: number, cy: number, width: number, height: number): SVGElement {
  const helper: any = {
    randOffset(x: number, _o: ResolvedOptions): number {
      return _getOffset(-x, x);
    }
  };
  const lines = hachureLinesForEllipse(helper, cx, cy, width, height, options);
  return renderHachureLines(lines);
}

export function fire(element: HTMLElement, name: string, detail?: any, bubbles: boolean = true, composed: boolean = true) {
  if (name) {
    const init: any = {
      bubbles: (typeof bubbles === 'boolean') ? bubbles : true,
      composed: (typeof composed === 'boolean') ? composed : true
    };
    if (detail) {
      init.detail = detail;
    }
    const CE = ((window as any).SlickCustomEvent || CustomEvent);
    element.dispatchEvent(new CE(name, init));
  }
}

/**
 * Given an svg element, creates a wired version of all its first level children
 * @param rootSvg the svg node to convert
 * @param options roughjs options for render
 */
export function wiredSvg(rootSvg: SVGSVGElement, options?: Options) {
  const children = Array.from(rootSvg.children);
  rootSvg.innerHTML = '';
  const rough = new RoughSVG(rootSvg);
  const fragment = document.createDocumentFragment();
  children.forEach(el => fragment.append(_convertElement(rough, el, options)));
  rootSvg.appendChild(fragment);
}

/**
 * Convert one element to its wired equivalent
 * @param rough rough instance
 * @param child element to convert
 * @param options roughjs options
 */
function _convertElement(rough: RoughSVG, child: Element, options?: Options): Element {
  switch (child.tagName) {
    case 'circle':
      return _convertCircle(rough, child, options);
    case 'ellipse':
      return _convertEllipse(rough, child, options);
    case 'line':
      return _convertLine(rough, child, options);
    case 'path':
      return _convertPath(rough, child, options);
    case 'polyline':
    case 'polygon':
      return _convertPolygon(rough, child, options);
    case 'rect':
      return _convertRect(rough, child, options);
    default:
      return child;
  }
}

function _convertPath(rough: RoughSVG, child: Element, options?: Options): Element {
  const path = child.getAttribute('d');
  if (path) {
    return rough.path(path, options);
  }
  return child;
}

function _convertPolygon(rough: RoughSVG, child: Element, options?: Options): Element {
  const pointsAttr = child.getAttribute('points');
  if (pointsAttr) {
    return rough.polygon(_parsePoints(pointsAttr), options);
  }
  return child;
}

/**
 * Parse the "points" attribute of a polyline or polygone and convert to Point[]
 * @param pointsString either "1,2 3,4 5,6" or "1 2 3 4 5 6" format
 */
function _parsePoints(pointsString: string): Point[] {
  const couples = pointsString.split(' ');
  if (pointsString.indexOf(',') >= 0) {
    return couples.map(couple => {
      const buf = couple.split(',');
      return [+buf[0], +buf[1]];
    })
  } else {
    const result: Point[] = [];
    for (let i = 0; i < couples.length; i+=2) {
      result.push([+couples[i], +couples[i+1]]);
    }
    return result;
  }
}

function _convertLine(rough: RoughSVG, child: Element, options?: Options): Element {
  const x1 = child.getAttribute('x1');
  const y1 = child.getAttribute('y1');
  const x2 = child.getAttribute('x2');
  const y2 = child.getAttribute('y2');
  if (x1 && x2 && y1 && y2) {
    return rough.line(+x1, +y1, +x2, +y2, options);
  }
  return child;
}

function _convertCircle(rough: RoughSVG, child: Element, options?: Options): Element {
  const cx = child.getAttribute('cx');
  const cy = child.getAttribute('cy');
  const r = child.getAttribute('r');
  if (cx && cy && r) {
    return rough.circle(+cx, +cy, +r*2, options);
  }
  return child;
}

function _convertRect(rough: RoughSVG, child: Element, options?: Options): Element {
  const x = child.getAttribute('x');
  const y = child.getAttribute('y');
  const height = child.getAttribute('height');
  const width = child.getAttribute('width');
  if (x && y && height && width) {
    return rough.rectangle(+x, +y, +width, +height, options);
  }
  return child;
}

function _convertEllipse(rough: RoughSVG, child: Element, options?: Options): Element {
  const cx = child.getAttribute('cx');
  const cy = child.getAttribute('cy');
  const rx = child.getAttribute('rx');
  const ry = child.getAttribute('ry');
  if (cx && cy && rx && ry) {
    return rough.ellipse(+cx, +cy, +rx*2, +ry*2, options);
  }
  return child;
}
