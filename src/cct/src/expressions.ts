export function allValidExpressions(data: string): null | string[] {
    return null

    const number = data[0]
    const spaces = number.length - 1
    const target = data[1]
    const operators = {
        "0": "",
        "1": "+",
        "2": "-",
        "3": "*"
    }
    const solutions = []
    for (let i = 0; i < 4 ** spaces; i++) {
        let test = ""
        i = i.toString(4)
        i = "0".repeat(spaces - i.length) + i
        for (let k = 0; k < spaces; k++) {
            test += number[k] + operators[i[k]]
        }
        test += number[number.length - 1]
        try {
            if (eval(test) == target) solutions.push(test)
        } catch {}
        i = parseInt(i, 4)
    }
    return solutions
}
