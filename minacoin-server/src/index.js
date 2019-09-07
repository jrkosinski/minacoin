'use strict';

const LOG_TAG = 'IDX';

//configure IOC container
const ioc = require('./util/iocContainer');
ioc.service('loggerFactory', c => require('./util/winstonLogger'));
ioc.service('ehFactory', c => require('./util/exceptionHandler'));
ioc.service('p2pServerFactory', c=> require('./lib/p2p/classes/SwarmP2PServer').factory);
ioc.service('database', c=> require('./lib/database/classes/LocalJsonDb'));

const Server = require('./Server');
const config = require('./config'); 

const server = new Server(config); 
server.run(); 
