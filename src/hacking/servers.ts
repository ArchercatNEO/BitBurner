import { NS } from "@ns";
import { batchCopy } from "/lib/servers";

//TODO Use react or smth to manage server displays
export async function main(ns: NS) {
    for (let i = 0; i < ns.getPurchasedServerLimit(); i++) {
        const server = `#${i}`;
        const money = ns.getPlayer().money;

        let ram = 20;
        while (money < ns.getPurchasedServerCost(1 << ram)) {
            ram--;
        }

        //if the server exists upgrade otherwise buy
        ns.serverExists(server)
            ? ns.upgradePurchasedServer(server, 1 << ram)
            : ns.purchaseServer(server, 1 << ram);
    }

    batchCopy(ns);
}
