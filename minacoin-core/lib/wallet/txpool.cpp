#include "txpool.hpp"

using namespace std; 

namespace minacoin { namespace lib { namespace wallet {
	
    TxPool::TxPool() {
        
    }
    
    TxPool::~TxPool() {
        
    }
    
    void TxPool::updateOrAdd(Transaction* tx) {
        Transaction* existing = this->existingTxById(tx->id()); 
        
        if (existing != NULL) {    
            for(std::vector<Transaction*>::iterator it = _transactions.begin(); it != _transactions.end(); ++it) {
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
            
    vector<Transaction*> TxPool::validTxs(const string& address) {
        vector<Transaction*> output;
        return output; 
    }
            
    void TxPool::clear() {
        _transactions.clear();
    }
}}}