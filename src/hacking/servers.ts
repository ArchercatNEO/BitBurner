import { shotgun } from "functions";
/** @param {NS} ns */
export async function main(ns) {
    let servers = [];
    //loop until we run out of servers
    for (let i = 0; i < ns.getPurchasedServerLimit(); i++) {
        //setting the name of the server (#0, #1, #2, ect.)
        let server = `#${i}`;

        //get biggest ram we can afford
        let ram = 1;
        for (let i = 1; i <= Math.log2(ns.getPurchasedServerMaxRam()); i++)
            if (ns.getPlayer().money > ns.getPurchasedServerCost(2 ** i)) ram *= 2;
            else break;

        //getting servers that will actually exist
        if (ram > 1) servers.push(server);

        //if the server exists upgrade otherwise buy
        ns.serverExists(server)
            ? ns.upgradePurchasedServer(server, ram)
            : ns.purchaseServer(server, ram);
    }

    //print an array of the exponent on the rams of our p-servers
    ns.tprint(servers.map((a) => Math.log2(ns.getServerMaxRam(a))));
    shotgun(ns);
}
