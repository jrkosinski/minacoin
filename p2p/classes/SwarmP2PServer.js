'use strict';

const LOG_TAG = 'SP2P';

const config = require('../../config');
const ioc = require('../../util/iocContainer');
const { IP2PServer, MessageType } = require('./IP2PServer');

const logger = ioc.loggerFactory.createLogger(LOG_TAG);
const exception = ioc.ehFactory.createHandler(logger);

/**
 * minacoin: TestP2PServer
 * -----------------------
 * a mock p2p server to be used for testing
 *
 * author: John R. Kosinski
 */
class SwarmP2PServer extends IP2PServer {
    get blockchain() { return this._blockchain; }
    get sockets() { return this._sockets; }
    get transactionPool() { return this._transactionPool; }
    get wallet() { return this._wallet; }

    constructor(blockchain, txPool, wallet) {
        super();

        this._blockchain = blockchain;
        this._sockets = [];
        this._transactionPool = txPool;
        this._wallet = wallet;
    }

    listen() {
        exception.try(() => {

        });
    }

    broadcastTransaction(transaction){
        this.sockets.forEach(socket =>{
            this.sendTransaction(socket,transaction);
        });
    }

    sendTransaction(socket, transaction) {
        exception.try(() => {
            socket.send(JSON.stringify({
                type: MessageType.transaction,
                transaction: transaction
            }));
        });
    }

    syncChain() {
        exception.try(() => {
            this.sockets.forEach(s => {
                this.sendChain(s);
            });
        });
    }

    sendChain(socket) {
        exception.try(() => {
            socket.send(JSON.stringify({
                type: MessageType.chain,
                chain: this.blockchain.chain
            }));
        });
    }

    broadcastClearTransactions() {
        exception.try(() => {
            this.sockets.forEach(s => {
                s.send(JSON.stringify({
                    type: MessageType.clear_transactions
                }));
            });
        });
    }

    updateWalletBalance() {
        exception.try(() => {
            if (this.wallet && this.blockchain) {
                this.wallet.updateBalance(this.blockchain);
            }
        });
    }
}

class Factory {
    /*IP2PServer*/ createInstance(blockchain, txPool, wallet) {
        return new SwarmP2PServer(blockchain, txPool, wallet);
    }
}

const factory = new Factory();

module.exports = {
    factory,
    P2PServer: SwarmP2PServer
}