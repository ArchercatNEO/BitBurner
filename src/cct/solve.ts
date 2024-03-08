import { NS } from "@ns";
import { allValidExpressions } from "/cct/src/expressions";
import { compressI, compressII, compressIII } from "/cct/src/compress";
import { encryptI, encryptII } from "/cct/src/encrypt";
import { hamming, unHamming } from "/cct/src/hamming";
import { primeFactor } from "/cct/src/factor";
import { ipify } from "/cct/src/ip";
import { overlap } from "/cct/src/overlapping";
import { triangleMap } from "/cct/src/triangle";
import { mapPathI, mapPathII } from "/cct/src/path";
import { link } from "/cct/src/graph";
import { jumpI, jumpII } from "/cct/src/jump";
import { santitize } from "/cct/src/sanitize";
import { spiralize } from "/cct/src/spiral";
import { subarray } from "/cct/src/subarray";
import { stockI, stockII, stockIII, stockIV } from "/cct/src/stocks";
import { shortcut } from "/cct/src/shortcut";
import { sumsI, sumsII } from "/cct/src/sums";
import { getAllServers } from "/lib/servers";
import { Dictionary } from "/lib/generics";

/**
 * Solve every contract on every server
 * Use with ns.run.
 */
export async function main(ns: NS) {
    for (const server of getAllServers(ns)) {
        const contracts = ns.ls(server, ".cct")
        ns.tprint(`Solving [${contracts.length}] contracts on [${server}]`)
        await ns.sleep(10)
        
        for (const cct of contracts) {
            const type = ns.codingcontract.getContractType(cct, server);
            ns.tprint(`Solving ${type}`)
            
            solve(ns, cct, server);
        }
    }
}

export enum ContractError {
    NotImplemented,
    ContractFailed
}

export function solve(ns: NS, fileName: string, server: string): ContractError | null {
    const contract = ns.codingcontract.getContractType(fileName, server);
    const data = ns.codingcontract.getData(fileName, server);
    const solution = solved[contract](data);

    if (solution === null) {
        return ContractError.NotImplemented;
    }

    const result = ns.codingcontract.attempt(solution, fileName, server);
    if (!result) {
        return ContractError.ContractFailed;
    }

    return null;
}

const solved: Dictionary<string, (data: any) => number | string | any[] | null> = {
    "Find Largest Prime Factor": primeFactor,
    "Subarray with Maximum Sum": subarray, // Nulled
    "Total Ways to Sum": sumsI,
    "Total Ways to Sum II": sumsII,
    "Spiralize Matrix": spiralize, //nulled
    "Array Jumping Game": jumpI,
    "Array Jumping Game II": jumpII,
    "Merge Overlapping Intervals": overlap,
    "Generate IP Addresses": ipify, //nulled
    "Algorithmic Stock Trader I": stockI,
    "Algorithmic Stock Trader II": stockII,
    "Algorithmic Stock Trader III": stockIII, //nulled
    "Algorithmic Stock Trader IV": stockIV, //nulled
    "Minimum Path Sum in a Triangle": triangleMap,
    "Unique Paths in a Grid I": mapPathI,
    "Unique Paths in a Grid II": mapPathII, //nulled
    "Shortest Path in a Grid": shortcut, //nulled
    "Sanitize Parentheses in Expression": santitize, //nulled
    "Find All Valid Math Expressions": allValidExpressions,
    "HammingCodes: Integer to Encoded Binary": hamming, //nulled
    "HammingCodes: Encoded Binary to Integer": unHamming,
    "Proper 2-Coloring of a Graph": link, //nulled
    "Compression I: RLE Compression": compressI,
    "Compression II: LZ Decompression": compressII, //nulled
    "Compression III: LZ Compression": compressIII, //nulled
    "Encryption I: Caesar Cipher": encryptI,
    "Encryption II: Vigenère Cipher": encryptII
};
