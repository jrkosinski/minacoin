'use strict';

//configure IOC container
const ioc = require('../util/iocContainer');
ioc.service('loggerFactory', c => require('../util/winstonLogger'));
ioc.service('ehFactory', c => require('../util/exceptionHandler'));