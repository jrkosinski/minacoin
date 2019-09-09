#include "wallet.hpp"
#include "../util/crypto.h"

using namespace std; 

namespace minacoin { namespace lib { namespace wallet { 
	
    Wallet::Wallet() {
        this->_balance = 500; //TODO: add config & get from config
        this->_keyPair = minacoin::lib::util::crypto::generateKeyPair();
        this->_address = this->_keyPair->publicKey();

        //logger.info(`wallet created: public key is ${this._publicKey.toString()}`);
    }
    
    Wallet::~Wallet() {
        
    }
    
	void Wallet::sign(const string& data) {
        
    }
    
    Transaction* Wallet::send(const string& recipient, float amount, Blockchain* blockchain, TxPool* txPool)  {
        //logger.info(`creating transaction: send ${amount} to ${recipient}`);

        //update balance 
        this->updateBalance(blockchain);
                
        //disallow transactions to myself 
        if (recipient == this->address()) {
            //logger.warn('cannot send a transaction to yourself!'); 
            return NULL; 
        }

        //disallow transaction if more than balance
        if (amount > this->balance()) {
            //logger.warn(`amount: ${amount} exceeds the current balance: ${this.balance}`);
            return NULL;
        }

        //get existing transaction
        Transaction* transaction = NULL; //transactionPool.existingTransaction(this.publicKey);

        if (transaction != NULL) {
            /*
            //if existing transaction, we have to take its amount into account 
            //when calculating the balance 
            const combinedAmount = (amount + transaction.outputs[0].amount);
            if (combinedAmount > this.balance) {
                logger.warn(`combined amount: ${combinedAmount} exceeds the current balance: ${this.balance}`);
                return;
            }
                
            transaction.update(this, recipient, amount);
            */
        }
        else {
            transaction = Transaction::create(this->address(), recipient, this->balance(), amount);
            //transactionPool.updateOrAddTransaction(transaction);
        }
        
        //sign the transaction
        transaction->sign(this->_keyPair); 
        
        //update the transaction pool 
        txPool->updateOrAdd(transaction);

        return transaction;
    }
    
    float Wallet::updateBalance(Blockchain* blockchain) {
        
        //TODO: get from config 
        float balance = 500; 
        
        //get all data items from blockchain
        vector<IBlockDataItem*> dataItems = blockchain->getDataItems();
        
        //get all of my transactions 
        vector<Transaction*> inputTxs; 
        for(std::vector<IBlockDataItem*>::iterator it = dataItems.begin(); it != dataItems.end(); ++it) {
            Transaction* tx = (Transaction*)*it; 
            if (tx->input().address == this->address()) {
			    inputTxs.push_back(tx); 
            }
        }

        uint lastTransTime = 0;

        if (inputTxs.size() > 0) {
            Transaction* latestTx = inputTxs[0];
            for(std::vector<Transaction*>::iterator it = inputTxs.begin(); it != inputTxs.end(); ++it) {
                Transaction* tx = *it; 
                if (tx->timestamp() > latestTx->timestamp()) {
                    latestTx = tx;
                }
            }

            //balance is output back to sender
            balance = latestTx->outputSelf().amount; 

            // save the timestamp of the latest transaction made by the wallet
            lastTransTime = latestTx->timestamp();
        }

        // get the transactions that were addressed to this wallet ie somebody sent some money
        // and add its ouputs.
        // since we save the timestamp we would only add the outputs of the transactions received
        // only after the latest transactions made by us
        for(std::vector<IBlockDataItem*>::iterator it = dataItems.begin(); it != dataItems.end(); ++it) {
            Transaction* tx = (Transaction*)*it; 
            if (tx->timestamp() > lastTransTime) {
                if (tx->outputRecip().address == this->address()) {
                    balance += tx->outputRecip().amount; 
                }
            }
        }

        return balance;
    }
}}}


