// normal binary search
var solution = (arr, target) => {
    const n = arr.length;
    let l = 0;
    let r = n - 1;

    while (l <= r) {
        let mid = l + Math.floor((r - l) / 2);

        if (arr[mid] === target) return mid;

        if (arr[mid] < target) l = mid + 1;
        else r = mid - 1;
    }

    return -1;
};

// is x a square  - dont use square root  -> 16 - yes,   20 - no
var solve = x => {
    let arr = [];
    for (let i = 1; i <= x; i++) {
        arr.push(i);
    }

    const n = arr.length;
    let l = 0;
    let r = n - 1;

    while (l <= r) {
        let mid = l + Math.floor((r - l) / 2);

        let sq = arr[mid] * arr[mid];
        if (sq === x) return mid;

        if (sq < x) {
            l = mid + 1;
        } else {
            r = mid - 1;
        }
    }

    return -1;
};
