const SVGNS = 'http://www.w3.org/2000/svg';
function _opsToPath(ops) {
    let path = '';
    for (const item of ops) {
        const data = item.data;
        switch (item.type) {
            case 'move':
                path += `M${data[0]} ${data[1]} `;
                break;
            case 'bcurveTo':
                path += `C${data[0]} ${data[1]}, ${data[2]} ${data[3]}, ${data[4]} ${data[5]} `;
                break;
            case 'lineTo':
                path += `L${data[0]} ${data[1]} `;
                break;
        }
    }
    return path.trim();
}
export function createGroup(parent, id) {
    const doc = parent.ownerDocument || window.document;
    const g = doc.createElementNS(SVGNS, 'g');
    if (id) {
        g.setAttribute('id', id);
    }
    parent.appendChild(g);
    return g;
}
export function renderSvgPath(parent, ops) {
    const { shape, overlay } = ops;
    const doc = parent.ownerDocument || window.document;
    const g = doc.createElementNS(SVGNS, 'g');
    if (shape.length) {
        const path = doc.createElementNS(SVGNS, 'path');
        path.setAttribute('d', _opsToPath(shape));
        g.appendChild(path);
    }
    if (overlay.length) {
        const path = doc.createElementNS(SVGNS, 'path');
        path.setAttribute('d', _opsToPath(overlay));
        g.appendChild(path);
    }
    parent.appendChild(g);
    g.setAttribute('filter', 'url(#wiredTexture)');
    return g;
}
export function fillSvgPath(parent, shape, asStroke = false) {
    const doc = parent.ownerDocument || window.document;
    const g = doc.createElementNS(SVGNS, 'g');
    if (shape.length) {
        const path = doc.createElementNS(SVGNS, 'path');
        path.setAttribute('d', _opsToPath(shape));
        g.appendChild(path);
    }
    if (asStroke) {
        g.setAttribute('filter', 'url(#wiredTexture)');
        g.setAttribute('class', 'wired-fill-shape-as-stroke');
    }
    else {
        g.setAttribute('class', 'wired-fill-shape');
    }
    parent.appendChild(g);
    return g;
}