#ifndef __TX_POOL_H__
#define __TX_POOL_H__

#include "../inc.h"
#include "transaction.hpp"
#include "../blockchain/blockchain.hpp"
#include "../loggingobj.hpp"
#include <vector>

using namespace minacoin::blockchain;

namespace minacoin::wallet { 
	class TxPool: public LoggingObj {
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
            vector<Transaction*> validTxs(Blockchain* blockchain);
            void clear();
    }; 
}

#endif