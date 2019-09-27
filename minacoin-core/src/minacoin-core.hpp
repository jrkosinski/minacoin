#ifndef __MINACOIN_CORE_H__
#define __MINACOIN_CORE_H__

#include "inc.h" 
#include "ioc.hpp"
#include "blockchain/block.hpp"
#include "blockchain/blockchain.hpp"
#include "wallet/transaction.hpp"
#include "wallet/wallet.hpp"
#include "wallet/txpool.hpp"
#include "miner/miner.hpp"
#include "server/server.hpp"
#include "util/logging/ilogger.hpp"
#include "util/logging/iloggerfactory.hpp"
#include "util/logging/spdloggerfactory.hpp"
#include "util/logging/spdlogger.hpp"
#include "util/database/idatabase.hpp"
#include "util/database/filedatabase.hpp"

using namespace std;
using namespace minacoin::blockchain;
using namespace minacoin::wallet;
using namespace minacoin::server;
using namespace minacoin::miner;

typedef struct {
    float balance;
    string address;
} WalletInfo; 

typedef struct {
    WalletInfo wallet; 
    size_t chainSize; 
    size_t txPoolSize; 
} BCInfo; 

namespace minacoin::api {
    void initialize(bool initFromDb = true); 
    vector<Transaction*> getTxPoolTransactions(); 
    BCInfo getBlockchainInfo(); 
    vector<Block*> getBlocks(); 
    Transaction* transferTo(const string& recipAddress, float amount); 
    Block* mine(); 
    bool replaceChain(const vector<Block*>& blocks); 
    bool addTxToPool(const Transaction* tx); 
    void clearTxPool(); 
    void deallocate();
}

#endif 