import { NS } from "@ns";
import { paint } from "/lib/logger";

export async function main(ns: NS) {
    const [target, weakenTime, id] = ns.args as [string, number, number];
    
    let time = Date.now();
    await ns.weaken(target);
    time = Math.trunc(Date.now() - time - weakenTime);

    if (Math.abs(time) > 100) ns.tprintf(paint(`Weaken #${id} desynced ${time} ms`, "red"));
}
