export function encryptI(data: [string, number]): string {
    const plainText = data[0];
    const shift = data[1];
    
    let encryption = "";
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
    for (const i in Array(plainText)) {
        const index = parseInt(i);
        const plainChar = plainText.charCodeAt(index) - 65 //65 is A's ASCII value
        const keyChar = key.charCodeAt(index) - 65
        encryption += String.fromCharCode(
            ((plainChar + keyChar) % 26) + 65
        );
    }
    return encryption;
}
