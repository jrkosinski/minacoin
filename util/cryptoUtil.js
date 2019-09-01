'use strict';

const LOG_TAG = 'CRPT';

const SHA256 = require('crypto-js/sha256');
const uuidV1 = require('uuid/v1');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

exports.generateKeyPair = () => {
    return ec.genKeyPair();
};

exports.id = () => {
    return uuidV1();
};

exports.hash = (data) => {
    return SHA256(JSON.stringify(data)).toString();
}

exports.verifySignature = (publicKey, signature, dataHash) => {
    return ec.keyFromPublic(publicKey,'hex').verify(dataHash, signature);
}