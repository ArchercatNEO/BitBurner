import { NS, Server } from "@ns";
import { execGrow, execHack, execWeaken } from "/workers/main";
import { batchCopy, batchCrack, best } from "/lib/servers";
import { getMaxThreads, mallocMax, mallocThreads } from "/lib/ram";
import { RealServerStats } from "/lib/goodNetScript";

//TODO Use react for displays
export async function main(ns: NS) {
    batchCopy(ns);
    batchCrack(ns);

    const spacer = 100; //ms
    const hackPercent = 0.01;

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const player = ns.getPlayer();
        const target = ns.getServer(best(ns));
        const stats = new RealServerStats(target)
        const weakenTime = ns.formulas.hacking.weakenTime(target, player);
        
        //Prep the server
        if (stats.hackDifficulty > stats.minDifficulty || stats.moneyAvailable < stats.moneyMax) {
            ns.tprint(`Reducing security from ${stats.hackDifficulty} -> ${stats.minDifficulty}`)
            ns.tprint(`Increasing money from ${stats.moneyAvailable} -> ${stats.moneyMax}`)
            
            await prep(ns, target, stats, weakenTime);
            continue
        }

        //Farm the server
        let batchId = 0
        for (; batchId < 1000; batchId++) {
            const hackTargetThreads = ns.hackAnalyzeThreads(target.hostname, stats.moneyMax * hackPercent);
            const hackExecution = mallocThreads(ns, "/workers/hack.js", hackTargetThreads)
            if (hackExecution.threads == 0) {
                break;
            }
            execHack(ns, hackExecution.host, hackExecution.threads, target.hostname, weakenTime, batchId);
            await ns.sleep(100)

            const weakenTargetTheads = Math.ceil(ns.hackAnalyzeSecurity(hackExecution.threads, target.hostname) * 20);
            const weakenExecution = mallocThreads(ns, "/workers/weaken.js", weakenTargetTheads)
            if (weakenExecution.threads == 0) {
                break;
            }
            execWeaken(ns, weakenExecution.host, weakenExecution.threads, target.hostname, weakenTime, batchId + 1);
            await ns.sleep(100)

            const growTargetThreads = solveGrow(ns, stats.moneyMax * (1 - hackPercent), stats.moneyMax, target);
            const growExecution = mallocThreads(ns, "/workers/grow.js", growTargetThreads)
            if (growExecution.threads == 0) {
                break;
            }
            execGrow(ns, growExecution.host, growExecution.threads, target.hostname, weakenTime, batchId + 2);
            await ns.sleep(100)

            const weakenGrowTargetThreads = Math.ceil(ns.growthAnalyzeSecurity(growExecution.threads) * 20);
            const weakenGrowExecution = mallocThreads(ns, "/workers/weaken.js", weakenGrowTargetThreads)
            if (weakenGrowExecution.threads == 0) {
                break;
            }
            execWeaken(ns, weakenGrowExecution.host, weakenGrowExecution.threads, target.hostname, weakenTime, batchId + 3);
            await ns.sleep(100)
        }
        
        const endTime = weakenTime + batchId * spacer;
        ns.tprint(`[${batchId}] batches executing`)
        ns.tprint(`Waiting for script to end in ${endTime}`)
        await ns.sleep(endTime)
    }
}

async function prep(ns: NS, server: Server, stats: RealServerStats, weakenTime: number) {
    const weakenTargetTheads = Math.ceil((stats.hackDifficulty - stats.minDifficulty) * 20);
    const weakenExecute = mallocThreads(ns, "/workers/weaken.js", weakenTargetTheads)
    if (weakenExecute.threads > 0) {
        execWeaken(ns, weakenExecute.host, weakenExecute.threads, server.hostname, weakenTime, 0);
    }
    await ns.sleep(100)
    
    const growHost = mallocMax(ns);
    const growHostThreads = getMaxThreads(ns, growHost, "/workers/grow.js");
    const growTargetThreads = solveGrow(ns, stats.moneyAvailable, stats.moneyMax, server);
    const growThreads = Math.min(growHostThreads, growTargetThreads);
    if (growThreads > 0) {
        execGrow(ns, growHost.hostname, growThreads, server.hostname, weakenTime, 1);
    }
    await ns.sleep(100)
    
    const weakenGrowHost = mallocMax(ns);
    const weakenGrowHostThreads = getMaxThreads(ns, weakenGrowHost, "/workers/weaken.js");
    const weakenGrowTargetThreads = Math.ceil(ns.growthAnalyzeSecurity(growThreads) * 20);
    const weakenGrowThreads = Math.min(weakenGrowHostThreads, weakenGrowTargetThreads);
    if (weakenGrowThreads > 0) {
        execWeaken(ns, weakenGrowHost.hostname, weakenGrowThreads, server.hostname, weakenTime, 2);
    }

    await ns.sleep(weakenTime + 200)
}

//xsinx
function solveGrow(ns: NS, money_lo: number, money_hi: number, server: Server) {
    const fake = server;
    fake.hackDifficulty = fake.minDifficulty;
    const base = ns.formulas.hacking.growPercent(fake, 1, ns.getPlayer(), 1);
    if (money_lo >= money_hi) return 0;

    let threads = 1000;
    let prev = threads;
    for (let i = 0; i < 30; i++) {
        const factor = money_hi / Math.min(money_lo + threads, money_hi - 1);
        threads = Math.log(factor) / Math.log(base);
        if (Math.ceil(threads) == Math.ceil(prev)) break;
        prev = threads;
    }
    return Math.ceil(Math.max(threads, prev, 0));
}
