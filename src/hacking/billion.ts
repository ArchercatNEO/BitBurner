import { NS } from "@ns";
import { best, findRam, shotgun, paint } from "/functions";

export async function main(ns: NS) {
    ns.disableLog("ALL");
    let spacer = 100; //ms
    let hacks = 0.02;
    let target = ns.getServer(best(ns));
    let limits = [3, 2 ** 10];
    let scripts = ["weaken.js", "grow.js", "weaken.js"];
    let colours = ["red", "white"];
    let hack = [() => hacks / ns.hackAnalyze(target.hostname)];
    let weaken = [
        () => (target.hackDifficulty - target.minDifficulty) * 20,
        () => ns.hackAnalyzeSecurity(basics["hack.js"][0][0]() * 20),
        () => ns.growthAnalyzeSecurity(basics["grow.js"][0][1]() * 20),
        () => ns.growthAnalyzeSecurity(basics["grow.js"][0][2]() * 20)
    ];
    let grow = [
        () => ns.tprint("How did you get here"),
        () => ns.growthAnalyze(target.hostname, target.moneyMax / target.moneyAvailable),
        () => ns.growthAnalyze(target.hostname, 1 / (1 - hacks))
    ];
    let basics = {
        "hack.js": [hack, 0.75],
        "weaken.js": [weaken, 0],
        "grow.js": [grow, 0.2]
    };
    let object;
    while (ns.getPlayer().money < 5e9) {
        shotgun(ns);
        let order;
        target = ns.getServer(best(ns));

        for (let limit = 0; limit < limits.length; limit++) {
            target = ns.getServer(target.hostname);
            let time = ns.getWeakenTime(target.hostname);
            for (order = 0; order < limits[limit]; order++) {
                object = scripts[order % 4];
                if (Math.ceil(basics[object][0][order % 4]() > 0)) {
                    if (
                        ns.exec(
                            object,
                            findRam(ns),
                            Math.min(
                                Math.ceil(
                                    basics[object][0][order % 4](),
                                    Math.floor(
                                        (ns.getServerMaxRam(findRam(ns)) -
                                            ns.getServerUsedRam(findRam(ns))) /
                                            ns.getScriptRam("grow.js")
                                    )
                                )
                            ),
                            time * basics[object][1] + spacer * order,
                            target.hostname,
                            order,
                            time + spacer * order
                        ) == 0
                    ) {
                        break;
                    }
                }
            }
            ns.tprint(
                paint(
                    `Batch ended with: ${object}, ${Math.ceil(
                        basics[object][0][order % 4]()
                    )} threads and ${Math.floor(order / 4)} batches`,
                    colours[limit]
                )
            );
            ns.tprint(
                paint(
                    `Sleeping for ${(time + spacer * order + 1000) / 1000} seconds`,
                    colours[limit]
                )
            );
            await ns.sleep(time + spacer * order + 1000);
            scripts.unshift("hack.js");
        }
        scripts.shift();
        scripts.shift();
    }
    ns.alert("You can buy formulas");
}
