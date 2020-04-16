const EMA = require('../ema');

test('EMA correct result', () => {
    let config = {
        period: 5
    };
    let prices = [81.59, 81.06, 82.87, 83.00, 83.61, 83.15, 82.84, 83.99, 84.55, 84.36, 85.53, 86.54, 86.89, 87.77, 87.29];
    let myEMA = new EMA(config);
    prices.forEach(price => {
        myEMA.update({close: price});
    });
    let result = Math.round((myEMA.result + Number.EPSILON) * 100) / 100;
    expect(result).toBe(86.70);
});