import { lineLength } from './geometry';
import { line } from './renderer';
import { polygonHachureLines } from './hachure';
export function HachureFillPolygon(points, randomizer, o) {
    const lines = polygonHachureLines(points, o.fillGap, o.fillAngle);
    const ops = [];
    for (const l of lines) {
        ops.push(...line(l[0], l[1], false, randomizer, o, true).shape);
    }
    return { type: 'fillSketch', ops };
}
export function CrossHatchFillPolygon(points, randomizer, o) {
    const lines = [...polygonHachureLines(points, o.fillGap, o.fillAngle), ...polygonHachureLines(points, o.fillGap, o.fillAngle + 90)];
    const ops = [];
    for (const l of lines) {
        ops.push(...line(l[0], l[1], false, randomizer, o, true).shape);
    }
    return { type: 'fillSketch', ops };
}
export function ZigzagFillPolygon(points, randomizer, o, forceApproximation = false) {
    const gap = o.fillGap;
    const lines = polygonHachureLines(points, gap, o.fillAngle);
    const zigZagAngle = (Math.PI / 180) * o.fillAngle;
    const zigzagLines = [];
    if (o.roughness || forceApproximation) {
        const dgx = gap * 0.5 * Math.cos(zigZagAngle);
        const dgy = gap * 0.5 * Math.sin(zigZagAngle);
        for (const [p1, p2] of lines) {
            if (lineLength([p1, p2])) {
                zigzagLines.push([
                    [p1[0] - dgx, p1[1] + dgy],
                    [...p2],
                ], [
                    [p1[0] + dgx, p1[1] - dgy],
                    [...p2],
                ]);
            }
        }
    }
    else {
        zigzagLines.push(...lines);
        for (let i = 1; i < lines.length; i++) {
            const p0 = lines[i - 1][1];
            const p2 = lines[i][0];
            if (lineLength([p0, p2])) {
                zigzagLines.push([
                    [...p0],
                    [...p2],
                ]);
            }
        }
    }
    const ops = [];
    for (const l of zigzagLines) {
        ops.push(...line(l[0], l[1], false, randomizer, o, true).shape);
    }
    return { type: 'fillSketch', ops };
}
export function DotFillPolygon(points, randomizer, o) {
    const radius = o.fillWidth;
    const gap = o.fillGap;
    const lines = polygonHachureLines(points, gap, 0);
    const ops = [];
    const centerRoughness = Math.max(o.roughness, 0.5);
    for (const l of lines) {
        const length = lineLength(l);
        const n = Math.floor(length / (radius + gap));
        if (n) {
            const offset = length - (n * (radius + gap));
            const x = l[0][0];
            const ymin = Math.min(l[0][1], l[1][1]) + radius;
            for (let i = 0; i < n; i++) {
                const y = ymin + offset + (i * (gap + radius));
                const cx = x + randomizer.valueOffset(gap / 2, centerRoughness);
                const cy = y + randomizer.valueOffset(gap / 2, centerRoughness);
                const rx = Math.max(1, radius * 2 + randomizer.valueOffset(2, o.roughness / 2));
                const ry = Math.max(1, radius * 2 + randomizer.valueOffset(2, o.roughness / 2));
                ops.push({ op: 'move', data: [cx, cy] }, { op: 'ellipse', data: [cx, cy, rx, ry] });
            }
        }
    }
    return { type: 'fillPath', ops, fillRule: 'nonzero' };
}
