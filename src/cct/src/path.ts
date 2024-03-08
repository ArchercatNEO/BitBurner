export function mapPathI(data: [number, number]): number {
    const total = data[0] + data[1] - 2;

    return factorial(total) / (factorial(total - data[0] + 1) * factorial(data[0] - 1));
}

function factorial(x: number) {
    let fact = 1;
    for (let i = 1; i <= x; i++) {
        fact *= i;
    }
    return fact;
}

export function mapPathII(data: number[][]): number | null {
    return null;
}
