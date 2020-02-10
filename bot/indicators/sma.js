class SMA {
    constructor(windowLen) {
        this.windowLen = windowLen;
        this.prices = [];
        this.result = 0;
        this.age = 0;
        this.sum = 0;
    }

    update(price) {
        let tail = this.prices[this.age] || 0;
        this.prices[this.age] = price;
        this.sum += price - tail;
        this.result = this.sum / this.prices.length;
        this.age = (this.age + 1) % this.windowLen;
        // console.log(`Result: ${this.result} | Tail ${tail} | Sum: ${this.sum} | Age: ${this.age} | Prices: ${this.prices}`);
    }
 
}




/*

let foo = new SMA(4);
foo.update(1);
foo.update(2);
foo.update(3);
foo.update(4);
foo.update(5);
foo.update(6);
foo.update(7);
foo.update(8);
foo.update(9);
foo.update(10);

|
1
1 / 1 = 1

|   |
1   2
3 / 2 = 1.5

|       |
1   2   3
6 / 3 = 2

|           |
1   2   3   4
10 / 4 = 2.5

    |           |
1   2   3   4   5
14 / 4 = 3.5

        |           |
1   2   3   4   5   6
18 / 4 = 4.5

            |           |
1   2   3   4   5   6   7
22 / 4 = 5.5

                |           |
1   2   3   4   5   6   7   8
26 / 4 = 6.5

                    |           |
1   2   3   4   5   6   7   8   9
30 / 4 = 7.5

                        |           |
1   2   3   4   5   6   7   8   9   10
34 / 4 = 8.5

*/