// find how many paths made of values contained in the array there are to reach given value;
// eg     val 4  with arr [1,2] -> 1111, 22, 112, 121, 211 so 5 ways
// solve([1,2,5], 8) = 44
var solve = (arr, val) => {
    // dp says how many ways there are to get ith number - dp[i] = num of ways -> dp[0] = 1
    let dp = [1, ...[...Array(val)].map(() => 0)];
    for (let i = 1; i <= val; i++) {
        for (let a of arr) {
            if (a > i) {
                continue;
            }
            dp[i] += dp[i - a];
        }
    }

    return dp[val];
};

// find the least amount of required values contained in the array to reach given value;
// eg     val 4  with arr [1,2] -> 1111, 22, 112, 121, 211 , least values is 2 (2, 2)
// eg     val 13 with arr [5, 2, 1] => 5 + 5 + 2 + 1 = 13 - the least amount of values

// solve([1,2,5], 8) = 3   (1 + 2 + 5) -> fastest
var solve = (arr, val) => {
    // dp says how many values it takes to create ith value - dp[i] = -> dp[0] = 0
    let dp = [0, ...[...Array(val)].map(() => 10000)];
    for (let i = 1; i <= val; i++) {
        for (let a of arr) {
            if (a > i) {
                continue;
            }
            dp[i] = dp[i] > dp[i - a] + 1 ? dp[i - a] + 1 : dp[i];
        }
    }

    return dp[val];
};

// you are given denominations of coins and the target amount of N.
// WHAT IS the number of ways to make up amount N
// keep in mind that paths [1, 5, 5] and [5, 1, 5] are considered the same,
// so they are not supposed to be counted twice

// solve([1,2,5], 8) = 7
var solve = (arr, val) => {
    let maxNom = arr.reduce((max, curr) => (curr > max ? (max = curr) : max), -1);
    let dp = [...[...Array(val + 1)].map((a, i) => [...Array(maxNom + 1)].map(() => (i === 0 ? 1 : 0)))];

    for (let k = 0; k < arr.length; k++) {
        let a = arr[k];
        let prevA = k > 0 ? arr[k - 1] : 0;
        for (let i = 1; i <= val; i++) {
            if (prevA > 0) {
                dp[i][a] += dp[i][prevA];
            }
            if (a > i) {
                continue;
            }

            dp[i][a] += dp[i - a][a];
        }
    }

    return dp[val].reduce((max, curr) => (curr > max ? (max = curr) : max), 0);
};

// you are given denominations of coins and the target amount of N.
// print all of the ways to make up amount N
// keep in mind that paths [1, 5, 5] and [5, 1, 5] are considered the same,
// so they are not supposed to be counted twice
var solve = (arr, val) => {
    let maxNom = arr.reduce((max, curr) => (curr > max ? (max = curr) : max), -1);
    let dp = [...[...Array(val + 1)].map((a, i) => [...Array(maxNom + 1)].map(() => (i === 0 ? [[]] : [])))];

    for (let k = 0; k < arr.length; k++) {
        let a = arr[k];
        let prevA = k > 0 ? arr[k - 1] : 0;
        for (let i = 1; i <= val; i++) {
            if (prevA > 0) {
                dp[i][a] = [...dp[i][a], ...dp[i][prevA]];
            }
            if (a > i) {
                continue;
            }

            dp[i][a] = [...dp[i][a], ...dp[i - a][a].map(arr => [...arr, a])];
        }
    }

    return dp[val].reduce((max, curr) => (curr.length > max.length ? (max = curr) : max), []);
};
