'use strict';
require('dotenv').config();

// ===============================================================================================
// 
// John R. Kosinski
// 28 May 2018
const client = require('./client/index');
const server = require('./server/index');

server.start();
client.start(); 