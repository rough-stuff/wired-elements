export function rotatePoints(points, center, angle) {
    if (points && points.length) {
        if (!angle) {
            return points;
        }
        const [cx, cy] = center;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return points.map((p) => {
            const [x, y] = p;
            return [((x - cx) * cos) - ((y - cy) * sin) + cx, ((x - cx) * sin) + ((y - cy) * cos) + cy];
        });
    }
    return [];
}
export function lineLength(line) {
    const p1 = line[0];
    const p2 = line[1];
    return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}
export function centerPoint(p1, p2) {
    return [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
}
