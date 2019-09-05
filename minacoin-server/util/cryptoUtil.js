'use strict';

const LOG_TAG = 'CRPT';

const SHA256 = require('crypto-js/sha256');
const uuidV1 = require('uuid/v1');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

/**
 * generates & returns a new elliptic keypair
 * @returns {KeyPair}
 */
/*EC.KeyPair*/ exports.generateKeyPair = () => {
    return ec.genKeyPair();
};

/**
 * deserializes a key pair from string (hex) representations of its 
 * public & private keys
 * @param pub string (hex) representation of public key
 * @param priv string (hex) representation of private key
 * @returns {KeyPair}
 */
/*EC.KeyPair*/ exports.deserializeKeyPair = (pub, priv) => {
    return ec.keyPair({
        priv: priv,
        privEnc: 'hex',
        pub: pub,
        pubEnc: 'hex'
    });
};

/**
 * generates & returns a new UUID
 * @returns {string}
 */
/*string*/ exports.id = () => {
    return uuidV1();
};

/**
 * generates a SHA256 hash of given data 
 * @param {json} data 
 */
/*string*/ exports.hash = (data) => {
    return SHA256(JSON.stringify(data)).toString();
}

/**
 * validates a signature 
 * @param {string} publicKey
 * @param {string} signature
 * @param {string} dataHash
 * @returns {bool}
 */
/*bool*/ exports.verifySignature = (publicKey, signature, dataHash) => {
    return ec.keyFromPublic(publicKey,'hex').verify(dataHash, signature);
}

exports.serializeSignature = (signature) => {
    return {
        r: signature.r.toString('hex'), 
        s: signature.s.toString('hex')
    };
}

exports.deserializeSignature = (json) => {
    return new EC.Signature(json, 'hex'); 
}