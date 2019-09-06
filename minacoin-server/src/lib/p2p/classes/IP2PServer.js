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
    peerList() {}
    broadcastTransaction(transaction) {}
    broadcastClearTransactions() {}
};

//message type enum
const MessageType = {
    chain: 'CHAIN',
    transaction: 'TRANSACTION',
    clear_transactions: 'CLEAR_TRANSACTIONS'
};

module.exports = { IP2PServer, MessageType };