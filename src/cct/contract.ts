import { NS } from "@ns"

export async function main(ns: NS) {
    let target = ns.args[0]
    ns.singularity.connect(target)
    for (let i of ns.ls(target, ".cct")) {
        ns.tprint("run ", i)
    }
}
