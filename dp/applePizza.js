// Input: pizza = ["A..","AAA","..."], k = 3
// Output: 3
// Explanation: The figure above shows the three ways to cut the pizza. Note that pieces must contain at least one apple.

// ! works but too slow
var sliceUp = (arr, i) => arr.splice(i);
var sliceLeft = (arr, i) => arr.map(str => str.slice(i));
var sliceRight = (arr, i) => arr.map(str => str.slice(0, i));

var hasApple = arr => arr.find(str => str.includes('A'));

var recur = (p, s) => {
    if (s == 0) {
        return 1;
    }
    let r = p.length;
    let c = p[0].length;

    let num = 0;
    for (let i = 1; i < r; i++) {
        let tmp = [...p];
        let btm = sliceUp(tmp, i);
        if (hasApple(tmp) && hasApple(btm)) {
            num += recur(btm, s - 1) % (Math.pow(10, 9) + 7);
        }
    }
    for (let i = 1; i < c; i++) {
        let left = sliceRight(p, i);
        let right = sliceLeft(p, i);
        if (hasApple(left) && hasApple(right)) {
            num += recur(right, s - 1) % (Math.pow(10, 9) + 7);
        }
    }

    return num;
};

var solve = (pizza, k) => {
    if (k < 2) return 1;

    let r = pizza.length;
    if (r.length === 0) return -1;

    let c = pizza[0].length;
    if (c.length === 0) return -1;

    return recur(pizza, k - 1);
};

var mod = Math.pow(10, 9) + 7;

var ways = (pizza, k) => {
    if (k < 2) return 1;

    let r = pizza.length;
    if (r.length === 0) return -1;

    let c = pizza[0].length;
    if (c.length === 0) return -1;

    let has = [...Array(r)].map(() => [...Array(c)].map(() => null));

    for (let i = r - 1; i >= 0; i--) {
        for (let j = c - 1; j >= 0; j--) {
            if (j === c - 1 && i === r - 1) {
                has[i][j] = pizza[i][j] === 'A';
                continue;
            }
            if (j === c - 1) {
                has[i][j] = has[i + 1][j] || pizza[i][j] === 'A';
                continue;
            }
            if (i === r - 1) {
                has[i][j] = has[i][j + 1] || pizza[i][j] === 'A';
                continue;
            }

            has[i][j] = has[i + 1][j] || has[i][j + 1] || pizza[i][j] === 'A';
        }
    }

    let apples = [...Array(r + 1)].map(() => [...Array(c + 1)].map(() => 0));
    for (let i = 0; i < r; i++) {
        for (let j = 0; j < c; j++) {
            let add = pizza[i][j] === 'A' ? 1 : 0;
            apples[i + 1][j + 1] = apples[i + 1][j] + apples[i][j + 1] - apples[i][j] + add;
        }
    }

    // r2, c2 -- bigger
    var hasApple = (r1, c1, r2, c2) => apples[r2][c2] + apples[r1][c1] - apples[r2][c1] - apples[r1][c2] > 0;
    return recurNew(pizza, 0, 0, k - 1, has, r, c, hasApple);
};

var recurNew = (pizza, r, c, cuts, has, rows, cols, hasApple) => {
    if (cuts == 0) {
        if (hasApple(rows, cols, r, c)) return 1;
        else return 0;
    }

    let ways = 0;
    let topFlag = false;
    for (let i = r + 1; i < rows; i++) {
        if (!topFlag) {
            topFlag = hasApple(i, cols, r, c);
        }
        if (!topFlag) {
            continue;
        }
        ways = (ways + recurNew(pizza, i, c, cuts - 1, has, rows, cols, hasApple)) % mod;
    }
    let leftFlag = false;
    for (let i = c + 1; i < cols; i++) {
        if (!leftFlag) {
            leftFlag = hasApple(rows, i, r, c);
        }
        if (!leftFlag) {
            continue;
        }
        ways = (ways + recurNew(pizza, r, i, cuts - 1, has, rows, cols, hasApple)) % mod;
    }

    return ways;
};
/////////
/////////
/////////
/////////
/////////
/////////
// js too slow
var mod = Math.pow(10, 9) + 7;

var ways = (pizza, k) => {
    if (k < 2) return 1;

    let r = pizza.length;
    if (r.length === 0) return -1;

    let c = pizza[0].length;
    if (c.length === 0) return -1;

    let apples = [...Array(r + 1)].map(() => [...Array(c + 1)].map(() => 0));
    for (let i = 0; i < r; i++) {
        for (let j = 0; j < c; j++) {
            let add = pizza[i][j] === 'A' ? 1 : 0;
            apples[i + 1][j + 1] = apples[i + 1][j] + apples[i][j + 1] - apples[i][j] + add;
        }
    }

    // r2, c2 -- bigger
    var hasApple = (r1, c1, r2, c2) => apples[r2][c2] + apples[r1][c1] - apples[r2][c1] - apples[r1][c2] > 0;
    return recurNew(pizza, 0, 0, k - 1, r, c, hasApple);
};

var recurNew = (pizza, r, c, cuts, rows, cols, hasApple) => {
    if (cuts == 0) {
        if (hasApple(rows, cols, r, c)) return 1;
        else return 0;
    }

    let ways = 0;
    let topFlag = false;
    for (let i = r + 1; i < rows; i++) {
        if (!topFlag) {
            topFlag = hasApple(i, cols, r, c);
        }
        if (!topFlag) {
            continue;
        }
        ways = (ways + recurNew(pizza, i, c, cuts - 1, rows, cols, hasApple)) % mod;
    }
    let leftFlag = false;
    for (let i = c + 1; i < cols; i++) {
        if (!leftFlag) {
            leftFlag = hasApple(rows, i, r, c);
        }
        if (!leftFlag) {
            continue;
        }
        ways = (ways + recurNew(pizza, r, i, cuts - 1, rows, cols, hasApple)) % mod;
    }

    return ways;
};
