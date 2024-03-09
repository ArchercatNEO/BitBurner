import { NS } from "@ns";
import { paint } from "/lib/logger";

export async function main(ns: NS) {
    const [target, weakenTime, id] = ns.args as [string, number, number];
    
    let time = Date.now();
    await ns.hack(target, { additionalMsec: weakenTime * 0.75 });
    time = Math.trunc(Date.now() - time - weakenTime);

    if (Math.abs(time) > 100)
        ns.tprintf(
            paint(
                `Hacking #${id} desynced ${time} ms with an extra delay of ${
                    weakenTime * 0.75
                }`,
                "white"
            )
        );
}
