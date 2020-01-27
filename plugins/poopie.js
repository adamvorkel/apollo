const emitter = require("./../core/emitter");

class Poopie extends emitter {
    constructor() {
        super();

    }

    processAdvice(advice) {
        console.log(`Poopie pants recieved advice: ${advice}`);
    }
};

module.exports = Poopie;