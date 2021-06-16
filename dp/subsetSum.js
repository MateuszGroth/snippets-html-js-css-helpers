// find out if a set contains a subset of which sum is equal to given value

var solution = (arr, sum) => {
    let mask = 1;

    // mask is like 000001
    // when element of an array is for example 3, then mask becomes  001001, which means you can achieve 3 and 0

    for (let i = 0; i < arr.length; i++) {
        mask |= mask << arr[i];
    }

    return !!(mask & (1 << sum));
};
