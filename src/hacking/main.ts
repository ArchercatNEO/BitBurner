import { NS, Server } from "@ns";
import { execGrow, execHack, execWeaken } from "/workers/main";
import { batchCopy, batchCrack, best } from "/lib/servers";
import { getMaxThreads, mallocMax } from "/lib/ram";

//TODO Use react for displays
export async function main(ns: NS) {
    ns.tail();
    ns.disableLog("ALL");
    ns.enableLog("print");
    ns.clearLog();

    batchCopy(ns);
    batchCrack(ns);

    const spacer = 100; //ms
    const hackPercent = 0.01;

    const target = ns.getServer(best(ns));
    prep(ns, target);
}

function prep(ns: NS, server: Server) {
    const {
        minDifficulty: minSec,
        hackDifficulty: security,
        moneyMax: maxCash,
        moneyAvailable: cash
    } = server;

    if (!minSec || !security || !maxCash || !cash) {
        return;
    }

    const player = ns.getPlayer();
    const weakenTime = ns.formulas.hacking.weakenTime(server, player);

    const weakenHost = mallocMax(ns);
    const weakenHostThreads = getMaxThreads(ns, weakenHost, "/workers/weaken.js");
    const weakenTargetTheads = Math.ceil((security - minSec) * 20);
    const weakenThreads = Math.min(weakenHostThreads, weakenTargetTheads);
    execWeaken(ns, weakenHost.hostname, weakenThreads, server.hostname, weakenTime, 0);

    const growHost = mallocMax(ns);
    const growHostThreads = getMaxThreads(ns, growHost, "/workers/grow.js");
    const growTargetThreads = solveGrow(ns, cash, maxCash, server);
    const growThreads = Math.min(growHostThreads, growTargetThreads);
    execGrow(ns, growHost.hostname, growThreads, server.hostname, weakenTime, 1);

    const weakenGrowHost = mallocMax(ns);
    const weakenGrowHostThreads = getMaxThreads(ns, weakenGrowHost, "/workers/weaken.js");
    const weakenGrowTargetThreads = Math.ceil(ns.growthAnalyzeSecurity(growThreads) * 20);
    const weakenGrowThreads = Math.min(weakenGrowHostThreads, weakenGrowTargetThreads);
    execWeaken(ns, weakenGrowHost.hostname, weakenGrowThreads, server.hostname, weakenTime, 2);
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
