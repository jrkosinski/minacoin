'use strict';

class IP2PServer {
    listen() {}
    syncChain() {}
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