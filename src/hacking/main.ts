import { NS, Server } from "@ns";
import { best, findRam, shotgun, paint } from "/functions";
import { execGrow, execHack, execWeaken } from "/workers/main";

export async function main(ns: NS) {
    ns.tail();
    ns.disableLog("ALL");
    ns.enableLog("print");
    ns.clearLog();

    shotgun(ns);

    const spacer = 100; //ms
    const hackPercent = 0.01;

    const target = ns.getServer(best(ns));
    await ns.sleep(1000);
    prep(ns, target);
}

function prep(ns: NS, server: Server) {
    // eslint-disable-next-line no-debugger
    debugger;
    const {
        minDifficulty: minSec,
        hackDifficulty: security,
        moneyMax: maxCash,
        moneyAvailable: cash
    } = server;

    if (!minSec || !security || !maxCash || !cash) return;

    const weakenCost = ns.getScriptRam("/workers/weaken.js");
    const player = ns.getPlayer();
    const weakenTime = ns.formulas.hacking.weakenTime(server, player);
    let id = 0;

    let weakenThreads = Math.ceil((security - minSec) * 20);
    while (biggestRam(ns) > weakenCost && weakenThreads > 0 && id < 10) {
        weakenThreads -= execWeaken(ns, server.hostname, weakenTime, weakenThreads, id);
        id++;
    }

    const growThreads = solveGrow(ns, cash, maxCash, server);
    const usedGrowThreads = execGrow(ns, server.hostname, weakenTime, growThreads, id);
    id++;

    let growWeakenThreads = Math.ceil(ns.growthAnalyzeSecurity(usedGrowThreads) * 20);
    while (biggestRam(ns) > weakenCost && growWeakenThreads > 0 && id < 10) {
        growWeakenThreads -= execWeaken(ns, server.hostname, weakenTime, growWeakenThreads, id);
        id++;
    }
}

function ram(server: Server): number {
    return server.maxRam - server.ramUsed;
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

function biggestRam(ns: NS): number {
    return ram(ns.getServer(findRam(ns)));
}
