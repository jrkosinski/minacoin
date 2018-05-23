'use strict';

//TODO: add single-entry function (LOW)

// ======================================================================================================
// exceptions 
// Standard handling for exceptions. 
// 
// John R. Kosinski
// 3 Oct 2017
// ------------------------------------------------------------------------------------------------------

//TODO: add a finally to errorOptions
module.exports = function excepUtil(logPrefix) {

    function ExcepUtil() {
        const _this = this; 

        // ------------------------------------------------------------------------------------------------------
        // wraps the given expression in a try/catch, and provides standard handling for any errors.
        //
        // args: 
        //  options:  {
        //      defaultValue: null,
        //      onError: () => {},
        //      functionName: ''
        //  }
        //
        // returns: return value of given expression
        this.try = (expr, options) => {
            try{
                return expr();
            }
            catch(err){
                _this.handleError(err);
                if (options && options.onError)
                    return options.onError(err);

                return options ? options.defaultValue : null;
            }
            finally {                
                if (options && options.finally) 
                    return options.finally(); 
            }
        };

        // ------------------------------------------------------------------------------------------------------
        // provides standard handling for any errors.
        //
        this.handleError = (err, functionName) => {
            let prefix = (functionName && functionName.length ? ' <' + functionName + '> ' : '');
            //logger.error(prefix + JSON.stringify(err) + ' ' + err);
            if (err.stack)
                console.log(err.stack);
        }
    }

    return new ExcepUtil();
};