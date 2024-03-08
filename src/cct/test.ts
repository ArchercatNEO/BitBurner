import { NS } from "@ns";
import { ContractError, solve } from "/cct/solve";
import { paint } from "/lib/logger";

export async function main(ns: NS) {
    //Clear all contracts before attempting tests
    ns.ls("home", ".cct").forEach((cct) => solve(ns, cct, "home"));

    contract: for (const cctType of ns.codingcontract.getContractTypes()) {
        let failed = 0;

        for (let i = 0; i < 10; i++) {
            const contract = ns.codingcontract.createDummyContract(cctType);
            const solution = solve(ns, contract, "home");

            if (solution === ContractError.NotImplemented) {
                ns.tprint(`ERROR: ${cctType} is not finished, skipping tests`);
                ns.rm(contract);
                continue contract;
            }

            if (solution === ContractError.ContractFailed) {
                ns.rm(contract);
                failed++;
            }
        }

        const colour = failed > 5 ? "red" : failed > 0 ? "yellow" : "cyan";
        ns.tprintf(
            paint(`${cctType} has been sucsessfully solved ${10 - failed}/10 times`, colour)
        );
        await ns.sleep(1000);
    }
}
