'use strict'; 

// ====================================================================================================== 
// types 
// Equality comparisons and related utilities.
// 
// John R. Kosinski
// 13 Jan 2018
// ------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------
// returns true if the given value is not undefined
/*bool*/ function isDefined(v) {
    return ( typeof v !== 'undefined');
}

// ------------------------------------------------------------------------------------------------------
// returns true if the given value is null
/*bool*/ function isNull(v) {
    return v === null;
}

// ------------------------------------------------------------------------------------------------------
// returns true if the given value is a function
/*bool*/ function isFunction(v) {
    let getType = {};
    return v && getType.toString.call(v) === '[object Function]';
}

// ------------------------------------------------------------------------------------------------------
// returns true if the given value is an array
/*bool*/ function isArray(v) {
    return Array.isArray(v);
}

// ------------------------------------------------------------------------------------------------------
// returns true if the given value is an object type 
/*bool*/ function isObject(v) {  
    if (v === null) { return false;}
    return ( (typeof v === 'function') || (typeof v === 'object') );
}

// ------------------------------------------------------------------------------------------------------
// attempts to convert the given value to an integer, returning 0 by default
//
// returns: integer 
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

// ------------------------------------------------------------------------------------------------------
// attempts to convert the given value to a float, returning 0 by default
//
// returns: float 
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