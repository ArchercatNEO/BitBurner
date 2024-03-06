export function paint(x: any, color: string) {
    // x = what you want colored
    let y;
    switch (color) {
        case "black":
            y = `\u001b[30m${x}\u001b[0m`;
            break;
        case "red":
            y = `\u001b[31m${x}\u001b[0m`;
            break;
        case "green":
            y = `\u001b[32m${x}\u001b[0m`;
            break;
        case "yellow":
            y = `\u001b[33m${x}\u001b[0m`;
            break;
        case "blue":
            y = `\u001b[34m${x}\u001b[0m`;
            break;
        case "magenta":
            y = `\u001b[35m${x}\u001b[0m`;
            break;
        case "cyan":
            y = `\u001b[36m${x}\u001b[0m`;
            break;
        case "white":
            y = `\u001b[37m${x}\u001b[0m`;
            break;
        default:
            y = `\u001b[38;5;${color}m${x}\u001b[0m`;
    }
    return y;
}
