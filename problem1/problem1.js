var sum_to_n_a = function(n) {
    // your code here
    return (n * (n + 1)) / 2
};

var sum_to_n_b = function(n) {
    // your code here
    if (n < 2) return n
    let sum = 1;
    for (let i = 2; i <=n; i++)
        sum += i;
    return sum

};

var sum_to_n_c = function(n) {
    // your code here
    return [...Array(n + 1).keys()].reduce((acc, num) => num + acc, 0)
};