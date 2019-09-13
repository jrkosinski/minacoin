#ifndef __TX_POOL_H__
#define __TX_POOL_H__

#include "transaction.hpp"
#include <vector>

using namespace std; 

namespace minacoin::wallet { 
	class TxPool {
		private: 
            vector<Transaction*> _transactions;  //TODO: should be a map
            
        public: 
            vector<Transaction*> transactions() { return _transactions; }
            size_t txCount() { return _transactions.size(); }
            
        public: 
            TxPool(); 
            ~TxPool(); 
            
        public: 
            void updateOrAdd(Transaction* tx); 
            Transaction* existingTxById(const string& id); 
            Transaction* existingTxBySender(const string& address); 
            vector<Transaction*> pendingTxs(const string& address); 
            vector<Transaction*> validTxs(const string& address);
            void clear();
    }; 
}

#endif