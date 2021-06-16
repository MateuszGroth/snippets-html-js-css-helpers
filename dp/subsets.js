// go through all of the subsets of given set

var test = arr => {
    const n = arr.length;
    const maxMask = Math.pow(2, n);
    for (let mask = 0; mask < maxMask; mask++) {
        const subset = [];
        for (let i = 0; i < n; i++) {
            if (mask & (1 << i)) subset.push(i);
        }
    }
};
