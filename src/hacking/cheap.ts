import { best, findRam, shotgun, paint } from "functions"
import { NS } from "@ns"

export async function main(ns: NS) {
    /**ns.tail()*/ ns.disableLog("ALL")
    ns.enableLog("print")
    ns.enableLog("tprint")
    ns.clearLog()

    //Real variables
    let spacer = 100 //ms, the time between worker end times
    let hacks = 0.01 // % of money to take with every hack worker
    let batches = 3 // # of HWGW batches we will exec

    // I hate let
    let target = ns.getServer(best(ns))
    let time = ns.getWeakenTime(target.hostname)

    //constant functions to calc threads to undo actions
    const hack = [() => Math.ceil(hacks / ns.hackAnalyze(target.hostname))]
    const weaken = [
        () => Math.ceil((target.hackDifficulty - target.minDifficulty) * 20),
        () => Math.ceil(ns.hackAnalyzeSecurity(hack[0]()) * 20),
        () => Math.ceil(ns.growthAnalyzeSecurity(grow[1]()) * 20),
        () => Math.ceil(ns.growthAnalyzeSecurity(grow[2]()) * 20)
    ]
    const grow = [
        () => { throw "Impossible call"; },
        () => ns.growthAnalyze(target.hostname, target.moneyMax / target.moneyAvailable),
        () => ns.growthAnalyze(target.hostname, 1 / (1 - hacks))
    ]

    //the object to hold thread funcs (index 0) and time offset factors (index 1)
    const basics = {
        "hack.js": [hack, 0.75],
        "weaken.js": [weaken, 0],
        "grow.js": [grow, 0.2]
    }

    while (ns.getPlayer().money < 5e9) {
        //scp, port, nuke all servers
        shotgun(ns)

        //refresh the target, hacktime and zero
        target = ns.getServer(best(ns))
        time = ns.getWeakenTime(target.hostname)

        //prep the server to min sec and max mon
        while (
            target.moneyAvailable < target.moneyMax ||
            target.hackDifficulty > target.minDifficulty
        ) {
            var zero = Date.now()
            //wait until all scripts are done
            await ns.sleep((await prep(target, time)) - Date.now() + zero + spacer * 10)

            //refresh values after preping
            target = ns.getServer(target.hostname)
            time = ns.getWeakenTime(target.hostname)
        }

        //log time
        ns.tprint(
            paint(
                `Target ${target.hostname} is ready to batch, ${batches} batches will take ${format(
                    time + 3 * spacer * batches
                )}`,
                "cyan"
            )
        )

        //setup vars to sleep until scripts are done later
        let maxTime = 0
        const one = Date.now()

        for (let order = 0; order < (batches * time * basics["hack.js"][1]) / spacer; order++) {
            //setup what script we will exec, with how many threads and adjusted for time
            let script = ["hack.js", "weaken.js", "grow.js", "weaken.js"][order % 4]
            let relOrder = Math.ceil(order - (time * basics[script][1]) / spacer)
            let threads = Math.ceil(basics[script][0][order % 4]())
            let delay = Math.max(
                0,
                time * basics[script][1] + spacer * (relOrder + 1) + one - Date.now()
            )
            let maxRam =
                (ns.getServerMaxRam(findRam(ns)) - ns.getServerUsedRam(findRam(ns))) /
                ns.getScriptRam(script)
            //find the script with the biggest time until it's done
            maxTime = Math.max(maxTime, time + spacer * relOrder)

            //if it's time to exec a script and there's something to do
            if (-1 < relOrder && relOrder < 4 * batches && threads > 0) {
                //If we need more threads that we can afford
                if (threads > maxRam) {
                    ns.tprint(
                        `ERROR: ${script} needed ${threads} while we could only use ${maxRam} aborting batch #${
                            relOrder / 4
                        }`
                    )
                    threads = Math.floor(maxRam)
                    order = Infinity
                }

                ns.exec(
                    script, //script
                    findRam(ns), //server with most ram
                    threads, //threads to exec with
                    delay, //sleep time
                    target.hostname, //target name
                    relOrder, //worker ID adjusted to land time
                    time + spacer * order
                ) //expected end time
            }

            await ns.sleep(spacer)
        }

        //time we will need to sleep
        let sleepTime = Date.now() - one + maxTime

        //logging
        ns.tprint(
            paint(
                `Batching ended on ${target.hostname}. Restarting batching in ${format(
                    sleepTime + 3 * spacer * batches
                )}`,
                "blue"
            )
        )

        await ns.sleep(sleepTime)
    }

    ns.tprint(paint("Gained 5b and can afford formulas now exiting", "white"))
    ns.alert("Go buy formulas")
    ns.exit()

    async function prep(target, time) {
        let maxTime = 0
        ns.tprint(
            paint(
                `Target ${target.hostname} is not ready to batch, prepping will finish in ${format(
                    time + 2 * spacer
                )}`,
                "cyan"
            )
        )
        if (target.hackDifficulty > target.minDifficulty)
            ns.tprint(
                `Security imbalance ${target.hackDifficulty} being reduced to ${target.minDifficulty}`
            )
        if (target.moneyAvailable < target.moneyMax)
            ns.tprint(`Cash imbalance ${target.moneyAvailable} being raised to ${target.moneyMax}`)

        for (let order = 0; order < (time * basics["grow.js"][1]) / spacer; order++) {
            //setup what script we will exec, with how many threads and adjusted for time
            let script = ["weaken.js", "grow.js", "weaken.js"][order % 3]
            let relOrder = Math.ceil(order - (time * basics[script][1]) / spacer)
            let threads = Math.ceil(basics[script][0][order % 3]())
            let delay = Math.max(
                0,
                time * basics[script][1] + spacer * (relOrder + 1) + zero - Date.now()
            )
            let maxRam =
                (ns.getServerMaxRam(findRam(ns)) - ns.getServerUsedRam(findRam(ns))) /
                ns.getScriptRam(script)
            maxTime = Math.max(maxTime, time + spacer * relOrder)

            //if it's time to exec a script and there's something to do
            if (-1 < relOrder && relOrder < 3 && threads > 0) {
                //If we need more threads that we can afford
                if (threads > maxRam) {
                    ns.tprint(
                        `ERROR: ${script} needed ${threads} while we could only use ${maxRam} aborting batch`
                    )
                    threads = Math.floor(maxRam)
                    order = Infinity
                }
                ns.exec(
                    script, //script
                    findRam(ns), //server with most ram
                    threads, //threads to exec with
                    delay, //sleep time
                    target.hostname, //target name
                    relOrder, //worker ID adjusted to land time
                    time + spacer * order
                ) //expected end time

                await ns.sleep(spacer)
            }
        }

        return maxTime
    }

    function format(date) {
        return new Intl.DateTimeFormat("en", {
            minute: "numeric",
            second: "numeric",
            fractionalSecondDigits: 3,
            timeZone: "UTC"
        }).format(date)
    }
}
