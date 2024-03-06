import { NS } from "@ns"
import { findRam } from "/functions"

/**
 * Wrapper around exec to strongly type parameters
 */
export function execHack(ns: NS, threads: number, target: string, weakenTime: number, id: number) {
    const usedRam = ns.getServerUsedRam(findRam(ns))
    const maxRam = ns.getServerMaxRam(findRam(ns))
    const avalibleThreads = (maxRam - usedRam) / ns.getScriptRam("/workers/hack.js")
    const lowerThreads = Math.min(avalibleThreads, threads)
    const usedThreads = Math.floor(lowerThreads)
    
    if (usedThreads > 0) ns.exec("/workers/hack.js", findRam(ns), usedThreads, weakenTime, target, id)
    return usedThreads
}

/**
 * Wrapper around exec to strongly type parameters
 */
export function execGrow(ns: NS, target: string, weakenTime: number, threads: number, id: number) {
    const usedRam = ns.getServerUsedRam(findRam(ns))
    const maxRam = ns.getServerMaxRam(findRam(ns))
    const avalibleThreads = (maxRam - usedRam) / ns.getScriptRam("/workers/grow.js")
    const lowerThreads = Math.min(avalibleThreads, threads)
    const usedThreads = Math.floor(lowerThreads)
    if (usedThreads > 0)
    ns.exec("/workers/grow.js", findRam(ns), usedThreads, weakenTime, target, id)
    return usedThreads
}

/**
 * Wrapper around exec to strongly type parameters
 */
export function execWeaken(
    ns: NS,
    target: string,
    weakenTime: number,
    threads: number,
    id: number
) {
    const usedRam = ns.getServerUsedRam(findRam(ns))
    const maxRam = ns.getServerMaxRam(findRam(ns))
    const avalibleThreads = (maxRam - usedRam) / ns.getScriptRam("/workers/weaken.js")
    const lowerThreads = Math.min(avalibleThreads, threads)
    const usedThreads = Math.floor(lowerThreads)
    if (usedThreads > 0)
    ns.exec("/workers/weaken.js", findRam(ns), usedThreads, weakenTime, target, id)
    return usedThreads
}
