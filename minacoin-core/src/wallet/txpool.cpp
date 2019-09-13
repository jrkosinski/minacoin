#include "txpool.hpp"
#include "../blockchain/blockchain.hpp"

using namespace std; 
using namespace minacoin::blockchain;

namespace minacoin::wallet { 
	
    TxPool::TxPool() {
        this->logTag("TXPL");
    }
    
    TxPool::~TxPool() {
        for(auto it = _transactions.begin(); it != _transactions.end(); ++it) {
            delete *it; 
        }
        _transactions.clear(); 
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
            
            float outputTotal = tx->totalOutput();
            
            //make sure that output total is equal to inputs 
            if (tx->input().amount == outputTotal) {
                
                //make sure that tx isn't already on the chain 
                if (!blockchain->containsDataItem(tx->id())) {
                    
                    //verify signature 
                    if (Transaction::verify(tx)) {
                        output.push_back(tx); 
                    }
                    else {
                        this->logger()->warn("transaction %s not verified", tx->id().c_str()); 
                    }
                }
                else {
                    this->logger()->warn("transaction %s is already in the blockchain", tx->id().c_str()); 
                }
            }
            else {
                this->logger()->warn("transaction %s is invalid; input amount %f doesn't match output amount %f", tx->id().c_str(), tx->inputAmount(), outputTotal);
            }
        }
        
        return output; 
    }
            
    void TxPool::clear() {
        _transactions.clear();
    }
}
