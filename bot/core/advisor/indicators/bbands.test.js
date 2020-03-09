const bbands = require('./bbands');

test('Bollinger Bands correct output for arbitrary price inputs', () => {
    let config = {
        period: 5,
        stddevs: 2
    };
    let prices = [81.59, 81.06, 82.87, 83.00, 83.61, 83.15, 82.84, 83.99, 84.55, 84.36, 85.53, 86.54, 86.89, 87.77, 87.29];
    let myBBands = new bbands(config);
    prices.forEach(price => {
        myBBands.update({close: price});
    });
    let result = myBBands.result.map(b => {
        return Math.round((b + Number.EPSILON) * 100) / 100;
    });
    expect(result).toEqual([85.29, 86.80, 88.32]);
});