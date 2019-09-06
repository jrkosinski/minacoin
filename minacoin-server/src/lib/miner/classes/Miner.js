'use strict';

const LOG_TAG = 'MNR';

const ioc = require('../../../util/iocContainer');
const { Transaction, Wallet } = require('../../wallet');

const logger = ioc.loggerFactory.createLogger(LOG_TAG);
const exception = ioc.ehFactory.createHandler(logger);

/**
 * minacoin: Miner
 * ---------------
 * handles mining new coins 
 *
 * author: John R. Kosinski
 */
class Miner {
    get blockchain() { return this._blockchain; }
    get transactionPool() { return this._transactionPool; }
    get wallet() { return this._wallet; }
    get p2pServer() { return this._p2pServer; }

    /**
     * constructor 
     * @param {Blockchain} blockchain 
     * @param {TransactionPool} transactionPool 
     * @param {Wallet} wallet 
     * @param {IP2PServer} p2pServer 
     */
    constructor(blockchain, transactionPool, wallet, p2pServer) {
        this._blockchain = blockchain;
        this._transactionPool = transactionPool;
        this._wallet = wallet;
        this._p2pServer = p2pServer;
    }

    /**
     * selects transactions from the transaction pool to add to a new block, creates 
     * & adds the new block to the blockchain, and returns the new block. 
     * @returns {Block}
     */
    /*Block*/ mine() {
        return exception.try(() => {
            //get transactions from transaction pool
            const validTransactions = this.transactionPool.validTransactions();
            
            if (validTransactions && validTransactions.length > 0)  {
                //add a reward for self
                validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()));
    
                //add them into a block
                const block = this.blockchain.addBlock(validTransactions);
    
                if (block) {
                    //sync the chain
                    if (this.p2pServer) {
                        this.p2pServer.syncChain();
                    }
        
                    //clear the transaction pool
                    this.transactionPool.clear();
        
                    //broadcast directive to clear transaction pool
                    if (this.p2pServer) {
                        this.p2pServer.broadcastClearTransactions();
                    }
                }
                else {
                    //clear the transaction pool; maybe we have an old or corrupt pool
                    this.transactionPool.clear();
                }
    
                return block;
            }
            else {
                logger.info('no valid transactions available to mine'); 
                return null; 
            }
        });
    }
}

module.exports = Miner;