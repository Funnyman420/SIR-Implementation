import { Integrator } from "./src/intergrator";
import { writeFile } from "fs";

const b: number = 0.4;
const g: number = 0.02;
const I0: number = 0.001;
const step: number = 1.0;
const tmax: number = 80.0;
const n: number = 1.0;


interface SimulationResult {
    y: number[][],
    t: number[]
}

function clone(x: number[]): number[] {
    return Object.assign({}, x);
}

function sirModel(dydt: number[], y: number[], t: number) {
    dydt[0] = -b / n * y[0] * y[1];
    dydt[1] = b / n * y[0] * y[1] - g * y[1];
    dydt[2] = g * y[1];
}

function simulateDisease(callback: (dydt: number[], y: number[], t: number) => void, initialT: number, initialY: number[]): SimulationResult {
    let intergrator: Integrator = new Integrator(callback, initialY, initialT, step);
    let t: number = initialT;
    let y: number[] = initialY;
    let ta: number[] = [];
    let ya: number[][] = [];
    ta.push(t);
    ya.push(clone(y));

    while (true) {
        t = t + step;
        if (t > tmax) break;
        intergrator = intergrator.step();
        ya.push(clone(intergrator.y));
        ta.push(t);
    }

    return { y: ya, t: ta } as SimulationResult
}

function main(): void {
    const sirModelSolution = simulateDisease(sirModel, 0, [n - I0, I0, 0.0]);
    const t = sirModelSolution.t;
    const susceptible = sirModelSolution.y.map(x => x[0]);
    const infected = sirModelSolution.y.map(x => x[1]);
    const removed = sirModelSolution.y.map(x => x[2]);

    const jsonData = {
        susceptible,
        infected,
        removed
    };

    writeFile("./data/projections.json", JSON.stringify(jsonData), (err) => {
        if (err) throw err;
        console.log("...Done");
    })


}

main();