const sha256 = require('sha256'); 
const elliptic = require('elliptic');

const ec = new elliptic.ec('secp256k1');

// ------------------------------------------------------------------------------------------------------
function hashString(s) {
    return sha256(s); 
}

// ------------------------------------------------------------------------------------------------------
function generateKeyPair() {
    const output = ec.genKeyPair();
    return output;
}

// ------------------------------------------------------------------------------------------------------
function sign(privateKey, data) {
    var key = ec.keyFromPrivate(privateKey, 'hex');
    const signature = key.sign(data); 

    return signature;
}

// ------------------------------------------------------------------------------------------------------
function verify(publicKey, data, signature) {
    var key = ec.keyFromPublic(publicKey, 'hex');
    return key.verify(data, signature);
}


module.exports = {
    hashString, 
    generateKeyPair,
    sign, 
    verify
};