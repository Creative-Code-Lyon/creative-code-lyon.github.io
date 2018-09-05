const flatten = (arr, result = []) => {
    for (let i = 0, length = arr.length; i < length; i++) {
        const value = arr[i];
        if (Array.isArray(value)) {
            flatten(value, result);
        } else {
            result.push(value);
        }
    }
    return result;
};

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
ctx.strokeStyle = "white";
let w = window.innerWidth;
let h = window.innerHeight;
canvas.width = w;
canvas.height = h;

class Rect {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.s = 95;
    }

    split(n, axis) {
        if (n == 0) return this;

        let p = new Array(n)
            .fill(0)
            .map(d => Math.random())
            .sort();

        let newRects = [];

        for (let i = 0; i < n; i++) {
            let x, y, w, h;
            if (axis < 0.5) {
                x = this.x + (i == 0 ? 0 : p[i - 1] * this.w);
                y = this.y;
                w = this.w * (p[i] - (i == 0 ? 0 : p[i - 1]));
                h = this.h;
            } else {
                x = this.x;
                y = this.y + (i == 0 ? 0 : p[i - 1] * this.h);
                w = this.w;
                h = this.h * (p[i] - (i == 0 ? 0 : p[i - 1]));
            }

            newRects.push(new Rect(x, y, w, h));
        }

        let x, y, w, h;
        if (axis < 0.5) {
            x = this.x + p[p.length - 1] * this.w;
            y = this.y;
            w = this.w * (1.0 - p[p.length - 1]);
            h = this.h;
        } else {
            x = this.x;
            y = this.y + p[p.length - 1] * this.h;
            w = this.w;
            h = this.h * (1.0 - p[p.length - 1]);
        }
        newRects.push(new Rect(x, y, w, h));

        return newRects;
    }

    display() {
        ctx.fillStyle = red ? "red" : "black";
        ctx.strokeStyle = red ? "red" : "black";

        if (this.axis) {
            ctx.fillRect(this.x, this.y, ((this.w + 1) * this.s) / 100, this.h + 1);
        } else {
            ctx.fillRect(this.x, this.y, this.w + 1, ((this.h + 1) * this.s) / 100);
        }
    }

    anim() {
        this.axis = Math.random() < 0.5;
        TweenMax.fromTo(
            this,
            0.2 + Math.random(), {
                s: 0
            }, {
                s: 100,
                delay: Math.random(),
                ease: Bounce.easeOut
            }
        );
    }
}

let rects = [];

function splitRects(n) {
    rects = rects.map(rect => rect.split((Math.random() * 4) | 0, Math.random()));
    rects = flatten(rects);

    if (--n) splitRects(n);
}

let red = true;
const anim = () => {
    rects = [];
    rects.push(new Rect(-w, -h, 2 * w, 2 * h));
    splitRects((1 + Math.random() * 12) | 0);

    red = !red;
    rects.forEach(rect => rect.anim());
};
anim();
setInterval(anim, 4000);

(function display() {
    requestAnimationFrame(display);

    ctx.fillStyle = red ? "black" : "red";
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(Math.PI / 7);
    rects.forEach(rect => rect.display());
    ctx.restore();
})();
