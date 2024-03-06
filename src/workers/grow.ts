import { NS } from "@ns"
import { paint } from "functions"

export async function main(ns: NS) {
    let time = Date.now()
    const [weakenTime, target] = ns.args as [number, string]

    await ns.grow(target, { additionalMsec: weakenTime * 0.2 })

    time = Math.trunc(Date.now() - time - weakenTime)

    if (Math.abs(time) > 100)
        ns.tprintf(
            paint(
                `Growing #${ns.args[2]} desynced ${time} ms with an extra delay of ${
                    weakenTime * 0.2
                }`,
                "yellow"
            )
        )
}
