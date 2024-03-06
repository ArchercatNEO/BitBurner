import { NS, Server } from "@ns"
import { best, findRam, shotgun, paint } from "/functions"

export async function main(ns: NS) {
    const spacer = 100 //ms
    const hacks = 0.2
    const scripts = ["weaken.js", "grow.js", "weaken.js"]
    
    const hack = [(target: Server) => hacks / ns.hackAnalyze(target.hostname)]
    const weaken = [
        (target: Server) => (target.hackDifficulty - target.minDifficulty) * 20,
        (target: Server) => ns.hackAnalyzeSecurity(hack[0](target)) * 20,
        (target: Server) => ns.growthAnalyzeSecurity(grow[1](target)) * 20,
        (target: Server) => ns.growthAnalyzeSecurity(grow[2](target)) * 20
    ]
    const grow = [
        (target: Server) => { throw "Invalid grow" },
        (target: Server) => solveGrow(target.moneyAvailable, target.moneyMax),
        (target: Server) => solveGrow(target.moneyMax * (1 - hacks), target.moneyMax)
    ]
    const basics: { [id: string]: [((target: Server) => number)[], number]} = {
        "hack.js": [hack, 0.75],
        "weaken.js": [weaken, 0],
        "grow.js": [grow, 0.2]
    }
    
    let target = ns.getServer(best(ns))
    for (; true; target = ns.getServer(best(ns))) {
        shotgun(ns)
        
        for (const limit of [3, 2 ** 12]) {
            target = ns.getServer(target.hostname)
            const time = ns.formulas.hacking.weakenTime(target, ns.getPlayer())

            let order = 0 
            for (; order < limit; order++) {
                const cycle = order % 4
                const script = scripts[cycle]
                const threads = Math.ceil(basics[script][0][cycle](target))

                if (threads == 0) { continue; }
                
                const max =
                    (ns.getServerMaxRam(findRam(ns)) - ns.getServerUsedRam(findRam(ns))) /
                    ns.getScriptRam(script)
                if (threads > max) {
                    ns.exec(
                        script,
                        findRam(ns),
                        Math.floor(max),
                        time * basics[script][1] + spacer * order,
                        target.hostname,
                        order,
                        time + spacer * order
                    )
                    ns.tprint(
                        paint(
                            `Batch ended with: ${script}, ${threads} threads and ${Math.floor(
                                order / 4
                            )} batches`,
                            "cyan"
                        )
                    )
                    break
                } else {
                    ns.exec(
                        script,
                        findRam(ns),
                        threads,
                        time * basics[script][1] + spacer * order,
                        target.hostname,
                        order,
                        time + spacer * order
                    )
                }
            }
            
            ns.tprint(
                paint(`Sleeping for ${(time + spacer * order + 1000) / 1000} seconds`, "cyan")
            )
            scripts.unshift("hack.js")
            await ns.sleep(time + spacer * order + 1000)
        }
        scripts.shift()
        scripts.shift()
        ns.tprint(paint("Restarting batching", "red"))
    }

    function solveGrow(money_lo: number, money_hi: number) {
        if (money_lo >= money_hi) {
            return 0
        }
        const base = ns.formulas.hacking.growPercent(target, 1, ns.getPlayer(), 1)
        let threads = 1000
        let prev = threads
        for (let i = 0; i < 30; ++i) {
            const factor = money_hi / Math.min(money_lo + threads, money_hi - 1)
            threads = Math.log(factor) / Math.log(base)
            if (Math.ceil(threads) == Math.ceil(prev)) {
                break
            }
            prev = threads
        }

        return Math.ceil(Math.max(threads, prev, 0))
    }
}
