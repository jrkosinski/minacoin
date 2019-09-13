#include "../src/blockchain/block.hpp"
#include "../src/blockchain/blockchain.hpp"
#include "../src/blockchain/iblockdataitem.hpp"
#include "../src/wallet/wallet.hpp"
#include "../src/wallet/transaction.hpp"
#include "../src/wallet/txpool.hpp"
#include "../src/miner/miner.hpp"

#include <stdio.h>
#include <iostream> 
#include <vector> 

using namespace std;
using namespace minacoin::blockchain; 
using namespace minacoin::wallet;
using namespace minacoin::miner;

#include "include/catch.hpp"
#include "include/test.h"

TEST_CASE("miner")
{
    initializeIoc(); 
    
    SECTION("mine a block") {
        auto blockchain = make_unique<Blockchain>(); 
        auto txpool = make_unique<TxPool>(); 
        auto wallet = make_unique<Wallet>();
        auto miner = make_unique<Miner>(blockchain.get(), wallet.get(), txpool.get());
        
        //add some transactions 
        Transaction* trans1 = wallet->send("48948948948", 100, blockchain.get(), txpool.get());
        Transaction* trans2 = wallet->send("4894894e948", 100, blockchain.get(), txpool.get());
        Transaction* trans3 = wallet->send("489489489dd", 100, blockchain.get(), txpool.get());
        
        //txpool should have 3 transactions
        REQUIRE(txpool->txCount() == 3); 
        
        //mine them 
        miner->mine();
        
        //txpool should have 0 transactions
        REQUIRE(txpool->txCount() == 0); 
        REQUIRE(blockchain->height() == 2); 
    }
}

