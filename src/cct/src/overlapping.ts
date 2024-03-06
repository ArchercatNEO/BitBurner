export function overlap(data: number[][]): null {
    return null
    data.sort((a, b) => a[0] - b[0])
    for (let i = 0; data[i] != null; i++) {
        if (data.length >= 1)
            while (data[i][1] >= data[i + 1][0]) {
                data.splice(i, 2, [
                    Math.min(data[i][0], data[i + 1][0]),
                    Math.max(data[i][1], data[i + 1][1])
                ])
                if (data.length == 1) break
            }
    }
    return data
}
