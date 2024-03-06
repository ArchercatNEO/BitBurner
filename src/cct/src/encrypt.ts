export function encryptI(data: (string | number)[]): string {
    let encryption = "";
    const plainText = data[0] as string;
    const shift = data[1] as number;

    for (const letter of plainText) {
        const shifted = (letter.charCodeAt(0) - shift - 39) % 26;
        if (shifted < 0) {
            encryption += " ";
            continue;
        }
        encryption += String.fromCharCode(shifted + 65);
    }
    return encryption;
}

export function encryptII(data: string[]): string {
    const plainText = data[0];
    const key = data[1].repeat(20);

    let encryption = "";
    for (const i in plainText) {
        const index = parseInt(i);
        encryption += String.fromCharCode(
            ((plainText.charCodeAt(index) + key.charCodeAt(index) - 130) % 26) + 65
        );
    }
    return encryption;
}
