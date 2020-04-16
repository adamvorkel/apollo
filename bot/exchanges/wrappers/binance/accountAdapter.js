const { Transform } = require('stream');

const isAccountInfo = payload => payload.data && payload.data.e == 'outboundAccountInfo';

class AccountAdapter extends Transform {
    constructor() {
        super({ objectMode: true });
    }

    _transform(payload, _, done) {
        // filter
        if(isAccountInfo(payload)) {
            const balances = payload.data.B;
            this.push(balances);
        }
        
        done();
    }
}

module.exports = AccountAdapter;