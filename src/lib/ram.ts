import { NS, Server } from "@ns";
import { getAllServers } from "/lib/servers";

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

/** Return the server with the least avalible memory capable of running the requested script */
export function malloc(ns: NS, script: string, threads = 1): Server | null {
    const ram = ns.getScriptRam(script) * threads;
    let list = getAllServers(ns).map((name) => ns.getServer(name));
    list = list.filter((server) => server.hasAdminRights);
    list = list.filter((server) => getRam(server) > ram);
    list = list.sort((a, b) => getRam(b) - getRam(a));
    return list[0];
}

/** Return the server with the most avalible memory regardless of wanted size */
export function mallocMax(ns: NS): Server {
    let list = getAllServers(ns).map((name) => ns.getServer(name));
    list = list.filter((server) => server.hasAdminRights);
    list = list.sort((a, b) => getRam(b) - getRam(a));
    return list[0];
}

export function getRam(server: Server): number {
    return server.maxRam - server.ramUsed;
}

export function getMaxThreads(ns: NS, server: Server, script: string): number {
    const ram = getRam(server);
    const cost = ns.getScriptRam(script);
    const asFloat = ram / cost;
    return Math.floor(asFloat);
}
