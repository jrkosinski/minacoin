'use strict'; 

//TODO: check for these in ramda

/**
 * returns true if the given value is not undefined
 * @param {any} v 
 * @returns {bool}
 */
/*bool*/ function isDefined(v) {
    return ( typeof v !== 'undefined');
}

/**
 * returns true if the given value is null
 * @param {any} v 
 * @returns {bool}
 */
/*bool*/ function isNull(v) {
    return v === null;
}

/**
 * returns true if the given value is a function
 * @param {any} v 
 * @returns {bool}
 */
/*bool*/ function isFunction(v) {
    let getType = {};
    return v && getType.toString.call(v) === '[object Function]';
}

/**
 * returns true if the given value is an array
 * @param {any} v 
 * @returns {bool}
 */
/*bool*/ function isArray(v) {
    return Array.isArray(v);
}

/**
 * returns true if the given value is an object type 
 * @param {any} v 
 * @returns {bool}
 */
/*bool*/ function isObject(v) {  
    if (v === null) { return false;}
    return ( (typeof v === 'function') || (typeof v === 'object') );
}

/**
 * attempts to convert the given value to an integer, returning 0 by default
 * @param {any} v 
 * @returns {int}
 */
/*int*/ function tryParseInt(v) {
     let output = 0;
     if(isDefined(v) && !isNull(v)) {
         v = v.toString();
         if(v.length > 0) {
             if (!isNaN(v)) {
                 output = parseInt(v);
             }
         }
     }
     return output;
}

/**
 * attempts to convert the given value to a float, returning 0 by default
 * @param {any} v 
 * @returns {float}
 */
/*float*/ function tryParseFloat(v) {
     let output = 0;
     if(isDefined(v) && !isNull(v)) {
         v = v.toString();
         if(v.length > 0) {
             if (!isNaN(v)) {
                 output = parseFloat(v);
             }
         }
     }
     return output;
}


module.exports = {
    isDefined: isDefined,
    isUndefined: (v) => { return !isDefined(v);},
    isNull: isNull, 
    isUndefinedOrNull: (v) => { return !isDefined(v) || isNull(v); },
    isFunction : isFunction,
    isArray: isArray,
    isObject: isObject,
	tryParseInt: tryParseInt,
	tryParseFloat: tryParseFloat
}