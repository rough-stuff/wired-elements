export function randomSeed() {
    return Math.floor(Math.random() * 2 ** 31);
}
export class Randomizer {
    constructor(seed) {
        this.seed = seed;
    }
    next() {
        if (this.seed) {
            return ((2 ** 31 - 1) & (this.seed = Math.imul(48271, this.seed))) / 2 ** 31;
        }
        else {
            return Math.random();
        }
    }
    rangeOffset(min, max, roughness) {
        return roughness * ((this.next() * (max - min)) + min);
    }
    valueOffset(x, roughness) {
        return this.rangeOffset(-x, x, roughness);
    }
    point(p, offset, roughness) {
        return [p[0] + this.valueOffset(offset, roughness), p[1] + this.valueOffset(offset, roughness)];
    }
}
