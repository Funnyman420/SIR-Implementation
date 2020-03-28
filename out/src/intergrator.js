"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Integrator {
    /**
     * @param deriv a function that calculates the derivative. Format is function(dydt, y, t). Inputs are current state y
     * and current time t, output is the calculated derivative dydt.
     * @param y an array or typed array containing initial conditions. This vecotr is updated in-place with each integrator step
     * @param t initial time t
     * @param dt time step dt
     */
    constructor(deriv, y, t, dt) {
        this.deriv = deriv;
        this.y = y;
        this.t = t;
        this.dt = dt;
        this.n = this.y.length;
        this.cnstr = this.y.constructor;
        this.w = new Array(this.n);
        this.k1 = new Array(this.n);
        this.k2 = new Array(this.n);
        this.k3 = new Array(this.n);
        this.k4 = new Array(this.n);
    }
    step() {
        this.deriv(this.k1, this.y, this.t);
        for (let i = 0; i < this.n; i++) {
            this.w[i] = this.y[i] + this.k1[i] * this.dt * 0.5;
        }
        this.deriv(this.k2, this.w, this.t + this.dt * 0.5);
        for (let i = 0; i < this.n; i++) {
            this.w[i] = this.y[i] + this.k2[i] * this.dt * 0.5;
        }
        this.deriv(this.k3, this.w, this.t + this.dt * 0.5);
        for (let i = 0; i < this.n; i++) {
            this.w[i] = this.y[i] + this.k3[i] * this.dt;
        }
        this.deriv(this.k4, this.w, this.t + this.dt);
        const dto6 = this.dt / 6.0;
        for (let i = 0; i < this.n; i++) {
            this.y[i] += dto6 * (this.k1[i] + 2 * this.k2[i] + 2 * this.k3[i] + this.k4[i]);
        }
        this.t += this.dt;
        return this;
    }
    steps(n) {
        for (let step = 0; step < n; step++) {
            this.step();
        }
        return this;
    }
}
exports.Integrator = Integrator;
//# sourceMappingURL=intergrator.js.map