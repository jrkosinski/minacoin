'use strict';

//configure IOC container
const ioc = require('../../src/util/iocContainer');
ioc.service('loggerFactory', c => require('../../src/util/winstonLogger'));
ioc.service('ehFactory', c => require('../../src/util/exceptionHandler'));

function sleepMs(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve(true); }, ms);
    });
}

function sleep(sec) {
    return sleepMs(sec * 1000); 
}

module.exports = {
    sleep, 
    sleepMs
}