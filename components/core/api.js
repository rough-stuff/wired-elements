export const DefaultDrawingOptions = {
    roughness: 2,
    controlIncrementLength: 400,
    controlPointMultiplier: 1,
    strokeWidth: 2,
    strokeColor: '#000000',
    fillWidth: 2,
    fillAngle: -45,
    fillGap: -1,
    fillColor: '#000000',
    fillType: 'none',
    seed: 0,
    doubleStroke: true
};
export function resolveOptions(options) {
    const o = Object.assign(Object.assign({}, DefaultDrawingOptions), options);
    let gap = o.fillGap;
    if (gap < 0) {
        gap = o.strokeWidth * 4;
    }
    gap = Math.max(gap, 0.1);
    o.fillGap = gap;
    return o;
}
