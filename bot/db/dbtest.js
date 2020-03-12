const database = require('./db');
const config = require('../config');

const db = new database(config);
let connection = db.connect();
console.log(connection)