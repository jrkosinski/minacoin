'use strict';

const LOG_TAG = 'TXPL';

const Transaction = require('./Transaction');
const ioc = require('../../../util/iocContainer');

const logger = ioc.loggerFactory.createLogger(LOG_TAG);
const exception = ioc.ehFactory.createHandler(logger);

/**
 * minacoin: TransactionPool
 * -------------------------
 * pool of transactions that have not yet been included in the blockchain
 * (but may be eligible to be mined)
 *
 * author: John R. Kosinski
 */
class TransactionPool {
    get transactions() { return this._transactions; }
    get txCount() { return this._transactions.length; }

    /**
     * constructor
     */
    constructor() {
        this._transactions = [];
    }

    updateOrAddTransaction(transaction) {
        exception.try(() => {
            //get existing trans if exists
            let existing = this.transactions.find(t => t.id === transaction.id);

            if (existing) {
                logger.info(`updating transaction ${transaction.id}: ${transaction}`);
                this.transactions[this.transactions.indexOf(existing)] = transaction;
            }
            else {
                logger.info(`creating new transaction: ${transaction}`);
                this.transactions.push(transaction);
            }
        });
    }

    /*Transaction*/ existingTransaction(address) {
        return exception.try(() => {
            return this.transactions.find(t => t.input.address === address);
        });
    }
    
    /*Transaction[]*/ pendingTransactions(address) {
        return exception.try(() => {
            return this.transactions.filter(t => t.input.address === address);
        });
    }

    /**
     * gets a list of valid transactions; ones whose total output is equal to input
     * with valid signature
     * @param {Blockchain} blockchain (optional) if specified, will check for duplicate transaction 
     * id in chain (transaction duplicate is not valid)
     * @returns {Transaction[]}
     */
    /*Transaction[]*/ validTransactions(blockchain) {
        return this.transactions.filter(transaction => {
            return exception.try(() => {
                // calculate total of all outputs
                const outputTotal = transaction.outputs ?
                    transaction.outputs.reduce((total, output)=>{
                        return total + output.amount;
                    },0)
                    : 0;
                
                //make sure the transaction hasn't already been added to the chain
                if (blockchain && blockchain.containsTransaction(transaction.id)){
                    logger.warn(`transaction ${transaction.id} already exists on the chain and should not be included`); 
                    return;
                }

                //check that outputs == input
                if (transaction.input.amount !== outputTotal ) {
                    logger.warn(`invalid transaction ${transaction.id} from ${transaction.input.address}`);
                    return;
                }

                //check valid signature
                if (!Transaction.verifyTransaction(transaction)) {
                    logger.warn(`invalid signature for transaction ${transaction.id} from ${transaction.input.address}`);
                    return;
                }

                return transaction;
            });
        });
    }

    /**
     * clears all transactions from pool
     */
    clear() {
        this._transactions = [];
    }
}

module.exports = TransactionPool;