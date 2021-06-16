// we use 2 pointers
// and we have to handle 2 circumstances
// 1st when palindromes length % 2  = 0,  so when we start in the middle and move pointers to the sides
// one of them has to point 1 closer to the middle of the palindrome than the second pointer
// so first would be for example i - k, and the second one would be i + k - 1 (this one is closer to the middle)
// this will let us find palindromes such as 'aebbea'
// 2nd case is when length % 2 = 1, then both pointers have to be equally far from the middle
// first pointer would be i - k and second one i + k
// this will let us find "aebTbea"
var solve = (text = '') => {
    let ans = '';
    for (let i = 1; i < text.length - 1; i++) {
        let k = 1;
        let tmp1 = '';
        let tmp2 = '';
        let flag1 = true;
        let flag2 = true;
        while (flag1 || flag2) {
            if (k > i) {
                break;
            }
            if (k > text.length - i + 1) {
                break;
            }

            if (flag1 && text[i - k] == text[i + k - 1]) {
                tmp1 = text[i - k] + tmp1 + text[i + k - 1];
            } else if (flag1) {
                flag1 = false;
            }

            if (k > text.length - i) {
                flag2 = false;
            }

            if (flag2 && text[i - k] == text[i + k]) {
                tmp2 = text[i - k] + tmp2 + text[i + k];
            } else if (flag2) {
                flag2 = false;
            }

            ++k;
        }

        if (tmp1.length > ans.length) ans = tmp1;
        if (tmp2.length > ans.length) ans = tmp2;
    }

    return ans;
};
