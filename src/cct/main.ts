import { NS } from "@ns"
import { getAllServers } from "/functions"
import { solve, test } from "/cct/solver"

/**
 * Solve every contract we can.
 * Use with ns.run.
 */
export async function main(ns: NS) {
    const isTest = ns.args[0] as boolean ?? false 
    //ns.tprint(getAllServers(ns).map(server => ns.ls(server, ".cct")))

    if (!isTest)
        for (const server of getAllServers(ns)) {
            for (const cct of ns.ls(server, ".cct")) {
                solve(ns, cct, server)
            }
        }

    if (isTest) {
        //solve every test that might be real
        //ns.tprint(ns.codingcontract.getContractTypes())
        ns.ls("home", ".cct").forEach(cct => solve(ns, cct, "home"))
        for (const contract of ns.codingcontract.getContractTypes()) {
            if (test(ns, contract)) {return}
            await ns.sleep(1000)
            
        }
    }
}
