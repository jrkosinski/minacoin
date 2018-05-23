'use strict'; 

const crypto = require('./crypto'); 

// ------------------------------------------------------------------------------------------------------
function getMerkleRoot(transactions) {
    let count = transactions.length; 
    let prevLayer = []; 
    for (let n=0; n<transactions.length; n++) {
        prevLayer.push(transactions[n].id); 
    }

    let treeLayer = prevLayer; 
    while (count > 1) {
        treeLayer = []; 
        for (let n=1; n<prevLayer.length; n++) {
            treeLayer.push(crypto.hashString(prevLayer[n-1] + prevLayer[n]));
        }
        count = treeLayer.length; 
        prevLayer = treeLayer;
    }

    return (treeLayer.length === 1) ? treeLayer[0] : ""; 
}

module.exports = {
    getMerkleRoot
}