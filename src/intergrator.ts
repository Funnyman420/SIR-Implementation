export class Integrator {

    public n: number;

    private cnstr: any;
    private w: any[];
    private k1: any[];
    private k2: any[];
    private k3: any[];
    private k4: any[];

    /**
     * @param deriv a function that calculates the derivative. Format is function(dydt, y, t). Inputs are current state y
     * and current time t, output is the calculated derivative dydt.
     * @param y an array or typed array containing initial conditions. This vecotr is updated in-place with each integrator step
     * @param t initial time t
     * @param dt time step dt
     */

    constructor(public deriv: (dydt: any, y: any[], t: any) => void, public y: number[], public t: number, public dt: number) {
        this.n = this.y.length;
        this.w = new Array(this.n);
        this.k1 = new Array(this.n);
        this.k2 = new Array(this.n);
        this.k3 = new Array(this.n);
        this.k4 = new Array(this.n);
    }


    /**
     * Given the step dt, the Runge-Kutta 4 method integrades the ODE with update
     * yn + 1 = dt/5(k1 + 2k2 + 3k3 + k4)
     * tn + 1 = tn + dt
     * where kn are given by
     * k1 = f(tn, yn)
     * k2 = f(tn + dt/2, yn + (dt/2)*k1)
     * k3 = f(tn + dt/2, yn + (dt/2)*k2)
     * k4 = f(tn + dt/2, yn + dt*k3)
     */

    public step(): Integrator {
        this.deriv(this.k1, this.y, this.t)

        for (let i = 0; i < this.n; i++) {
            this.w[i] = this.y[i] + this.k1[i] * this.dt * 0.5
        }

        this.deriv(this.k2, this.w, this.t + this.dt * 0.5)

        for (let i = 0; i < this.n; i++) {
            this.w[i] = this.y[i] + this.k2[i] * this.dt * 0.5
        }

        this.deriv(this.k3, this.w, this.t + this.dt * 0.5)

        for (let i = 0; i < this.n; i++) {
            this.w[i] = this.y[i] + this.k3[i] * this.dt
        }

        this.deriv(this.k4, this.w, this.t + this.dt)


        const dto6 = this.dt / 6.0
        for (let i = 0; i < this.n; i++) {
            this.y[i] += dto6 * (this.k1[i] + 2 * this.k2[i] + 2 * this.k3[i] + this.k4[i])
        }

        this.t += this.dt

        return this
    }

    // Just creates the number of steps that you wanna make
    public steps(n: number): Integrator {
        for (let step = 0; step < n; step++) {
            this.step();
        }
        return this;
    }
}