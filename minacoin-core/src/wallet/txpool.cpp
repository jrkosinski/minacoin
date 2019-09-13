#include "txpool.hpp"
#include "../blockchain/blockchain.hpp"

using namespace std; 
using namespace minacoin::blockchain;

namespace minacoin::wallet { 
	
    TxPool::TxPool() {
        this->logTag("TXPL");
    }
    
    TxPool::~TxPool() {
        
    }
    
    void TxPool::updateOrAdd(Transaction* tx) {
        Transaction* existing = this->existingTxById(tx->id()); 
        
        if (existing != NULL) {    
            for(auto it = _transactions.begin(); it != _transactions.end(); ++it) {
                Transaction* t = *it;
                if (t->id() == tx->id()) {
                    _transactions.erase(it);
                    break;
                }
            }
        }
            
        _transactions.push_back(tx); 
    } 
            
    Transaction* TxPool::existingTxById(const string& id) {
        return NULL;
    }
            
    Transaction* TxPool::existingTxBySender(const string& address) {
        return NULL;
    }
            
    vector<Transaction*> TxPool::pendingTxs(const string& address) {
        vector<Transaction*> output;
        return output; 
    } 
            
    vector<Transaction*> TxPool::validTxs(Blockchain* blockchain) {
        vector<Transaction*> output;
        
        for(auto it = _transactions.begin(); it != _transactions.end(); ++it) {
            auto tx = *it; 
            
            float outputTotal = (tx->outputSelf().amount + tx->outputRecip().amount);
            
            //make sure that output total is equal to inputs 
            if (tx->input().amount == outputTotal) {
                
                //make sure that tx isn't already on the chain 
                if (!blockchain->containsDataItem(tx->id())) {
                    
                    //verify signature 
                    if (Transaction::verify(tx)) {
                        output.push_back(tx); 
                    }
                    else {
                        
                    }
                }
                else {
                    
                }
            }
            else {
                
            }
        }
        
        return output; 
        
        /*
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
            */
    }
            
    void TxPool::clear() {
        _transactions.clear();
    }
}
