#ifndef __SERVER_H__
#define __SERVER_H__

#include "../inc.h" 
#include "../blockchain/blockchain.hpp"
#include "../wallet/wallet.hpp"
#include "../wallet/txpool.hpp"
#include "../wallet/transaction.hpp" 
#include "../miner/miner.hpp" 

using namespace minacoin::blockchain; 
using namespace minacoin::wallet;
using namespace minacoin::miner;

namespace minacoin::server {
    class Server {
        private: 
            Blockchain* _blockchain; 
            TxPool* _txPool; 
            Wallet* _wallet; 
            Miner* _miner;
            
        public: 
            Blockchain* blockchain() { return _blockchain; }
            TxPool* txPool() { return _txPool; }
            Wallet* wallet() { return _wallet; }
            Miner* miner() { return _miner; }
            
        public: 
            Server(): Server(true) { }
            Server(bool initFromDb); 
            ~Server(); 
    };
}

#endif 
