export function triangleMap(data: number[][]) {
    for (let floor = data.length - 1; floor > 0; floor--) {
        for (let i = 0; i < data[floor].length - 1; i++) {
            data[floor - 1][i] += Math.min(data[floor][i], data[floor][i + 1])
        }
    }
    return data[0][0]
}
