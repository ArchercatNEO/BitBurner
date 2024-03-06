export function mapPathI(data: [number, number]) {
    const total = data[0] + data[1] - 2
    function factorial(x) {
        let fact = 1
        for (let i = 1; i <= x; i++) {
            fact *= i
        }
        return fact
    }
    return factorial(total) / (factorial(total - data[0] + 1) * factorial(data[0] - 1))
}

export function mapPathII(data: number[][]) {
    return null
}
