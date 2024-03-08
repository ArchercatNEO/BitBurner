export function hamming(data: number): string | null {
    return null;
}

export function unHamming(data: string): string | null {
    return null;

    const bitSize = Math.ceil(Math.log2(data.length));
    const number = parseInt(data, 2);

    let parity = 0;
    for (let i = 1; i < bitSize; i++) {
        parity ^= number & (1 << i);
    }

    return number.toString(2);
}
