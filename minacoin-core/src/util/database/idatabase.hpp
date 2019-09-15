#ifndef __IDATABASE_H__
#define __IDATABASE_H__

#include "../inc.h" 
#include "../../ijsonserializable.hpp"
#include "../../wallet/wallet.hpp"
#include "../../blockchain/blockchain.hpp"

using namespace minacoin::wallet;
using namespace minacoin::blockchain;

namespace minacoin::util::database {
    class IDatabase {
        public: 
            virtual Wallet* getWallet() __abstract_method__; 
            virtual Blockchain* getBlockchain() __abstract_method__; 
            
            virtual void saveWallet(const Wallet& wallet) __abstract_method__; 
            virtual void saveBlockchain(const Blockchain& blockchain) __abstract_method__; 
    }; 
}

#endif