'use strict'; 

// ===============================================================================================
// strings 
// String processing/handling.
// 
// John R. Kosinski
// 13 Jan 2018
/*string*/ String.prototype.replaceAll = function (search, replacement) {
	let target = this;
	return target.split(search).join(replacement);
};

// ------------------------------------------------------------------------------------------------------
// determines whether or not the given string contains the given string 
/*bool*/ String.prototype.contains = function (search) {
	let target = this;
	return target.indexOf(search) >= 0;
};

// ------------------------------------------------------------------------------------------------------
//TODO: is this used?
/*int*/ String.prototype.maxDecimalPlaces = function(max) {
	let target = this;
	let index = target.indexOf('.');
	if (index >= 0){
		var maxLen = index + 1 + max; 
		if (target.length > maxLen){
			target = target.substr(0, maxLen); 
		}
	}

	return target;
};

// ------------------------------------------------------------------------------------------------------
// pads the right side of the given string until it reaches the desired length
// 
// args
//	totalLen: the total desired length of the output string 
//	paddingChar: the character to add to the right of the string until it reaches desired length
// 
// returns: string 
/*string*/ String.prototype.padRight = function(totalLen, paddingChar) {
	let target = this;
    if (!paddingChar)
        paddingChar = ' ';
    while(target.length < totalLen)
        target += paddingChar;
	return target;
};

// ------------------------------------------------------------------------------------------------------
// pads the left side of the given string until it reaches the desired length
// 
// args
//	totalLen: the total desired length of the output string 
//	paddingChar: the character to add to the left of the string until it reaches desired length
// 
// returns: string 
/*string*/ String.prototype.padLeft = function(totalLen, paddingChar) {
	let target = this;
    if (!paddingChar)
        paddingChar = ' ';
    while(target.length < totalLen)
        target = paddingChar + target;
	return target;
};

// ------------------------------------------------------------------------------------------------------
// returns true if the string ends with a common punctuation symbol (ignoring any trailing whitespace)
// 
/*bool*/ String.prototype.endsWithPunctuation = function () {
	let target = this;
	target = target.trim();
	if (target.length) {
		let c = target[target.length - 1];
		if (!c.match(/^[0-9a-zA-Z]+$/))
			return true;
	}
	return false;
};

// ------------------------------------------------------------------------------------------------------
// determines whether or not the given value represents a number in some way 
//TODO: these might be an easier way to do this? (LOW)
// 
// args
//	value: any value 
// 
// returns: boolean 
/*bool*/ function isNumeric(value){
	if (value === undefined || value === null) 
		return false;
	
	let s = value.toString(); 
	let pattern = /^\d+$/;
    return pattern.test(s);
}

// ------------------------------------------------------------------------------------------------------
function numZeros(s) {
	let count = 0; 
	for (let n=0; n<s.length; n++) {
		if (s[n] === '0')
			count++; 
	}
	return count; 
}


module.exports = {
	isNumeric, 
	numZeros
};