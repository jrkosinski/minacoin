'use strict';

/**
 * ------------------------
 * implements a logger factory, returning a logger that implements winston.
 *
 * Author: John R. Kosinski
 * Date: 27 Aug 2019
 */

const {transports, createLogger, format} = require('winston');

//create winston logger
const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
      new transports.Console({
        handleExceptions: true,
        timestamp: true
      })
    ],
    exitOnError: false
});

/**
 * generic logger, wraps winston
 */
class WinstonLogger {

    constructor(tag) {
        this.tag = tag;
    }

    debug(s) {
        logger.debug(formatMessage(this.tag, s));
    }

    info(s) {
        logger.info(formatMessage(this.tag, s));
    }

    warn(s) {
        logger.warn(formatMessage(this.tag, s));
    }

    error(s) {
        logger.error(formatMessage(this.tag, s));
    }
}

function formatMessage(tag, message) {
    return `${tag}: ${message}`;
}

exports.createLogger = (tag) => { return new WinstonLogger(tag); };