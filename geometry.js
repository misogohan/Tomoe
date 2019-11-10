'use strict';

function heronS(a, b, c) {
    const s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
}

function translate([x, y], [dx, dy]) {
    return [x + dx, y + dy];
}

function rotate([x, y], rad) {
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return [x * cos - y * sin, y * cos + x * sin];
}

function scale([x, y], t) {
    return [x * t, y * t]
}

class pos {
    static distance(p1, p2) {
        return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
    }

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
    }

    translate(dx, dy) {
        this.x += dx;
        this.y += dy;
        return this;
    }

    rotate(rad, basis = {x: 0, y: 0}) {
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        this.translate(-basis.x, -basis.y);
        [this.x, this.y] = [this.x * cos - this.y * sin, this.y * cos + this.x * sin];
        this.translate(basis.x, basis.y);
        return this;
    }

    getRadiusWith(p) {
        const d = pos.distance(this, p);
        return this.x >= p.x ?
            Math.asin((this.y - p.y) / d) :
            Math.acos((this.y - p.y) / d) * (this.y >= p.y ? 1 : -1);
    }
}

class Triangle {
    constructor(p1, p2, p3) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }

    serface() {
        return heronS(pos.distance(this.p1, this.p2), pos.distance(this.p2, this.p3), pos.distance(this.p3, this.p1));
    }
}

class Vector {
    #target;

    constructor(target, source = new pos(0, 0)) {
        this.source = source;
        this.target = target;
    }

    set target(p) {
        this.#target = p;
        this.dx = p.x - this.source.x;
        this.dy = p.y - this.source.y;
    }

    get target() {
        this.#target.reset(this.dx + this.source.x, this.dy + this.source.y);
        return this.#target;
    }

    set magnitude(numeric) {
        this.scale(numeric / this.magnitude)
    }

    get magnitude() {
        return pos.distance(this.target, this.source);
    }

    scale(per) {
        this.dx *= per;
        this.dy *= per;
    }

    getRadius() {
        return this.target.getRadiusWith(this.source);
    }

    reset(source = new pos(0, 0)) {
        this.source = source;
        return this;
    }

    resize(numeric) {
        this.magnitude = numeric;
        return this;
    }

    add(v) {
        this.dx += v.dx;
        this.dy += v.dy;
        return this;
    }

    plus(v) {
        return Object.create(this).reset().add(v);
    }

    sub(v) {
        this.dx -= v.dx;
        this.dy -= v.dy;
        return this;
    }

    minus(v) {
        return Object.create(this).reset().sub(v);
    }

    reverse() {
        this.dx *= -1;
        this.dy *= -1;
        return this;
    }
}

class Circle {
    static getIntersections(circleA, circleB) {
        const A = circleA.center;
        const B = circleB.center;
        const A_B = pos.distance(A, B);
        const p1_O = heronS(circleA.r, circleB.r, A_B) * 2 / A_B;
        const A_O = Math.sqrt(circleA.r ** 2 - p1_O ** 2);
        const A_Orad = Math.atan((B.y - A.y) / (B.x - A.x));
        const p1 = new pos(A_O, p1_O).rotate(A_Orad).translate(A.x, A.y);
        const p2 = new pos(A_O, -p1_O).rotate(A_Orad).translate(A.x, A.y);
        return [p1, p2];
    }

    constructor(center, r) {
        this.center = center;
        this.r = r;
    }

    get cx() {
        return this.center.x;
    }

    set cx(x) {
        this.center.x = x;
    }

    get cy() {
        return this.center.y;
    }

    set cy(y) {
        this.center.y = y;
    }

    getPointAt(rad) {
        return new pos(this.r, 0).rotate(rad).translate(this.center.x, this.center.y);
    }

    getRadiusAt(p) {
        return p.getRadiusWith(this.center);
    }

    includes(p) {
        return pos.distance(p, this.center) === this.r;
    }
}

export default {heronS, translate, rotate, pos, Triangle, Circle, Vector, scale};