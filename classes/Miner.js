'use strict';

const LOG_TAG = 'MNR';

const ioc = require('../util/iocContainer');
const { Transaction, Wallet } = require('../wallet');

const logger = ioc.loggerFactory.createLogger(LOG_TAG);
const exception = ioc.ehFactory.createHandler(logger);

class Miner {
    get blockchain() { return this._blockchain; }
    get transactionPool() { return this._transactionPool; }
    get wallet() { return this._wallet; }
    get p2pServer() { return this._p2pServer; }

    constructor(blockchain, transactionPool, wallet, p2pServer) {
        this._blockchain = blockchain;
        this._transactionPool = transactionPool;
        this._wallet = wallet;
        this._p2pServer = p2pServer;
    }

    mine() {
        const validTransactions = this.transactionPool.validTransactions();

        validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()));

        const block = this.blockchain.addBlock(validTransactions);
        this.p2pServer.syncChain();

        this.transactionPool.clear();

        this.p2pServer.broadcastClearTransactions();

        return block;
    }
}

module.exports = Miner;