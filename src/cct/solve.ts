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

/**
 * Solve every contract on every server
 * Use with ns.run.
 */
export async function main(ns: NS) {
    for (const server of getAllServers(ns)) {
        const contracts = ns.ls(server, ".cct");
        ns.tprint(`Solving [${contracts.length}] contracts on [${server}]`);
        await ns.sleep(10);

        for (const cct of contracts) {
            const type = ns.codingcontract.getContractType(cct, server);
            ns.tprint(`Solving ${type}`);

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
    const solution = solveContract(contract, data);

    if (solution === null) {
        return ContractError.NotImplemented;
    }

    const result = ns.codingcontract.attempt(solution, fileName, server);
    if (!result) {
        return ContractError.ContractFailed;
    }

    return null;
}

function solveContract(type: string, data: any): number | string | any[] | null {
    switch (type) {
        case "Find Largest Prime Factor": return primeFactor(data)
        case "Subarray with Maximum Sum": return subarray(data)
        case "Total Ways to Sum": return sumsI(data)
        case "Total Ways to Sum II": return sumsII(data)
        case "Spiralize Matrix": return spiralize(data) //nulled
        case "Array Jumping Game": return jumpI(data)
        case "Array Jumping Game II": return jumpII(data)
        case "Merge Overlapping Intervals": return overlap(data)    
        case "Generate IP Addresses": return ipify(data) //nulled
        case "Algorithmic Stock Trader I": return stockI(data)
        case "Algorithmic Stock Trader II": return stockII(data)
        case "Algorithmic Stock Trader III": return stockIII(data) //nulled
        case "Algorithmic Stock Trader IV": return stockIV(data) //nulled
        case "Minimum Path Sum in a Triangle": return triangleMap(data)
        case "Unique Paths in a Grid I": return mapPathI(data)
        case "Unique Paths in a Grid II": return mapPathII(data) //nulled
        case "Shortest Path in a Grid": return shortcut(data) //nulled
        case "Sanitize Parentheses in Expression": return santitize(data)//nulled
        case "Find All Valid Math Expressions": return allValidExpressions(data)    
        case "HammingCodes: Integer to Encoded Binary": return hamming(data) //nulled
        case "HammingCodes: Encoded Binary to Integer": return unHamming(data)
        case "Proper 2-Coloring of a Graph": return link(data)//nulled
        case "Compression I: RLE Compression": return compressI(data)    
        case "Compression II: LZ Decompression": return compressII(data)//nulled
        case "Compression III: LZ Compression": return compressIII(data)//nulled
        case "Encryption I: Caesar Cipher":   return encryptI(data)    
        case "Encryption II: Vigenère Cipher":  return encryptII(data)
        default: throw new Error("Unkown contract type")
    }
}
