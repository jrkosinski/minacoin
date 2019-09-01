'use strict';

/**
 * ------------------------
 * generic exception handler: wraps try/catch. Is easier on the eyes, in my opinion,
 * than try/catch.
 *
 * Author: John R. Kosinski
 * Date: 27 Aug 2019
 */

class ExceptionHandler {
    constructor(logger) {
        this.logger = logger;
    }

    /**
     * wraps the given expression in a try/catch, and provides standard handling for any errors.
     *
     * @param {fn} expr
     * @param {json} options:  {
     *      defaultValue: null,
     *      onError: (e) => {},
     *      finally: (e) => {},
     *      functionName: ''
     *  }
     * @returns {*} return value of given expression
     */
    try(expr, options) {
        try{
            return expr();
        }
        catch(err){
            this.handleError(err);
            if (options && options.onError)
                return options.onError(err);

            return options ? options.defaultValue : null;
        }
        finally {
            if (options && options.finally)
                return options.finally(err);
        }
    }

    /**
     * wraps the expression as in try(*), but in such a way as to allow for awaiting async code.
     *
     * @param {fn} expr
     * @param {json} options: see try(expr, options)
     */
    async tryAsync(expr, options) {
        try{
            return await expr();
        }
        catch(err){
            this.handleError(err);
            if (options && options.onError)
                return options.onError(err);

            return options ? options.defaultValue : null;
        }
        finally {
            if (options && options.finally)
                return options.finally();
        }
    }

    /**
     * provides standard handling for any errors.
     *
     * @param {*} err
     * @param {*} functionName
     */
    handleError(err, functionName) {
        let prefix = (functionName && functionName.length ? ' [' + functionName + '] ' : '');

        if (this.logger) {
            this.logger.error(JSON.stringify(err) + ' ' + err);
        }
        if (err.stack)
            console.log(err.stack);
    }
}


exports.createHandler = (logger) => { return new ExceptionHandler(logger); };