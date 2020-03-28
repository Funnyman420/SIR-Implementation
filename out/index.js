"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const intergrator_1 = require("./src/intergrator");
const fs_1 = require("fs");
const b = 0.4;
const g = 0.02;
const I0 = 0.001;
const step = 1.0;
const tmax = 80.0;
const n = 1.0;
function clone(x) {
    return Object.assign({}, x);
}
function sirModel(dydt, y, t) {
    dydt[0] = -b / n * y[0] * y[1];
    dydt[1] = b / n * y[0] * y[1] - g * y[1];
    dydt[2] = g * y[1];
}
function simulateDisease(callback, initialT, initialY) {
    let intergrator = new intergrator_1.Integrator(callback, initialY, initialT, step);
    let t = initialT;
    let y = initialY;
    let ta = [];
    let ya = [];
    ta.push(t);
    ya.push(clone(y));
    while (true) {
        t = t + step;
        if (t > tmax)
            break;
        intergrator = intergrator.step();
        ya.push(clone(intergrator.y));
        ta.push(t);
    }
    return { y: ya, t: ta };
}
function main() {
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
    fs_1.writeFile("./data/projections.json", JSON.stringify(jsonData), (err) => {
        if (err)
            throw err;
        console.log("...Done");
    });
}
main();
//# sourceMappingURL=index.js.map