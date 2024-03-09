import { NS } from "@ns";

/**
 * Wrapper around exec to strongly type parameters
 */
export function execHack(
    ns: NS,
    host: string,
    threads: number,
    target: string,
    weakenTime: number,
    id: number
) {
    ns.exec("/workers/hack.js", host, threads, target, weakenTime, id);
}

/**
 * Wrapper around exec to strongly type parameters
 */
export function execGrow(
    ns: NS,
    host: string,
    threads: number,
    target: string,
    weakenTime: number,
    id: number
) {
    ns.exec("/workers/grow.js", host, threads, target, weakenTime, id);
}

/**
 * Wrapper around exec to strongly type parameters
 */
export function execWeaken(
    ns: NS,
    host: string,
    threads: number,
    target: string,
    weakenTime: number,
    id: number
) {
    ns.exec("/workers/weaken.js", host, threads, target, weakenTime, id);
}
