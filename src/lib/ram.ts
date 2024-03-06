import { NS } from "@ns";
import { getAllServers } from "./servers";

/**
 * Returns the server with the most avalible RAM
 */
export function findRam(ns: NS): string {
    const list = getAllServers(ns).filter((server) => ns.hasRootAccess(server));
    return list.sort(
        (a, b) =>
            ns.getServerMaxRam(b) -
            ns.getServerUsedRam(b) -
            (ns.getServerMaxRam(a) - ns.getServerUsedRam(a))
    )[0];
}

export function malloc(ns: NS, script: string, threads = 1) {
    const ram = ns.getScriptRam(script) * threads;
}
