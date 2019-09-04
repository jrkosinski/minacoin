'use strict';

function convertJson(obj) {
    if (Array.isArray(obj)) {
        const output = [];
        obj.forEach((i) => {
            output.push(convertJson(i));
        });
        return output;
    }
    if (obj.toJson) {
        return obj.toJson();
    }
    return obj;
}

exports.convertJson = convertJson;