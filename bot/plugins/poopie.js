const emitter = require("./../core/emitter");

class Poopie extends emitter {
    constructor() {
        super();
        console.log("POOPIE ON")
    }

    processAdvice(advice) {
        console.log(`Poopie pants recieved advice: ${advice}`);
    }

    stratReady() {
        console.log("Poopie sees that strategy is ready!")
    }
};

module.exports = Poopie;