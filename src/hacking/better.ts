import { NS } from "@ns"
import { best, findRam, shotgun, paint } from "functions"

export async function main(ns: NS) {
    ns.tail()
    ns.disableLog("ALL")
    ns.enableLog("print")
    ns.enableLog("tprint")
    ns.clearLog()

    //Real variables
    let spacer = 100 //ms, the time between worker end times
    let hacks = 0.01 // % of money to take with every hack worker
    let batches = 20 // # of HWGW batches we will exec

    //just here because let trash
    let target = ns.getServer(best(ns))

    //the object to hold thread funcs (index 0) and time offset factors (index 1)
    const basics = {
        hack: [() => Math.floor(hacks / ns.hackAnalyze(target.hostname))],
        weaken: [
            () => Math.ceil((target.hackDifficulty - target.minDifficulty) * 20),
            () => Math.ceil(ns.hackAnalyzeSecurity(basics.hack[0]()) * 20),
            () => Math.ceil(ns.growthAnalyzeSecurity(basics.grow[1]()) * 20),
            () => Math.ceil(ns.growthAnalyzeSecurity(basics.grow[2]()) * 20)
        ],
        grow: [
            () => null,
            () => solveGrow(target.moneyAvailable, target.moneyMax),
            () => solveGrow(target.moneyMax * (1 - hacks), target.moneyMax)
        ]
    }
    let threadfunc = {
        hack: [],
        weaken: [],
        grow: []
    }

    while (true) {
        //scp, port, nuke all servers
        shotgun(ns)

        //refresh the target, hacktime and zero
        target = ns.getServer(best(ns))

        //prep the server to min sec and max mon
        while (
            target.moneyAvailable < target.moneyMax ||
            target.hackDifficulty > target.minDifficulty
        ) {
            //wait until all scripts are done
            await ns.sleep(await prep(target))
            target = ns.getServer(best(ns))
        }

        let fake = target
        fake.hackDifficulty = fake.minDifficulty
        let time = ns.formulas.hacking.weakenTime(fake, ns.getPlayer())

        //log time
        ns.tprintf(
            paint(
                `Target ${target.hostname} is ready to batch, ${batches} batches will take ${format(
                    4 * spacer * batches
                )} to execute`,
                "cyan"
            )
        )

        for (let i in basics)
            for (let j = 0; j < basics[i].length; j++) threadfunc[i][j] = basics[i][j]()

        for (let order = 0; order < 4 * batches; order++) {
            //setup what script we will exec, with how many threads and adjusted for time
            let script = ["hack", "weaken", "grow", "weaken"][order % 4]
            let threads = Math.ceil(threadfunc[script][order % 4])
            let maxRam =
                (ns.getServerMaxRam(findRam(ns)) - ns.getServerUsedRam(findRam(ns))) /
                ns.getScriptRam(`${script}.js`, "home")

            //if it's time to exec a script and there's something to do
            if (threads > 0) {
                //If we need more threads that we can afford
                if (threads > maxRam) {
                    ns.tprintf(
                        `ERROR: ${script} needed ${threads} while we could only use ${maxRam} aborting batch`
                    )
                    threads = Math.floor(maxRam)
                    order = Infinity
                }

                ns.exec(
                    `${script}.js`, //script
                    findRam(ns), //server with most ram
                    threads, //threads to exec with
                    time, //weaken time, will be used for syncing
                    target.hostname, //target name
                    order
                ) //worker ID
            }
            await ns.sleep(spacer)
        }

        //logging
        ns.tprintf(
            paint(
                `Batching ended on ${target.hostname}. Restarting batching in ${format(time)}`,
                "blue"
            )
        )

        await ns.sleep(time)
    }

    async function prep(target) {
        let time = ns.getWeakenTime(target.hostname)

        //logging
        ns.tprintf(
            paint(
                `Target ${target.hostname} is not ready to batch, prepping will finish in ${format(
                    3 * spacer
                )}`,
                "cyan"
            )
        )
        if (target.hackDifficulty > target.minDifficulty)
            ns.tprintf(
                `Security imbalance ${target.hackDifficulty} being reduced to ${
                    target.minDifficulty
                } (${target.hackDifficulty - target.minDifficulty})`
            )
        if (target.moneyAvailable < target.moneyMax)
            ns.tprintf(
                `Cash imbalance ${target.moneyAvailable} being raised to ${
                    target.moneyMax
                } (${Math.trunc(target.moneyMax / target.moneyAvailable)}x)`
            )

        for (let i in basics)
            for (let j in basics[i]) threadfunc[i][parseInt(j)] = basics[i][parseInt(j)]()

        for (let order = 0; order < 3; order++) {
            //setup what script we will exec, with how many threads and adjusted for time
            let script = ["weaken", "grow", "weaken"][order]
            let threads = threadfunc[script][order]
            let maxRam =
                (ns.getServerMaxRam(findRam(ns)) - ns.getServerUsedRam(findRam(ns))) /
                ns.getScriptRam(`${script}.js`, "home")

            //if it's time to exec a script and there's something to do
            if (threads > 0) {
                //If we need more threads that we can afford
                if (threads > maxRam) {
                    ns.tprintf(
                        `ERROR: ${script} needed ${threads} while we could only use ${maxRam} aborting batch`
                    )
                    threads = Math.floor(maxRam)
                    order = Infinity
                }

                ns.exec(
                    `${script}.js`, //script
                    findRam(ns), //server with most ram
                    threads, //threads to exec with
                    time, //weaken time, will be used for syncing
                    target.hostname, //target name
                    order
                ) //worker ID
            }
            await ns.sleep(spacer)
        }
        return time
    }

    //xsinx
    function solveGrow(money_lo, money_hi) {
        let fake = target
        fake.hackDifficulty = fake.minDifficulty
        let base = ns.formulas.hacking.growPercent(fake, 1, ns.getPlayer(), 1)
        if (money_lo >= money_hi) return 0

        let threads = 1000
        let prev = threads
        for (let i = 0; i < 30; i++) {
            let factor = money_hi / Math.min(money_lo + threads, money_hi - 1)
            threads = Math.log(factor) / Math.log(base)
            if (Math.ceil(threads) == Math.ceil(prev)) break
            prev = threads
        }
        return Math.ceil(Math.max(threads, prev, 0))
    }

    //d0sboots
    function format(date) {
        return new Intl.DateTimeFormat("en", {
            minute: "numeric",
            second: "numeric",
            fractionalSecondDigits: 3,
            timeZone: "UTC"
        }).format(date)
    }
}
