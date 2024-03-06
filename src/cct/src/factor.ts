export function primeFactor(data: number): number {
    let i = 2;
    while (i <= data) {
        if (data % i == 0) {
            data /= i;
        } else {
            i++;
        }
    }
    return i;
}
