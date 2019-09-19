#ifndef __TX_POOL_H__
#define __TX_POOL_H__

#include "../inc.h"
#include "transaction.hpp"
#include "../blockchain/blockchain.hpp"
#include "../loggingobj.hpp"
#include <vector>
#include <map>
#include <string>

using namespace minacoin::blockchain;

namespace minacoin::wallet { 
	class TxPool: public LoggingObj {
		private: 
            std::map<std::string, Transaction*> _transactions;   
            
        public: 
            //std::map<std::string, Transaction*> transactions() { return _transactions; }
            size_t txCount() const { return _transactions.size(); }
            
        public: 
            TxPool(); 
            ~TxPool(); 
            
        public: 
            void updateOrAdd(Transaction* tx); 
            Transaction* existingTxById(const string& id) const; 
            Transaction* existingTxBySender(const string& address) const; 
            vector<Transaction*> pendingTxs(const string& address) const; 
            vector<Transaction*> validTxs(const Blockchain* blockchain) const;
            void clear();
    }; 
}

#endif