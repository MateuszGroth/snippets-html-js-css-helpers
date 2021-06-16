// find how many ways there are to get to a given step on a staircase
// when you can either take 1 or 2 steps
// 1. without total steps limit (you can take as many steps as you want)
// 2. with total steps limit (the most steps you can take is provided)

var solution = step => {
    let dp = [1, ...[...Array(step)].map(() => 0)];

    for (let i = 1; i <= step; i++) {
        dp[i] += dp[i - 1];
        if (i == 1) {
            continue;
        }
        dp[i] += dp[i - 2];
    }
    return dp[step];
};
var solution2 = (step, maxSteps) => {
    let dp = [...Array(step + 1)].map(() => [...Array(maxSteps + 1)].map(() => 0));
    dp[0][0] = 1;

    for (let i = 1; i <= step; i++) {
        for (let s = 1; s <= maxSteps; s++) {
            dp[i][s] += dp[i - 1][s - 1];
            if (i == 1) {
                continue;
            }
            dp[i][s] += dp[i - 2][s - 1];
        }
    }
    return dp[step].reduce((sum, n) => (sum += n), 0);
};
