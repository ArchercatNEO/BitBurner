import { NS } from "@ns";
import { findRam } from "/lib/ram";
import { batchCopy, batchCrack } from "/lib/servers";

export async function main(ns: NS) {
    batchCopy(ns);
    batchCrack(ns);
    dfs(ns, "home", "home");
}

function dfs(ns: NS, server: string, origin: string) {
    ns.singularity.connect(server);

    const host = findRam(ns);
    const info = ns.getServer(server);
    if (!info.backdoorInstalled) {
        ns.exec("workers/backdoor.js", host);
    }

    for (const connected of ns.scan(server)) {
        if (connected == origin) {
            continue;
        }
        dfs(ns, connected, server);
    }

    ns.singularity.connect(origin);
}
