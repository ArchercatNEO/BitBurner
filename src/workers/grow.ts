import { NS } from "@ns";
import { paint } from "/lib/logger";

export const growPath = "workers/grow.js";

export async function main(ns: NS) {
    const [target, weakenTime, id] = ns.args as [string, number, number];

    let time = Date.now();
    await ns.grow(target, { additionalMsec: weakenTime * 0.2 });
    time = Math.trunc(Date.now() - time - weakenTime);

    if (Math.abs(time) > 100)
        ns.tprintf(
            paint(
                `Growing #${id} desynced ${time} ms with an extra delay of ${weakenTime * 0.2}`,
                "yellow"
            )
        );
}
