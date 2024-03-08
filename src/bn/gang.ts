import { GangGenInfo, GangMemberInfo, GangTaskStats, NS } from "@ns";

export async function main(ns: NS) {
    //shortcut
    const gang = ns.gang;

    const trainLimit = 100;

    const warfareStatReq = 1000; //strength to send someone to war
    const warfareMemReq = 11; //cult members required to prep for war - 1

    const wantedThresh = 0.5; //wanted nerf to become batman
    const penaltyStatReq = 200; //strength to become batman

    const respectThresh = 1e8;

    const spacer = 1000; //ms, time between every check up on the gang

    const budget = 0.1; //percentage of money that we can spend on any equip

    if (!gang.inGang() && !gang.createGang("Slum Snakes")) {
        ns.alert("You forgor you need karma");
        ns.exit();
    }

    const gangNames = [
        "Neo",
        "ZOE",
        "Danielyxe",
        "Mughur",
        "Hydrogenious",
        "d0sboots",
        "xsinx",
        "Jeek",
        "Hydroflame"
    ];
    //Fill up the last of the name list
    for (let stamp = gangNames.length; stamp < 12; stamp++) {
        gangNames.push(`Lakey #${stamp}`);
    }

    //set up constant lists of equipment to buy later
    const everything = gang.getEquipmentNames();
    const reduced = everything.filter((a) => gang.getEquipmentType(a) != "hacking");
    const equipment = reduced.sort((a, b) => gang.getEquipmentCost(a) - gang.getEquipmentCost(b));

    const plans = gang.getTaskNames();

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const members = gang.getMemberNames();
        const snake = gang.getGangInformation();

        //Fill up on members
        while (gang.canRecruitMember()) {
            //get the first name in the list we haven't used already
            const name = gangNames.filter((a) => !members.includes(a))[0];
            gang.recruitMember(name);
            gang.setMemberTask(name, "Train Combat");
            members.push(name);
        }

        //Ascend everyone
        for (const name of members) {
            const result = gang.getAscensionResult(name);
            if (result === undefined) {
                return;
            }
            if (result.str > calculateAscendTreshold(name)) {
                return;
            }
            if (gang.getMemberInformation(name).task != "Territory Warfare") {
                return;
            }
            gang.ascendMember(name);
        }

        //Buy the same item across every member to spend evenly
        for (const equip of equipment) {
            for (const name of members) {
                //buy equipment that costs less than budget% of our money
                if (gang.getEquipmentCost(equip) < ns.getPlayer().money * budget) {
                    gang.purchaseEquipment(name, equip);
                }
            }
        }

        const needsMoney = !ns.isRunning("batcher.js") && !ns.isRunning("corp.js");
        for (const name in members) {
            const member = gang.getMemberInformation(name);

            const goal: (task: string) => number = (task) => {
                const stats = ns.gang.getTaskStats(task);

                //If the member is not ready do not use them
                if (task == "Train Combat" && member.str < trainLimit) {
                    return 1;
                }

                //Warfare
                //TODO Activate territory warfare on some condition
                if (members.length > warfareMemReq && snake.territory < 1) {
                    if (member.str > warfareStatReq && task === "Territory Warfare") {
                        return 1;
                    }
                    return respectGain(snake, member, stats);
                }

                //Penalty, we check for training because other tasks raise penalty
                //TODO use formulas to check penalty drop/gain
                if (snake.wantedPenalty < wantedThresh) {
                    if (task == "Vigilante Justice" && member.str > penaltyStatReq) {
                        return 1;
                    }
                    if (task == "Train Combat") {
                        return 1;
                    }
                    return 0;
                }

                //Money
                if (needsMoney || snake.respect > respectThresh) {
                    return moneyGain(snake, member, stats);
                }

                //Respect
                return respectGain(snake, member, stats);
            };

            //set tasks
            const bestTask = plans.reduce(
                (current, next) => (goal(current) > goal(next) ? current : next),
                "Train Combat"
            );
            gang.setMemberTask(name, bestTask);
        }

        await ns.sleep(spacer);
    }

    /** Used for deciding if an ascension is worthwhile */
    function calculateAscendTreshold(member: string): number {
        const mult = ns.gang.getMemberInformation(member).str_asc_mult;
        if (mult < 1.632) return 1.6326;
        if (mult < 2.336) return 1.4315;
        if (mult < 2.999) return 1.284;
        if (mult < 3.363) return 1.2125;
        if (mult < 4.253) return 1.1698;
        if (mult < 4.86) return 1.1428;
        if (mult < 5.455) return 1.1225;
        if (mult < 5.977) return 1.0957;
        if (mult < 6.496) return 1.0869;
        if (mult < 7.008) return 1.0789;
        if (mult < 7.519) return 1.073;
        if (mult < 8.025) return 1.0673;
        if (mult < 8.513) return 1.0631;
        if (mult < 20) return 1.0591;
        return 1.04;
    }

    /** Wrapper around ns.formulas with hardcoded logic as a backup */
    function moneyGain(gang: GangGenInfo, member: GangMemberInfo, task: GangTaskStats): number {
        if (ns.fileExists("Formulas.exe")) {
            return ns.formulas.gang.moneyGain(gang, member, task);
        }

        if (task.baseMoney === 0 || task.territory == undefined) return 0;
        let statWeight =
            (task.hackWeight / 100) * member.hack +
            (task.strWeight / 100) * member.str +
            (task.defWeight / 100) * member.def +
            (task.dexWeight / 100) * member.dex +
            (task.agiWeight / 100) * member.agi +
            (task.chaWeight / 100) * member.cha;
        statWeight -= 3.2 * task.difficulty;
        if (statWeight <= 0) return 0;
        const territoryMult = Math.max(
            0.005,
            Math.pow(gang.territory * 100, task.territory.money) / 100
        );
        const territoryPenalty = 0.2 * gang.territory + 0.8;
        if (isNaN(territoryMult) || territoryMult <= 0) return 0;
        const respectMult = gang.respect / (gang.respect + gang.wantedLevel);
        return Math.pow(
            11 * task.baseMoney * statWeight * territoryMult * respectMult,
            territoryPenalty
        );
    }

    /** Wrapper around ns.formulas with hardcoded logic as a backup */
    function respectGain(gang: GangGenInfo, member: GangMemberInfo, task: GangTaskStats): number {
        if (ns.fileExists("Formulas.exe")) {
            return ns.formulas.gang.respectGain(gang, member, task);
        }

        if (task.baseRespect === 0 || task.territory == undefined) return 0;
        let statWeight =
            (task.hackWeight / 100) * member.hack +
            (task.strWeight / 100) * member.str +
            (task.defWeight / 100) * member.def +
            (task.dexWeight / 100) * member.dex +
            (task.agiWeight / 100) * member.agi +
            (task.chaWeight / 100) * member.cha;
        statWeight -= 4 * task.difficulty;
        if (statWeight <= 0) return 0;
        const territoryMult = Math.max(
            0.005,
            Math.pow(gang.territory * 100, task.territory.respect) / 100
        );
        const territoryPenalty = 0.2 * gang.territory + 0.8;
        if (isNaN(territoryMult) || territoryMult <= 0) return 0;
        const respectMult = gang.respect / (gang.respect + gang.wantedLevel);
        const value = Math.pow(
            11 * task.baseRespect * statWeight * territoryMult * respectMult,
            territoryPenalty
        );
        return value;
    }
}
