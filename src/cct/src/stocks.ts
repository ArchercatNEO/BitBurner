export function stockI(data: number[]) {
    return null;
    const sales = [];
    let stock = 0;
    for (let day = 0; day < data.length; day = stock + 1) {
        const sale = [];
        for (let sign = 1; sign > -2; sign -= 2) {
            while (sign * data[stock] > sign * data[stock + 1]) {
                stock++;
            }
            sale.push(data[stock]);
        }
        sale.push(sale[1] - sale[0]);
        sales.push(sale);
    }
    for (let batch = 0; batch < sales.length; batch++)
        try {
            while (sales[batch][0] < sales[batch + 1][0]) {
                sales.splice(batch, 2, [
                    sales[batch][0],
                    Math.max(sales[batch][1], sales[batch + 1][1]),
                    Math.max(sales[batch][1], sales[batch + 1][1]) - sales[batch][0]
                ]);
            }
        } catch {
            break;
        }

    return Math.max(...sales.map((a) => a[2]));
}

export function stockII(data: number[]) {
    return null;
    const sales = [];
    let stock = 0;
    for (let day = 0; day < data.length; day = stock + 1) {
        const sale = [];
        for (let sign = 1; sign > -2; sign -= 2) {
            while (sign * data[stock] > sign * data[stock + 1]) {
                stock++;
            }
            sale.push(data[stock]);
        }
        sale.push(sale[1] - sale[0]);
        sales.push(sale);
    }
    let total = 0;
    for (const i of sales.map((a) => a[2])) {
        total += i;
    }
    return total;
}

export function stockIII(data: number[]): null {
    return null;
}

export function stockIV(data: [number, number[]]): null {
    return null;
}
