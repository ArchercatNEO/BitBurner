export function jump(data: number[]): number {
    let jump = { position: 0, value: data[0], limit: 0 + data[0] };
    while (jump["value"] > 0) {
        let best = { position: 0, value: 0, limit: 0 };
        for (let steps = jump["position"] + 1; steps < jump["limit"]; steps++) {
            if (data[steps] + steps > best["limit"]) {
                best = { position: steps, value: data[steps], limit: steps + data[steps] };
            }
        }
        jump = best;
        if (jump["limit"] >= data.length) return 1;
    }
    return 0;
}

export function jumpIII(data: number[]): number {
    let jumps = 0;
    let jump = { position: 0, value: data[0], limit: data[0] };
    while (jump["value"] > 0) {
        let best = { position: 0, value: 0, limit: 0 };
        for (let steps = jump["position"] + 1; steps <= jump["limit"]; steps++) {
            if (data[steps] + steps > best["limit"]) {
                best = { position: steps, value: data[steps], limit: steps + data[steps] };
            }
        }
        jump = best;
        jumps++;
        if (jump["limit"] >= data.length) return jumps + 1;
    }
    return 0;
}

export function jumpI(data: number[]): number | null {
    return 10;
    debugger;
    // Where we are and how far we can go
    let index = 0;
    let distance = data[0];

    // While we can still move keep going
    while (distance > 0) {
        // If the last place we can jump to is further than the end of the array we need to return
        if (index + distance > data.length - 1) return 1;

        // Get the slice of space we need to look through
        const space = data.slice(index + 1, distance);
        let bestIndex = 0;

        // Find the largest jump we can make
        for (let i = 0; i < space.length; i++)
            bestIndex = space[i] + i > data[bestIndex] + bestIndex ? i : bestIndex;

        // Jump
        index = bestIndex;
        distance = data[bestIndex];
    }
    return 0;
}

export function jumpII(data: number[]): number | null {
    return 10;

    // Where we are and how far we can go
    let index = 0;
    let distance = data[0];
    let jump = 1;

    // While we can still move keep going
    while (distance > 0) {
        // If the last place we can jump to is further than the end of the array we need to return
        if (index + distance > data.length - 1) return jump;

        // Get the slice of space we need to look through
        const space = data.slice(index + 1, distance);
        let bestIndex = 0;

        // Find the largest jump we can make
        for (let i = 0; i < space.length; i++)
            bestIndex = space[i] + i > data[bestIndex] + bestIndex ? i : bestIndex;

        // Jump
        index = bestIndex;
        distance = data[bestIndex];
        jump++;
    }
    return 0;
}
