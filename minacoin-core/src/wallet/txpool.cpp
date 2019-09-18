#include "txpool.hpp"
#include "../blockchain/blockchain.hpp"

using namespace minacoin::blockchain;

namespace minacoin::wallet { 
	
    TxPool::TxPool() {
        this->initLogger("TXPL");
    }
    
    TxPool::~TxPool() {
        for(auto it = _transactions.begin(); it != _transactions.end(); ++it) {
            delete it->second; 
        }
        _transactions.clear(); 
    }
    
    void TxPool::updateOrAdd(Transaction* tx) {
        Transaction* existing = this->existingTxById(tx->id()); 
        
        if (existing != NULL) {    
            for(auto it = _transactions.begin(); it != _transactions.end(); ++it) {
                Transaction* t = it->second;
                if (t->id() == tx->id()) {
                    _transactions.erase(it);
                    break;
                }
            }
        }
            
        _transactions.emplace(tx->id(), tx); 
    } 
            
    Transaction* TxPool::existingTxById(const string& id) const {
        try {
            return this->_transactions.at(id);
        }
        catch(std::out_of_range& rangeEx) {
            return nullptr;
        }
    }
            
    Transaction* TxPool::existingTxBySender(const string& address) const {
        for(auto it = _transactions.begin(); it != _transactions.end(); ++it) {
            auto tx = it->second; 
            
            if (tx->sender() == address) {
                return tx;
            }
        }
        
        return nullptr;
    }
            
    vector<Transaction*> TxPool::pendingTxs(const string& address) const {
        vector<Transaction*> output;
        //TODO: implement (MED)
        return output; 
    } 
            
    vector<Transaction*> TxPool::validTxs(Blockchain* blockchain) const {
        vector<Transaction*> output;
        
        for(auto it = _transactions.begin(); it != _transactions.end(); ++it) {
            auto tx = it->second; 
            
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
        //TODO: should delete transactions? 
        _transactions.clear();
    }
}
