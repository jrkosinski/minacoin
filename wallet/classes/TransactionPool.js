'use strict';

const LOG_TAG = 'TXPL';

const Transaction = require('./Transaction');
const ioc = require('../../util/iocContainer');

const logger = ioc.loggerFactory.createLogger(LOG_TAG);
const exception = ioc.ehFactory.createHandler(logger);

class TransactionPool {
    get transactions() { return this._transactions; }

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

    //valid transactions are ones whose total output is equal to input with valid signature
    /*Transaction[]*/ validTransactions() {
        return this.transactions.filter(transaction => {
            return exception.try(() => {
                // calculate total of all outputs
                const outputTotal = transaction.outputs ?
                    transaction.outputs.reduce((total, output)=>{
                        return total + output.amount;
                    },0)
                    : 0;

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

    clear() {
        this._transactions = [];
    }
}

module.exports = TransactionPool;