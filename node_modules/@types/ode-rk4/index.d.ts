export default function (y0: number[], deriv: Function, t: number, dt: number): Integrator;

export interface Integrator {
    deriv: Function,
    y: number[],
    n: number,
    dt: number,
    t: number,
    step: () => Integrator,
    steps: (n: number) => Integrator
}