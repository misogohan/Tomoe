import geo from "./geometry.js";
import {sleep} from "./sleep.js";

function cosA(a, b, c) {
    return (b ** 2 + c ** 2 - a ** 2) / (b * c * 2);
}

const document = window.document;
const pathElement = document.getElementById('path');
const ani = document.getElementById('rotate');
const cA = document.getElementById('cA');
const cB = document.getElementById('cB');
const cC = document.getElementById('cC');

const transCircle = {
    getAt(percent) {
        const cx = (this.end.cx - this.begin.cx) * percent / 100 + this.begin.cx;
        const cy = (this.end.cy - this.begin.cy) * percent / 100 + this.begin.cy;
        const r = (this.end.r - this.begin.r) * percent / 100 + this.begin.r;
        return new geo.Circle(new geo.pos(cx, cy), r);
    }
};

const circle1 = Object.create(transCircle, {
    begin: {
        value: new geo.Circle(new geo.pos(20.710678118654755, -20.710678118654755), 20.710678118654755)
    },
    end: {
        value: new geo.Circle(new geo.pos(17.854446224960324, -17.854446224960327), 24.75)
    }
});
const circle2 = Object.create(transCircle, {
    begin: {
        value: new geo.Circle(new geo.pos(20.710678118654755, 20.710678118654755), 20.710678118654755)
    },
    end: {
        value: new geo.Circle(new geo.pos(0, 0), 50)
    }
});
const circle3 = Object.create(transCircle, {
    begin: {
        value: new geo.Circle(new geo.pos(20.710678118654755, 20.710678118654755), 12.426406871192851)
    },
    end: {
        value: new geo.Circle(new geo.pos(-10.512921846709638, 10.512921846709638), 35.35533905932737)
    }
});

console.log(circle2);


function _69() {
    return `
        M91.42135623730951 29.289321881345245
        c0 14.037595187153421 0 27.38376105015609 0 41.42135623730951
        a20.710678118654755 20.710678118654755 0 0 1-41.42135623730951 0
        l8.284271247461902 0
        a12.426406871192853 12.426406871192853 0 0 0 24.852813742385706 0
        c0-8.422557112292052 0-16.430256630093652 0-24.852813742385706
        a20.710678118654755 20.710678118654755 0 1 1 8.284271247461902-16.568542494923804
        M8.57864376269049 70.71067811865476
        c0-14.037595187153421 0-27.38376105015609 0-41.42135623730951
        a20.710678118654755 20.710678118654755 0 0 1 41.42135623730951 0
        l-8.284271247461902 0
        a12.426406871192853 12.426406871192853 0 0 0-24.852813742385706 0
        c0 8.422557112292052 0 16.430256630093652 0 24.852813742385706
        a20.710678118654755 20.710678118654755 0 1 1-8.284271247461902 16.568542494923804z`
}

function tomoe() {
    return `
        M85.35533905932738 14.644660940672622
        c14.137106494231539 14.137106494231539 18.493664760866196 35.33669418696924 11.077197168386085 53.9031038697318
        a50 50 0 0 1 -76.28842754811164 21.55991217872787
        l0 0
        a35.35533905932737 35.35533905932737 0 0 0 45.03019066104608 -5.301408981966091
        c7.296765538684443 -7.715430764723962 10.739077805181825 -18.302069091424656 9.375394339463586 -28.83349950790222
        a24.75 24.75 0 1 1 10.805645379215889 -41.32810755859137z
        M14.64466094067263 85.35533905932738
        c-14.137106494231539 -14.137106494231539 -18.493664760866196 -35.33669418696924 -11.077197168386085 -53.9031038697318
        a50 50 0 0 1 76.28842754811164 -21.55991217872787
        l0 0
        a35.35533905932737 35.35533905932737 0 0 0 -45.03019066104608 5.301408981966091
        c-7.296765538684443 7.715430764723962 -10.739077805181825 18.302069091424656 -9.375394339463586 28.83349950790222
        a24.75 24.75 0 1 1 -10.805645379215889 41.32810755859137z`
}

function arcP(circleA, circleB, rad) {
    const A = circleA.center;
    const tpA = circleA.getPointAt(-rad);
    const B = circleB.center;
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);
    const rp = ((A.x ** 2 + B.x ** 2) * 2 - (circleA.r - circleB.r) ** 2) / (circleA.r - circleB.r + A.x * (sin + cos) + B.x * (sin - cos)) / 2 + circleA.r;
    const p = new geo.pos(cos * (circleA.r - rp) + A.x, -sin * (circleA.r - rp) - A.x);
    const circle = new geo.Circle(p, rp);
    const tpB = new geo.pos((B.x - p.x) * circleB.r / (rp - circleB.r) + B.x, (B.y - p.y) * circleB.r / (rp - circleB.r) + B.y);
    const arcRad = rad + Math.abs(circle.getRadiusAt(tpB));
    const length = arcRad * rp;
    return {circle, tpA, tpB, length, rad: arcRad};
}

function arcQ(arcp, c1, c2, c3) {
    const c3perc2 = c3.r / c2.r;
    const tpB = c3.getPointAt(0);
    const circle = new geo.Circle(Object.create(tpB).translate(-arcp.circle.r * c3perc2, 0), arcp.circle.r * c3perc2);
    const tpA = geo.Circle.getIntersections(circle, c1)[0];
    const arcRad = Math.abs(circle.getRadiusAt(tpA));
    const length = arcRad * circle.r;
    return {circle, tpA, tpB, length, rad: arcRad};
}

function _69toTomoe(t) {
    const c1 = circle1.getAt(t);
    const c2 = circle2.getAt(t);
    c2.length = 0.4331901595827229 * t + 106.48587046573816;
    const c3 = circle3.getAt(t);
    c3.length = 0.1666437339159429 * t + 63.89152227944289;
    const arcp = arcP(c1, c2, Math.PI * t / 400);
    const arc2rad = (c2.length - arcp.length) / c2.r;
    const arc2 = {
        circle: c2,
        begin: Object.create(arcp.tpB),
        end: Object.create(arcp.tpB).rotate(arc2rad, c2.center)
    };
    const arcq = arcQ(arcp, c1, c2, c3);
    const arc3rad = (c3.length - arcq.length) / c3.r;
    const arc3 = {
        circle: c3,
        begin: Object.create(arcq.tpB),
        end: Object.create(arcq.tpB).rotate(arc3rad, c3.center)
    };
    const arc1 = {
        circle: c1,
        begin: Object.create(arcq.tpA),
        end: Object.create(arcp.tpA)
    };
    return `
        M${50 + arcp.tpA.x} ${50 + arcp.tpA.y}
        a${arcp.circle.r} ${arcp.circle.r} 0 0 1 ${arcp.tpB.x - arcp.tpA.x} ${arcp.tpB.y - arcp.tpA.y}
        a${arc2.circle.r} ${arc2.circle.r} 0 0 1 ${arc2.end.x - arc2.begin.x} ${arc2.end.y - arc2.begin.y}
        l${arc3.end.x - arc2.end.x} ${arc3.end.y - arc2.end.y}
        a${arc3.circle.r} ${arc3.circle.r} 0 0 0 ${arc3.begin.x - arc3.end.x} ${arc3.begin.y - arc3.end.y}
        a${arcq.circle.r} ${arcq.circle.r} 0 0 0 ${arcq.tpA.x - arcq.tpB.x} ${arcq.tpA.y - arcq.tpB.y}
        a${arc1.circle.r} ${arc1.circle.r} 0 1 1 ${arc1.end.x - arc1.begin.x} ${arc1.end.y - arc1.begin.y}
        M${50 - arcp.tpA.x} ${50 - arcp.tpA.y}
        a${arcp.circle.r} ${arcp.circle.r} 0 0 1 ${arcp.tpA.x - arcp.tpB.x} ${arcp.tpA.y - arcp.tpB.y}
        a${arc2.circle.r} ${arc2.circle.r} 0 0 1 ${arc2.begin.x - arc2.end.x} ${arc2.begin.y - arc2.end.y}
        l${arc2.end.x - arc3.end.x} ${arc2.end.y - arc3.end.y}
        a${arc3.circle.r} ${arc3.circle.r} 0 0 0 ${arc3.end.x - arc3.begin.x} ${arc3.end.y - arc3.begin.y}
        a${arcq.circle.r} ${arcq.circle.r} 0 0 0 ${arcq.tpB.x - arcq.tpA.x} ${arcq.tpB.y - arcq.tpA.y}
        a${arc1.circle.r} ${arc1.circle.r} 0 1 1 ${arc1.begin.x - arc1.end.x} ${arc1.begin.y - arc1.end.y}
        z`;
}

async function run() {
    const ms = 10;
    pathElement.setAttribute('d', _69());
    ani.beginElement();
    await sleep(990);
    for (let i = 1; i < 100; i++) {
        await sleep(ms);
        pathElement.setAttribute('d', _69toTomoe(i));
    }
    await sleep(ms);
    pathElement.setAttribute('d', tomoe());
}

document.addEventListener('click', run);
