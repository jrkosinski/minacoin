#ifndef __MINER_H__
#define __MINER_H__

#include "../inc.h"
#include "../blockchain/blockchain.hpp"
#include "../blockchain/block.hpp"
#include "../wallet/wallet.hpp"
#include "../wallet/txpool.hpp"
#include "../loggingobj.hpp"

using namespace minacoin::blockchain;
using namespace minacoin::wallet;

namespace minacoin::miner {
    class Miner: public LoggingObj {
        private: 
            Blockchain* _blockchain;
            Wallet* _wallet;
            TxPool* _txPool;
        
        public: 
            Miner(Blockchain* blockchain, Wallet* wallet, TxPool* txPool); 
            
        public: 
            Block* mine(); 
    };
}

#endif 
