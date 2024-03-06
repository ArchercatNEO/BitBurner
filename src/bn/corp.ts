import { NS } from "@ns"

export async function main(ns: NS) {
    const corp = ns.corporation
    const name = {
        corp: "EA",
        AG: "Agriculture",
        TB: "Tobbaco"
    }

    corp.createCorporation(name.corp)

    corp.expandIndustry(name.AG)
}
