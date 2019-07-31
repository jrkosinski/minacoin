'use strict';

// ===============================================================================================
// json 
// JSON-related utilities
// 
// John R. Kosinski
// 11 Apr 2018

const types = require('./types');

// ------------------------------------------------------------------------------------------------------
// attempts to get a property value from the given json object. If any property in the string is 
// null or undefined, returns null. 
//
// args
//  obj: any json object 
//  property: string in the form 'property1.property2.property3' 
//
// returns: value or null 
/*any*/ function getDeepPropertyValue(obj, property) {
    let output = null;

    let props = property.split('.');
    for (var n = 0; n < props.length; n++) {
        let p = props[n];
        if (types.isDefined(obj[p]) && !types.isNull(obj[p])) {
            obj = obj[p];
            if (n === props.length - 1)
                output = obj;
        }
        else
            break;
    }

    return output;
}

// ----------------------------------------------------------------------------------------------- 
// takes a deep json object, and returns a recursively flattened version of it. For example: 
// {
//    '' prop1': 'val1',
//     'prop2': {
//         'prop3': 'val2'
//     }
// }
// would be returned as 
// {
//     'prop1': 'val1': 
//     'prop2.prop3': 'val2'
// }
// returns: object
/*object*/ function flattenObject(obj) {
    const output = {};
    for (let p in obj) {
        let val = obj[p];
        if (!types.isFunction(val) && !types.isObject(val)) {
            output[p] = obj[p];
        }
        else {
            if (types.isObject(val)) {
                const flat = flattenObject(val);

                for (var pp in flat) {
                    output[p + '.' + pp] = flat[pp];
                }
            }
        }
    }    

    return output;
}

module.exports = {
    getDeepPropertyValue,
    flattenObject
}