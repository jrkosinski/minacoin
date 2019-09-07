'use strict';

//configure IOC container
const ioc = require('../src/util/iocContainer');
ioc.service('loggerFactory', c => require('../src/util/winstonLogger'));
ioc.service('ehFactory', c => require('../src/util/exceptionHandler'));
