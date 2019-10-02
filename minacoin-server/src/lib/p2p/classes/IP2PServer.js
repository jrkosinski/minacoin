'use strict';

/**
 * minacoin: IP2PServer
 * --------------------
 * interface for a p2p server 
 *
 * author: John R. Kosinski
 */
class IP2PServer {
    listen() {}
    syncChain() {}
    pullChain() {}
    peerList() {}
    broadcastTransaction(transaction) {}
    broadcastClearTransactions() {}
};

//message type enum
const MessageType = {
    chain: 'CHAIN',
    transaction: 'TRANSACTION',
    clear_transactions: 'CLEAR_TRANSACTIONS',
    chain_request: 'CHAIN_REQUEST'
};

module.exports = { IP2PServer, MessageType };