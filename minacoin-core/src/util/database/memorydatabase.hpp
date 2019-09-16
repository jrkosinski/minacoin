#ifndef __MEMORY_DATABASE_H__
#define __MEMORY_DATABASE_H__

#include "../../inc.h" 
#include "idatabase.hpp"

using namespace minacoin::wallet;
using namespace minacoin::blockchain;

namespace minacoin::util::database {
    class MemoryDatabase: public IDatabase {
        private: 
            Blockchain& _blockchain;
            Wallet& _wallet; 
            
        public: 
            virtual Wallet* getWallet() override {
                return &_wallet;
            }
            
            virtual Blockchain* getBlockchain() override {
                return &_blockchain;
            }
            
            virtual void saveWallet(Wallet& wallet) override {
                this->_wallet = wallet;
            }
             
            virtual void saveBlockchain(Blockchain& blockchain) override {
                this->_blockchain = blockchain;
            } 
    }; 
}

#endif