import { Server } from "@ns"

export class RealServerStats {
    public backdoorInstalled: boolean;
    public baseDifficulty: number;
    public hackDifficulty: number;
    public minDifficulty: number;
    public moneyAvailable: number;
    public moneyMax: number;
    public numOpenPortsRequired: number;
    public openPortCount: number;
    public requiredHackingSkill: number;
    public serverGrowth: number;

    constructor(server: Server) {
        if (server.backdoorInstalled === undefined) { throw new Error("Not a server"); }
        this.backdoorInstalled = server.backdoorInstalled
        if (server.baseDifficulty === undefined) { throw new Error("Not a server"); }
        this.baseDifficulty = server.baseDifficulty
        if (server.hackDifficulty === undefined) { throw new Error("Not a server"); }
        this.hackDifficulty = server.hackDifficulty
        if (server.minDifficulty === undefined) { throw new Error("Not a server"); }
        this.minDifficulty = server.minDifficulty
        if (server.moneyAvailable === undefined) { throw new Error("Not a server"); }
        this.moneyAvailable = server.moneyAvailable
        if (server.moneyMax === undefined) { throw new Error("Not a server"); }
        this.moneyMax = server.moneyMax
        if (server.numOpenPortsRequired === undefined) { throw new Error("Not a server"); }
        this.numOpenPortsRequired = server.numOpenPortsRequired
        if (server.openPortCount === undefined) { throw new Error("Not a server"); }
        this.openPortCount = server.openPortCount
        if (server.requiredHackingSkill === undefined) { throw new Error("Not a server"); }
        this.requiredHackingSkill = server.requiredHackingSkill
        if (server.serverGrowth === undefined) { throw new Error("Not a server"); }
        this.serverGrowth = server.serverGrowth
    }
}

export interface HacknetServer extends Server {
    isHacknetServer: undefined;
    backdoorInstalled: undefined;
    baseDifficulty: undefined;
    hackDifficulty: undefined;
    minDifficulty: undefined;
    moneyAvailable: undefined;
    moneyMax: undefined;
    numOpenPortsRequired: undefined;
    openPortCount: undefined;
    requiredHackingSkill: undefined;
    serverGrowth: undefined;
}