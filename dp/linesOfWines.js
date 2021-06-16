// you are given array with prices of wines - example [2, 4, 6, 2, 5] (64 is the answer)
// each year you can either sell a wine on the left edge or on the right edge (you cant sell wines from the inside)
// value of each wine sold is multiplied by the number of years it was waiting to be sold
// eg. we choose to sell the left edge wine on the first year so 2*1, again left side wine on the 2nd year, so 4*2
// right side wine on the 3rd year, so 6*3 etc.

// top to bottom
// dp[l][r] = price of all of the wines between l and r, so dp[1][3] is the money you get for selling wines: 1,2,3
var solution = arr => {
    const n = arr.length;
    let dp = [...Array(n)].map(() => [...Array(n)].map(() => 0));
    for (let l = n - 1; l >= 0; l--) {
        for (let r = l; r < n; r++) {
            let y = l + n - r;
            if (l == n - 1) {
                dp[l][r] = arr[l] * y;
                continue;
            }

            if (r == 0) {
                dp[l][r] = arr[l] * y;
                continue;
            }

            dp[l][r] =
                dp[l + 1][r] + arr[l] * y > dp[l][r - 1] + arr[r] * y
                    ? dp[l + 1][r] + arr[l] * y
                    : dp[l][r - 1] + arr[r] * y;
        }
    }
    return dp[0][n - 1];
};

// bottom to top
// dp[l][r] = price of all of the wines between 0 - l and r - n, so dp[1][3] is the money you get for selling wines: 4, 5
// (we shift the array by 1 here, so l starts from 1 and r end or n - exercise)

// push dp - on l/r you calculate l+1/r and l/r-1
var solution2 = arr => {
    const n = arr.length;
    const p = [0, ...arr];
    let dp = [...Array(n + 1)].map(() => [...Array(n + 1)].map(() => 0));
    for (let y = 1; y < n; y++) {
        for (let l = 1; l <= y; l++) {
            let r = n - y + l;
            let v = dp[l][r] + y * p[l];
            dp[l + 1][r] = v > dp[l + 1][r] ? v : dp[l + 1][r];

            v = dp[l][r] + y * p[r];
            dp[l][r - 1] = v > dp[l][r - 1] ? v : dp[l][r - 1];
        }
    }

    // year -> l/r -> pushed dp [l/r]
    // 1 -> 1/5 -> 2/5, 1/4
    // 2 -> 1/4 -> 2/4, 1/3   2/5 -> 3/5, 2/4
    // 3 -> 1/2     2/3  3/4   4/5

    console.log(dp);
    let max = 0;
    for (let i = 1; i <= n; i++) {
        let val = dp[i][i] + n * p[i];
        if (val > max) {
            max = val;
        }
    }
    return max;
};
// not push dp - on l/r you calculate l/r based on either l-1/r or l/r+1
var solution3 = arr => {
    const n = arr.length;
    const p = [0, ...arr];
    let dp = [...Array(n + 1)].map(() => [...Array(n + 1)].map(() => 0));
    for (let y = 1; y < n; y++) {
        // on 1st year we have to get to 2/5 and 1/4     1/3     1/2   1/1
        for (let l = 1; l <= y + 1; l++) {
            let r = n - y + l - 1;

            if (r == 5) {
                dp[l][r] = dp[l - 1][r] + y * p[l - 1];
                continue;
            }

            dp[l][r] =
                dp[l - 1][r] + y * p[l - 1] > dp[l][r + 1] + y * p[r + 1]
                    ? dp[l - 1][r] + y * p[l - 1]
                    : dp[l][r + 1] + y * p[r + 1];
        }
    }

    // year -> l/r -> pushed dp [l/r]
    // 1 -> 1/5 -> 2/5, 1/4
    // 2 -> 1/4 -> 2/4, 1/3   2/5 -> 3/5, 2/4
    // 3 -> 1/2     2/3  3/4   4/5

    let max = 0;
    for (let i = 1; i <= n; i++) {
        let val = dp[i][i] + n * p[i];
        if (val > max) {
            max = val;
        }
    }
    return max;
};

// top to bottom v2 - dp[l][r] is the most we can earn inside l/r
// and we assume there are no other wines than the ones between l r
var solution4 = arr => {
    const n = arr.length;
    const p = [0, ...arr];
    let dp = [...Array(n + 1)].map(() => [...Array(n + 1)].map(() => 0));
    for (let i = 1; i <= n; i++) {
        dp[i][i] = p[i];
    }

    // solution 1 started from the right side (l = n -> 0), se here we start on the opposite side -> r = 0 -> n
    for (let r = 2; r <= n; r++) {
        for (let l = r - 1; l >= 1; l--) {
            const sum1 = p.filter((a, i) => i >= l + 1 && i <= r).reduce((sum, curr) => (sum += curr), 0);
            let v1 = dp[l + 1][r] + sum1 + p[l];
            const sum2 = p.filter((a, i) => i >= l && i <= r - 1).reduce((sum, curr) => (sum += curr), 0);
            let v2 = dp[l][r - 1] + sum2 + p[r];
            dp[l][r] = v1 > v2 ? v1 : v2;
        }
    }

    return dp[1][n];
};
