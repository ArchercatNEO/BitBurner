export function sumsI(data: number): number {
    const coefficient = [1].concat(Array(data).fill(0));

    for (let term = 1; term < data; term++) {
        for (let subgoal = 0; subgoal + term <= data; subgoal++) {
            coefficient[subgoal + term] += coefficient[subgoal];
        }
    }

    return coefficient[data];
}

export function sumsII(data: [number, number[]]): number {
    const [target, powers] = data;
    const coefficient = [1].concat(Array(target).fill(0));

    for (const term of powers) {
        for (let subgoal = 0; subgoal + term <= target; subgoal++) {
            coefficient[subgoal + term] += coefficient[subgoal];
        }
    }

    return coefficient[target];
}
