'use strict';

// ===============================================================================================
// json 
// JSON-related utilities
// 
// John R. Kosinski
// 11 Apr 2018

const types = require('./types');

// ------------------------------------------------------------------------------------------------------
//
//
// args
//  obj1: object to compare 
//  obj2: object to compare 
//
// returns: true if all property values match between the two objects 
// 
/*bool*/ function compareObjects(obj1, obj2) {
    let output = false;
    if (obj1 && obj2) {
        const flat1 = flattenObject(obj1); 
        const flat2 = flattenObject(obj2); 

        const compare = (a, b) => {
            for (let p in a) {
                let val = a[p]; 
                if (b[p] !== a[p])
                    return false;
            }
            return true; 
        }; 

        return (compare(flat1, flat2) && compare(flat2, flat1));
    }
    else {
        if (!obj1 && !obj2)
            output = true; 
    }
    return output; 
}

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

// ----------------------------------------------------------------------------------------------- 
// creates a deep copy of the given object 
// 
// args
//  obj: the object to clone 
//
// returns: a deep clone of the given object 
/*object*/ function deepCopy(obj) {
    let output = null; 
    if (obj) {
        output = {}; 

        for(let p in obj) {
            if (types.isObject(obj[p])) {
                output[p] = deepCopy(obj[p]); 
            }
            else{
                output[p] = obj[p]; 
            }
        }
    }

    return output; 
}

// ----------------------------------------------------------------------------------------------- 
// creates a shallow copy of the given object 
// 
// args
//  obj: the object to clone 
//
// returns: a shallow clone of the given object 
/*object*/ function shallowCopy(obj) {
    let output = null; 
    if (obj) {
        output = {}; 

        for(let p in obj) {
            output[p] = obj[p]; 
        }
    }

    return output; 
}

module.exports = {
    getDeepPropertyValue,
    flattenObject,
    deepCopy,
    shallowCopy,
    compareObjects
}