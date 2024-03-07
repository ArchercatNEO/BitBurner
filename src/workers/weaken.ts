import { NS } from "@ns";
import { paint } from "/lib/logger";

export async function main(ns: NS) {
    let time = Date.now();
    const [weakenTime, target] = ns.args as [number, string];

    await ns.weaken(target);

    time = Math.trunc(Date.now() - time - weakenTime);

    if (Math.abs(time) > 100) ns.tprintf(paint(`Weaken #${ns.args[2]} desynced ${time} ms`, "red"));
}
