import { NS } from "@ns"

export function paint(x: any, color: string) {
    // x = what you want colored
    let y
    switch (color) {
        case "black":
            y = `\u001b[30m${x}\u001b[0m`
            break
        case "red":
            y = `\u001b[31m${x}\u001b[0m`
            break
        case "green":
            y = `\u001b[32m${x}\u001b[0m`
            break
        case "yellow":
            y = `\u001b[33m${x}\u001b[0m`
            break
        case "blue":
            y = `\u001b[34m${x}\u001b[0m`
            break
        case "magenta":
            y = `\u001b[35m${x}\u001b[0m`
            break
        case "cyan":
            y = `\u001b[36m${x}\u001b[0m`
            break
        case "white":
            y = `\u001b[37m${x}\u001b[0m`
            break
        default:
            y = `\u001b[38;5;${color}m${x}\u001b[0m`
    }
    return y
}

export function getAllServers(ns: NS) {
    const servers = ["home"]
    const levels = [0]
    for (let i = 0; i < servers.length; i++) {
        if (levels[i] < 16) {
            const connected = ns.scan(servers[i])
            for (const c of connected) {
                if (!servers.includes(c)) {
                    servers.push(c)
                    levels.push(levels[i] + 1)
                }
            }
        }
    }
    return servers
}

export function shotgun(ns: NS) {
    const functions = [
        ns.brutessh,
        ns.relaysmtp,
        ns.ftpcrack,
        ns.httpworm,
        ns.sqlinject,
        ns.nuke,
        (server: string) => ns.scp("/workers/hack.js", server, "home"),
        (server: string) => ns.scp("/workers/weaken.js", server, "home"),
        (server: string) => ns.scp("/workers/grow.js", server, "home"),
        (server: string) => ns.scp("/workers/backdoor.js", server, "home"),
        (server: string) => ns.scp("functions.js", server, "home")
    ]
    for (const server of getAllServers(ns)) {
        for (const task of functions) {
            try {
                task(server)
            } catch {
                continue
            }
        }
    }
}

/**
 * Returns the best server that can be hacked
 */
export function best(ns: NS) {
    const servers = getAllServers(ns).filter((s) => Weight(ns, s) > 0)
    return servers.sort((a, b) => Weight(ns, b) - Weight(ns, a))[0]
}

/**
 * Returns a weight that can be used to sort servers by hack desirability
 */
function Weight(ns: NS, server: string): number {
    // if it's a hacknet node we don't need it
    if (server.startsWith("hacknet-node")) return 0

    const player = ns.getPlayer()
    const so = ns.getServer(server)
    so.hackDifficulty = so.minDifficulty

    //if any of these are undefined this server is broken
    if (!so.hasAdminRights) return 0
    if (so.requiredHackingSkill == undefined) return 0
    if (so.moneyMax == undefined) return 0
    if (so.minDifficulty == undefined) return 0
    if (so.requiredHackingSkill > player.skills.hacking / 2) return 0

    const weight = !ns.fileExists("Formulas.exe")
        ? so.moneyMax / so.minDifficulty
        : (so.moneyMax / ns.formulas.hacking.weakenTime(so, player)) *
          ns.formulas.hacking.hackChance(so, player)

    return weight
}

/**
 * Returns the server with the most avalible RAM
 */
export function findRam(ns: NS): string {
    const list = getAllServers(ns).filter(server => ns.hasRootAccess(server))
    return list.sort(
        (a, b) =>
            ns.getServerMaxRam(b) -
            ns.getServerUsedRam(b) -
            (ns.getServerMaxRam(a) - ns.getServerUsedRam(a))
    )[0]
}

export function malloc(ns: NS, script: string, threads = 1) {
    const ram = ns.getScriptRam(script) * threads;
}