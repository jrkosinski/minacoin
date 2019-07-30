const sha256 = require('sha256'); 
const elliptic = require('elliptic');

const ec = new elliptic.ec('secp256k1');

/**
 * produces hash of given string
 * @param {string} s 
 * @returns {string}
 */
function /*string*/ hashString(s) {
    return sha256(s); 
}

/**
 * generates a new elliptic key pair
 * @returns: elliptic key pair
 */
function generateKeyPair() {
    return ec.genKeyPair();
}

/**
 * signs the given data using the private key
 * @param {*} privateKey 
 * @param {*} data 
 */
function sign(privateKey, data) {
    var key = ec.keyFromPrivate(privateKey, 'hex');
    return key.sign(data); 
}

/**
 * verifies the validity of the signature on the given data 
 * @param {*} publicKey 
 * @param {*} data 
 * @param {*} signature 
 */
function /*bool*/ verify(publicKey, data, signature) {
    var key = ec.keyFromPublic(publicKey, 'hex');
    return key.verify(data, signature);
}


module.exports = {
    hashString, 
    generateKeyPair,
    sign, 
    verify
};