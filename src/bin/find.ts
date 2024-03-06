import { NS } from "@ns";

export async function main(ns: NS) {
    let current = ns.args[0];
    let path = "";
    while (ns.scan(current)[0] != "home") {
        current = ns.scan(current)[0];
        path = "connect " + current + "; " + path;
    }
    path = path + "connect " + ns.args[0] + "; backdoor; home";
    ns.tprint(path);
}
