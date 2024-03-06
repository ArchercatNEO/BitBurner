export function subarray(data: number[]): null | number {
    for (let i = 1; i < data.length; i++) {
        while (Math.sign(data[i - 1]) * Math.sign(data[i]) == 1)
            data.splice(i - 1, 2, data[i - 1] + data[i]);
    }

    if (data[0] < 0) data.shift();
    let subarray = 0;
    for (let i = 0; i < data.length; i += 2) {
        let total = data[i];
        for (let j = i; j < data.length; j += 2) {
            subarray = Math.max(subarray, total);
            if (data[j + 1] == undefined || data[j + 1] + total < 0) {
                i = j + 2;
                break;
            }
            total += data[j] + data[j + 1];
        }
    }

    console.log(data);
    console.log(subarray);

    return subarray;
}
