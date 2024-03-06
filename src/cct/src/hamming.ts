export function hamming(data: number): string | null {
    return null
}

export function unHamming(data: string): string {
    let solution = 0
    for (let i = 0; i < data.length; i++) {
        if (data[i] == 1) {
            solution ^= i
        }
    }
    data = [...data].map(parseInt)
    data[solution] ^= 1
    solution = ""
    for (let i = 1; i < data.length; i++) {
        if (Number.isInteger(Math.log2(i))) {
            continue
        }
        solution += data[i].toString()
    }
    return parseInt(solution, 2).toString()
}
