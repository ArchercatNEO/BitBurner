import { NS } from "@ns";
import { getAllServers, findRam } from "functions";

export async function main(ns: NS) {
    let servers = getAllServers(ns).map((a) => ns.getServer(a));
    let hosts = servers.filter((a) => a.backdoorInstalled);
    let targets = servers.filter((a) => !a.backdoorInstalled);
    targets = targets.filter(
        (a) => a.hasAdminRights && a.requiredHackingSkill < ns.getPlayer().skills.hacking
    );

    for (let server of targets.map((a) => a.hostname)) {
        let path = [server];
        let connected = ns.scan(server);

        while (connected.some((a) => hosts.indexOf(a) < 0)) {
            let step = connected[0];
            path.unshift(step);
            connected = ns.scan(step);
        }
        path.unshift(connected.find((a) => hosts.include(a))[0]);

        for (let step of path) {
            ns.singularity.connect(step);
        }

        ns.exec("backdoor.js", findRam(ns));
        await ns.sleep(0);
    }

    ns.singularity.connect("home");
}
