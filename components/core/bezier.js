/* eslint-disable @typescript-eslint/no-loss-of-precision */
// Adapted from https://github.com/Pomax/bezierjs (MIT License)
const TVALUES = [
    -0.0640568928626056260850430826247450385909,
    0.0640568928626056260850430826247450385909,
    -0.1911188674736163091586398207570696318404,
    0.1911188674736163091586398207570696318404,
    -0.3150426796961633743867932913198102407864,
    0.3150426796961633743867932913198102407864,
    -0.4337935076260451384870842319133497124524,
    0.4337935076260451384870842319133497124524,
    -0.5454214713888395356583756172183723700107,
    0.5454214713888395356583756172183723700107,
    -0.6480936519369755692524957869107476266696,
    0.6480936519369755692524957869107476266696,
    -0.7401241915785543642438281030999784255232,
    0.7401241915785543642438281030999784255232,
    -0.8200019859739029219539498726697452080761,
    0.8200019859739029219539498726697452080761,
    -0.8864155270044010342131543419821967550873,
    0.8864155270044010342131543419821967550873,
    -0.9382745520027327585236490017087214496548,
    0.9382745520027327585236490017087214496548,
    -0.9747285559713094981983919930081690617411,
    0.9747285559713094981983919930081690617411,
    -0.9951872199970213601799974097007368118745,
    0.9951872199970213601799974097007368118745
];
const CVALUES = [
    0.1279381953467521569740561652246953718517,
    0.1279381953467521569740561652246953718517,
    0.1258374563468282961213753825111836887264,
    0.1258374563468282961213753825111836887264,
    0.121670472927803391204463153476262425607,
    0.121670472927803391204463153476262425607,
    0.1155056680537256013533444839067835598622,
    0.1155056680537256013533444839067835598622,
    0.1074442701159656347825773424466062227946,
    0.1074442701159656347825773424466062227946,
    0.0976186521041138882698806644642471544279,
    0.0976186521041138882698806644642471544279,
    0.086190161531953275917185202983742667185,
    0.086190161531953275917185202983742667185,
    0.0733464814110803057340336152531165181193,
    0.0733464814110803057340336152531165181193,
    0.0592985849154367807463677585001085845412,
    0.0592985849154367807463677585001085845412,
    0.0442774388174198061686027482113382288593,
    0.0442774388174198061686027482113382288593,
    0.0285313886289336631813078159518782864491,
    0.0285313886289336631813078159518782864491,
    0.0123412297999871995468056670700372915759,
    0.0123412297999871995468056670700372915759
];
function arcfn(t, derivativeFn) {
    const d = derivativeFn(t);
    const l = d[0] * d[0] + d[1] * d[1];
    return Math.sqrt(l);
}
function length(derivativeFn) {
    const z = 0.5;
    let sum = 0;
    const len = TVALUES.length;
    for (let i = 0; i < len; i++) {
        const t = z * TVALUES[i] + z;
        sum += CVALUES[i] * arcfn(t, derivativeFn);
    }
    return z * sum;
}
function derive(points) {
    const dpoints = [];
    for (let p = points, d = p.length, c = d - 1; d > 1; d--, c--) {
        const list = [];
        let dpt = [0, 0];
        for (let j = 0; j < c; j++) {
            dpt = [
                c * (p[j + 1][0] - p[j][0]),
                c * (p[j + 1][1] - p[j][1])
            ];
            list.push(dpt);
        }
        dpoints.push(list);
        p = list;
    }
    return dpoints;
}
function computeBezierPoint(t, points) {
    if (t === 0) {
        return points[0];
    }
    const order = points.length - 1;
    if (t === 1) {
        return points[order];
    }
    let p = points;
    const mt = 1 - t;
    // constant?
    if (order === 0) {
        return points[0];
    }
    // linear?
    if (order === 1) {
        const ret = [
            mt * p[0][0] + t * p[1][0],
            mt * p[0][1] + t * p[1][1]
        ];
        return ret;
    }
    // quadratic/cubic curve?
    if (order < 4) {
        const mt2 = mt * mt;
        const t2 = t * t;
        let d = 0;
        let a = 0;
        let b = 0;
        let c = 0;
        if (order === 2) {
            p = [p[0], p[1], p[2], [0, 0]];
            a = mt2;
            b = mt * t * 2;
            c = t2;
        }
        else if (order === 3) {
            a = mt2 * mt;
            b = mt2 * t * 3;
            c = mt * t2 * 3;
            d = t * t2;
        }
        const ret = [
            a * p[0][0] + b * p[1][0] + c * p[2][0] + d * p[3][0],
            a * p[0][1] + b * p[1][1] + c * p[2][1] + d * p[3][1]
        ];
        return ret;
    }
    // higher order curves: use de Casteljau's computation
    const dCpts = JSON.parse(JSON.stringify(points));
    while (dCpts.length > 1) {
        for (let i = 0; i < dCpts.length - 1; i++) {
            dCpts[i] = [
                dCpts[i][0] + (dCpts[i + 1][0] - dCpts[i][0]) * t,
                dCpts[i][1] + (dCpts[i + 1][1] - dCpts[i][1]) * t
            ];
        }
        dCpts.splice(dCpts.length - 1, 1);
    }
    return dCpts[0];
}
export class Bezier {
    constructor(p1, p2, p3, p4) {
        this.points = [];
        this.dpoints = [];
        this._lut = [];
        this.order = 3;
        this.points.push(p1, p2, p3);
        if (p4) {
            this.points.push(p4);
        }
        this.order = this.points.length - 1;
        this.update();
    }
    update() {
        this._lut = [];
        this.dpoints = derive(this.points);
    }
    length() {
        return length(this.derivative.bind(this));
    }
    derivative(t) {
        const mt = 1 - t;
        let a = 0;
        let b = 0;
        let c = 0;
        let p = this.dpoints[0];
        if (this.order === 2) {
            p = [p[0], p[1], [0, 0]];
            a = mt;
            b = t;
        }
        else if (this.order === 3) {
            a = mt * mt;
            b = mt * t * 2;
            c = t * t;
        }
        const ret = [
            a * p[0][0] + b * p[1][0] + c * p[2][0],
            a * p[0][1] + b * p[1][1] + c * p[2][1]
        ];
        return ret;
    }
    getLUT(steps = 100) {
        if (!steps)
            return [];
        if (this._lut.length === steps) {
            return this._lut;
        }
        this._lut = [];
        steps--;
        for (let t = 0; t <= steps; t++) {
            this._lut.push(this.compute(t / steps));
        }
        return this._lut;
    }
    compute(t) {
        return computeBezierPoint(t, this.points);
    }
}
