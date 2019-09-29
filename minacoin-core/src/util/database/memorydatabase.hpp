#ifndef __MEMORY_DATABASE_H__
#define __MEMORY_DATABASE_H__

#include "../../inc.h" 
#include "idatabase.hpp"

using namespace minacoin::wallet;
using namespace minacoin::blockchain;

namespace minacoin::util::database {
    
	/**
	 * Defines an IDatabase which doesn't write to anything, but stores its data in memory only. 
     * Useful for unit tests & testing in general.
	 */ 
    class MemoryDatabase: public IDatabase {
        private: 
            Blockchain* _blockchain;
            Wallet* _wallet; 
            
        public: 
            MemoryDatabase() { 
                this->_blockchain = nullptr;
                this->_wallet = nullptr;
            }
            
        public:             
            virtual Wallet* getWallet() override {
                return _wallet;
            }
            
            virtual Blockchain* getBlockchain() override {
                return _blockchain;
            }
            
            virtual void saveWallet(Wallet* wallet) override {
                this->_wallet = wallet;
            }
             
            virtual void saveBlockchain(Blockchain* blockchain) override {
                this->_blockchain = blockchain;
            } 
            
        public: 
            virtual void clear() { 
                _blockchain = nullptr;
                _wallet = nullptr;
            }
    }; 
}

#endif