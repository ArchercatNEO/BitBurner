export function allValidExpressions(data: string): null | string[] {
    return null;

    const number = data[0];
    const target = data[1];

    const spaces = number.length - 1;
    const operators = ["", "+", "-", "*"];

    const solutions = [];
    for (let i = 0; i < 4 ** spaces; i++) {
        let test = "";
        let stringIndex = i.toString(4);
        stringIndex = stringIndex.padStart(spaces, "0");
        for (let k = 0; k < spaces; k++) {
            const idx = parseInt(stringIndex[k]);
            test += number[k] + operators[idx];
        }
        test += number[number.length - 1];
        try {
            if (eval(test) == target) {
                solutions.push(test);
            }
            // eslint-disable-next-line no-empty
        } catch {}
    }
    return solutions;
}
