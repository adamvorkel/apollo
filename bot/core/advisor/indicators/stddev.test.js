const STDDEV = require('./stddev');

test('STDDEV correct output for arbitrary price inputs', () => {
    let config = {
        period: 5
    };
    let prices = [81.59, 81.06, 82.87, 83.00, 83.61, 83.15, 82.84, 83.99, 84.55, 84.36, 85.53, 86.54, 86.89, 87.77, 87.29];
    let mySTDDEV = new STDDEV(config);
    prices.forEach(price => {
        mySTDDEV.update({close: price});
    });
    let result = Math.round((mySTDDEV.result + Number.EPSILON) * 100) / 100;
    expect(result).toBe(0.76);
});