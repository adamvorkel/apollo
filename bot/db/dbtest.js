const db = require('./db');
const config = require('../config');

const database = new db(config);
database.connect();