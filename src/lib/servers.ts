import { NS } from "@ns";

export function getAllServers(ns: NS): string[] {
    const servers = ["home"];
    const levels = [0];
    for (let i = 0; i < servers.length; i++) {
        if (levels[i] < 16) {
            const connected = ns.scan(servers[i]);
            for (const c of connected) {
                if (!servers.includes(c)) {
                    servers.push(c);
                    levels.push(levels[i] + 1);
                }
            }
        }
    }
    return servers;
}

/**
 * Returns the best server that can be hacked
 */
export function best(ns: NS): string {
    const valuableServers = getAllServers(ns).filter((s) => Weight(ns, s) > 0);
    return valuableServers.sort((a, b) => Weight(ns, b) - Weight(ns, a))[0];
}

/**
 * Returns a weight that can be used to sort servers by hack desirability
 */
function Weight(ns: NS, server: string): number {
    // if it's a hacknet node we don't need it
    if (server.startsWith("hacknet-node")) return 0;

    const player = ns.getPlayer();
    const so = ns.getServer(server);
    so.hackDifficulty = so.minDifficulty;

    //if any of these are undefined this server is broken
    if (!so.hasAdminRights) return 0;
    if (so.requiredHackingSkill == undefined) return 0;
    if (so.moneyMax == undefined) return 0;
    if (so.minDifficulty == undefined) return 0;
    if (so.requiredHackingSkill > player.skills.hacking / 2) return 0;

    const weight = !ns.fileExists("Formulas.exe")
        ? so.moneyMax / so.minDifficulty
        : (so.moneyMax / ns.formulas.hacking.weakenTime(so, player)) *
          ns.formulas.hacking.hackChance(so, player);

    return weight;
}

export function batchCopy(ns: NS, target: string | null = null) {
    const workers = ns.ls("home", "workers/");
    const lib = ns.ls("home", "lib/");

    const targets = target == null ? getAllServers(ns) : [target];

    for (const target of targets) {
        ns.scp(workers, target, "home");
        ns.scp(lib, target, "home");
    }
}

export function batchCrack(ns: NS, target: string | null = null) {
    const targets = target == null ? getAllServers(ns) : [target];
    const scripts: Map<string, (server: string) => void> = new Map([
        ["BruteSSH.exe", ns.brutessh],
        ["FTPCrack.exe", ns.ftpcrack],
        ["HTTPWorm.exe", ns.httpworm],
        ["SQLInject.exe", ns.sqlinject],
        ["relaySMTP.exe", ns.relaysmtp],
    ])

    const missing = new Set<string>();
    let ignored = 0;
    for (const target of targets) {
        for (const [script, callable] of Object.entries(scripts)) {
            if (ns.fileExists(script, "home")) {
                callable(target);
            } else {
                missing.add(script);
            }
        }

        try {
            ns.nuke(target);
        } finally {
            if (!ns.hasRootAccess(target)) {
                ignored++;
            }
        }
    }

    const formater = JSON.stringify(missing);
    ns.tprint(`${ignored} servers have not been nuked`);
    ns.tprint(`${formater} have not been found`);
}
