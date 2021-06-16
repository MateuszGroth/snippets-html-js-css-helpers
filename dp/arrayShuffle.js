// correct shuffle
var shuffle = arr => {
    for (let i = 0; i < arr.length; i++) {
        let j = Math.floor(Math.random() * i); // ! 0 - 1
        swap(arr, i, j); // swap i with j positions within arr
    }
};

// wrong shuffle
var shuffle = arr => {
    for (let i = 0; i < arr.length; i++) {
        let j = Math.floor(Math.random() * arr.length); // ! 0 - n
        swap(arr, i, j); // swap i with j positions within arr
    }
};

/*
    example arr - [1,2,3]

    ? possibilities :1,2,3  1,3,2  3,2,1  2,3,1  2,1,3  3,1,2
    wrong shuffle: 
    first iteration might produce : 1,2,3    2,1,3    2,3,1
    second iteration might produce : 1,2,3 --- 1,2,3 2,1,3 1,3,2    2,1,3 --- 1,2,3, 2,1,3, 2,3,1    2,3,1 --- 2,3,1  3,2,1  1,2,3
    ! we already see that 1,2,3 happend 3 times  and 3,2,1 only once
    ! so in the next iteration, 1,2,3 could be shuffled 3 times and 3,2,1 only once

    correct shuffle:
    first: 1,2,3
    second: 1,2,3, 2,1,3
    third: 1,2,3, 3,2,1, 1,3,2   2,1,3 3,1,2 1,3,1  
    ? all possibilities happened exactly once - correct
*/
