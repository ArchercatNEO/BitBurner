import { GangMemberInfo, GangTaskStats, NS } from "@ns"

export async function main(ns: NS) {
    //shortcut
    const gang = ns.gang

    const trainLimit = 100

    const warfareStatReq = 1000 //strength to send someone to war
    const warfareMemReq = 11 //cult members required to prep for war - 1
    const clashChanceReq = 0.55 //chance we wait for to declare war

    const wantedThresh = 0.5 //wanted nerf to become batman
    const penaltyStatReq = 200 //strength to become batman

    const respectThresh = 1e8

    const spacer = 1000 //ms, time between every check up on the gang

    const budget = 0.1 //percentage of money that we can spend on any equip

    if (!gang.inGang() && !gang.createGang("Slum Snakes")) {
        ns.alert("You forgor you need karma")
        ns.exit()
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
    ]
    //Fill up the last of the name list
    for (let stamp = gangNames.length; stamp < 12; stamp++) gangNames.push(`Lakey #${stamp}`)

    //set up constant lists of equipment to buy later
    const everything = gang.getEquipmentNames()
    const reduced = everything.filter((a) => gang.getEquipmentType(a) != "hacking")
    const equipment = reduced.sort((a, b) => gang.getEquipmentCost(a) - gang.getEquipmentCost(b))

    const plans = gang.getTaskNames()

    // eslint-disable-next-line no-constant-condition
    while (true) {
        //fill up on lakeys
        while (gang.canRecruitMember()) {
            //get the first name in the list we haven't used already
            const name = gangNames.filter((a) => !gang.getMemberNames().includes(a))[0]
            gang.recruitMember(name)
            gang.setMemberTask(name, "Train Combat")
        }

        const members = gang.getMemberNames()

        //reset gang information
        const snake = gang.getGangInformation()
        let goal: (task, member) => unknown

        //ascend everyone
        for (const name of members) {
            if (
                gang.getAscensionResult(name) != undefined &&
                gang.getAscensionResult(name).str > calculateAscendTreshold(name) &&
                gang.getMemberInformation(name).task != "Territory Warfare"
            )
                gang.ascendMember(name)
        }
        //I need smarts to set goal smartly
        //gang warfare
        if (members.length > warfareMemReq && snake.territory < 1) {
            goal = warfare
            //if (gang.getChanceToWinClash() > clashChanceReq)
            //gang.setTerritoryWarfare(true)
        } else if (snake.wantedPenalty < wantedThresh) goal = penalty
        else if (lackMoney() || (snake.respect > respectThresh && snake.territory == 1))
            goal = money
        else goal = respect

        for (const name of members) {
            if (gang.getAscensionResult(name) > calculateAscendTreshold(name))
                gang.ascendMember(name)
        }
        //buy the same equip for all lakeys then move on to the next eqip
        for (const equip of equipment)
            for (const name of members) {
                const member = gang.getMemberInformation(name)

                //buy equipment that costs less than budget% of our money
                if (gang.getEquipmentCost(equip) < ns.getPlayer().money * budget)
                    gang.purchaseEquipment(name, equip)

                //set tasks
                const bestTask = plans.reduce(
                    (a, b) => (goal(a, member) > goal(b, member) ? a : b),
                    "Train Combat"
                )
                gang.setMemberTask(name, bestTask)
            }

        await ns.sleep(spacer)
    }

    function lackMoney() {
        return !ns.isRunning("batcher.js") || !ns.isRunning("corp.js")
    }
    function calculateAscendTreshold(member: string) {
        const mult = ns.gang.getMemberInformation(member).str_asc_mult
        if (mult < 1.632) return 1.6326
        if (mult < 2.336) return 1.4315
        if (mult < 2.999) return 1.284
        if (mult < 3.363) return 1.2125
        if (mult < 4.253) return 1.1698
        if (mult < 4.86) return 1.1428
        if (mult < 5.455) return 1.1225
        if (mult < 5.977) return 1.0957
        if (mult < 6.496) return 1.0869
        if (mult < 7.008) return 1.0789
        if (mult < 7.519) return 1.073
        if (mult < 8.025) return 1.0673
        if (mult < 8.513) return 1.0631
        if (mult < 20) return 1.0591
        return 1.04
    }

    function penalty(task: string, member: GangMemberInfo) {
        if (task == "Train Combat" && member.str < penaltyStatReq) return 1
        if (task == "Vigilante Justice" && member.str > penaltyStatReq) return 1
        return 0
    }

    function warfare(task: string, member: GangMemberInfo) {
        if (member.str < warfareStatReq) return respect(task, member)
        if (task == "Territory Warfare") return 1
        return 0
    }

    //pull from formulas.exe source code
    function respect(task: string, member: GangMemberInfo) {
        if (member.str < trainLimit) {
            if (task == "Train Combat") return 1
            return 0
        }

        const stats = gang.getTaskStats(task)
        if (stats.baseRespect === 0 || stats.territory == undefined) return 0
        let statWeight =
            (stats.hackWeight / 100) * member.hack +
            (stats.strWeight / 100) * member.str +
            (stats.defWeight / 100) * member.def +
            (stats.dexWeight / 100) * member.dex +
            (stats.agiWeight / 100) * member.agi +
            (stats.chaWeight / 100) * member.cha
        statWeight -= 4 * stats.difficulty
        if (statWeight <= 0) return 0
        const territoryMult = Math.max(
            0.005,
            Math.pow(snake.territory * 100, stats.territory.respect) / 100
        )
        const territoryPenalty = 0.2 * snake.territory + 0.8
        if (isNaN(territoryMult) || territoryMult <= 0) return 0
        const respectMult = snake.respect / (snake.respect + snake.wantedLevel)
        const value = Math.pow(
            11 * stats.baseRespect * statWeight * territoryMult * respectMult,
            territoryPenalty
        )
        return value
    }

    function money(task, member) {
        if (member.str < trainLimit) {
            if (task == "Train Combat") return 1
            return 0
        }
        task = gang.getTaskStats(task)
        if (task.baseMoney === 0 || task.territory == undefined) return 0
        const statWeight =
            (task.hackWeight / 100) * member.hack +
            (task.strWeight / 100) * member.str +
            (task.defWeight / 100) * member.def +
            (task.dexWeight / 100) * member.dex +
            (task.agiWeight / 100) * member.agi +
            (task.chaWeight / 100) * member.cha
        statWeight -= 3.2 * task.difficulty
        if (statWeight <= 0) return 0
        const territoryMult = Math.max(
            0.005,
            Math.pow(snake.territory * 100, task.territory.money) / 100
        )
        const territoryPenalty = 0.2 * snake.territory + 0.8
        if (isNaN(territoryMult) || territoryMult <= 0) return 0
        const respectMult = snake.respect / (snake.respect + snake.wantedLevel)
        return Math.pow(
            11 * task.baseMoney * statWeight * territoryMult * respectMult,
            territoryPenalty
        )
    }
}
