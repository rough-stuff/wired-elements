import { lineLength } from './geometry.js';
import { _rectangle, _line, _spline, _linearPath, _ellipse, _ellipsePoints, _roundedRectangle } from './graphics.js';
import { pointsOnBezierCurves } from 'points-on-curve';
const TOLERANCE = 0.125;
const TOLERANCE_DISTANCE = 0.125;
const MAX_STROKE_WIDTH = 1.5;
const MIN_STROKE_WIDTH = 0.8;
export function linearPath(points, close, randomizer, style, roughness = 1) {
    const ops = _linearPath(points, close, randomizer, style === 'classic', roughness);
    if (style !== 'classic') {
        ops.textured = _renderOutilneCurve(ops.shape);
    }
    return ops;
}
export function rectangle(topLeft, width, height, randomizer, style, roughness = 1) {
    const ops = _rectangle(topLeft, width, height, randomizer, style === 'classic', roughness);
    if (style !== 'classic') {
        ops.textured = _renderOutilneCurve(ops.shape);
    }
    return ops;
}
export function line(p1, p2, randomizer, style, roughness = 1) {
    const ops = _line(p1, p2, randomizer, style === 'classic', roughness);
    if (style !== 'classic') {
        ops.textured = _renderOutilneCurve(ops.shape);
    }
    return ops;
}
export function roundedRectangle(topLeft, width, height, radius, randomizer, style, roughness = 1) {
    const ops = _roundedRectangle(topLeft, width, height, radius, randomizer, style === 'classic', roughness, style !== 'classic');
    if (style !== 'classic') {
        ops.textured = _renderOutilneCurve(ops.shape);
        for (const ac of (ops.adjacentCurveList || [])) {
            const { outer, inner } = _curveOutline(ac, false);
            ops.textured.push(_spline(outer.concat(inner.reverse()), 1, true));
        }
    }
    return ops;
}
export function ellipse(center, width, height, randomizer, style, roughness = 1) {
    if (style === 'classic') {
        return _ellipse(center, width, height, randomizer, true, roughness);
    }
    else {
        const { ellipsePoints } = _ellipsePoints(center, width, height, randomizer, false, roughness);
        ellipsePoints.push([...ellipsePoints[0]]);
        const { outer, inner } = _curveOutline(ellipsePoints, false);
        return {
            textured: [_spline(outer.concat(inner.reverse()), 1, false)],
            shape: [],
            overlay: []
        };
    }
}
function _renderOutilneCurve(ops) {
    const curves = _extractCurves(ops);
    const out = [];
    for (const curve of curves) {
        const { outer, inner } = _curveOutline(curve, true);
        out.push(_spline(outer.concat(inner.reverse()), 1, true));
    }
    return out;
}
function _extractCurves(ops) {
    const curves = [];
    let current = [];
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
export function _curveOutline(curve, bezier) {
    const outer = [];
    const inner = [];
    const points = bezier ? pointsOnBezierCurves(curve, TOLERANCE, TOLERANCE_DISTANCE) : curve;
    if (points.length > 1) {
        let maxD = 0;
        let minD = Number.MAX_VALUE;
        for (let i = 0; i < points.length; i++) {
            const p1 = (i === 0) ? points[i] : points[i - 1];
            const p2 = (i === 0) ? points[i + 1] : points[i];
            const d = lineLength([p1, p2]);
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
            const dist = lineLength([p1, p2]);
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
            }
            else if (Math.round(p2[1] - p1[1]) === 0) {
                x1 = x2 = p[0];
                y1 = p[1] - strokeOffset;
                y2 = p[1] + strokeOffset;
            }
            else {
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
