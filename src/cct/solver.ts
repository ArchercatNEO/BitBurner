import { NS } from "@ns";
import { paint } from "/functions";
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

export function solve(ns: NS, fileName: string, server: string): void {
    const contract = ns.codingcontract.getContractType(fileName, server);
    const data = ns.codingcontract.getData(fileName, server);
    ns.tprint(contract);
    const solution = solved[contract](data);

    if (solution === null) {
        //ns.tprint(contract + " has not been solved and was skipped");
        return;
    }
    //ns.tprint(`Attempting ${solution} for ${contract} on ${server}`);
    //ns.tprint(ns.codingcontract.attempt(solution, fileName, server));
}

export function test(ns: NS, cctType: string) {
    let count = 0;

    for (let i = 0; i < 10; i++) {
        ns.codingcontract.createDummyContract(cctType);
        const contract = ns.ls("home", ".cct")[0];
        const data = ns.codingcontract.getData(contract, "home");
        const solution = solved[cctType](data);

        if (solution === null) {
            ns.tprint(`ERROR: ${cctType} is not finished. Ending execution`);
            ns.ls("home", ".cct").forEach((cct) => ns.rm(cct, "home"));
            return true;
        }

        const result = ns.codingcontract.attempt(solution, contract, "home");
        if (result !== "") count++;
    }

    const colour = count == 0 ? "red" : count < 10 ? "yellow" : "cyan";
    ns.tprintf(paint(`${cctType} has been sucsessfully solved ${count}/10 times`, colour));
    //ns.tprintf("Destroying remaining contracts");
    ns.ls("home", ".cct").forEach((cct) => ns.rm(cct, "home"));
    return false;
}

interface solver {
    [index: string]: (data: any) => number | string | any[] | null;
}

const solved: solver = {
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
