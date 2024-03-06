import { NS } from "@ns";

export async function main(ns: NS) {
    const target = ns.args[0] as string;
    ns.singularity.connect(target);
    for (const i of ns.ls(target, ".cct")) {
        ns.tprint("run ", i);
    }
}
