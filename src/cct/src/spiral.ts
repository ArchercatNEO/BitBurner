export function spiralize(data: number[][]): null | number[] {
    return null;
    const flatMap: number[] = [];

    let [x, y] = [0, 0];
    let leftLimit = -1;
    let rightLimit = data[0].length;
    let upLimit = 0;
    let downLimit = data.length;
    const area = downLimit * rightLimit;
    rightLimit--;
    downLimit--;

    while (flatMap.length < area) {
        for (leftLimit++; x < rightLimit; x++) {
            push();
        } //right
        if (isInvalid()) {
            break;
        }
        for (upLimit++; y < downLimit; y++) {
            push();
        } //down
        if (isInvalid()) {
            break;
        }
        for (rightLimit--; x > leftLimit; x--) {
            push();
        } //left
        if (isInvalid()) {
            break;
        }
        for (downLimit--; y > upLimit; y--) {
            push();
        } //up
    }
    //flatMap.push(data[y][x])
    console.log(data);
    console.log(area);
    console.log(flatMap);

    return flatMap;

    function push() {
        flatMap.push(data[y][x]);
    }

    function isInvalid() {
        // eslint-disable-next-line no-debugger
        debugger;
        return leftLimit < x && x < rightLimit && upLimit < y && y < downLimit;
    }
}
