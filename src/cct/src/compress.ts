export function compressI(data: string) {
    let solution = ""
    for (let i = 0, extra; i < data.length; i += extra) {
        for (extra = 1; extra + i < data.length && data[i] == data[i + extra]; extra++) {
            continue
        }
        if (extra > 9) {
            solution += "9" + data[i]
            solution += `${extra - 9}` + data[i]
        } else solution += `${extra}` + data[i]
    }
    return solution
}

export function compressII(data: string): string | null {
    return null
}

export function compressIII(data: string): string | null {
    return null
}
