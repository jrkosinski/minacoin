#include "../src/blockchain/block.hpp"
#include "../src/blockchain/blockchain.hpp"
#include "../src/blockchain/iblockdataitem.hpp"
#include "../src/wallet/wallet.hpp"
#include "../src/wallet/transaction.hpp"
#include "../src/wallet/txpool.hpp"
#include "../src/miner/miner.hpp"
#include "../src/server/server.hpp"

#include <stdio.h>
#include <vector> 

using namespace minacoin::blockchain; 
using namespace minacoin::wallet;
using namespace minacoin::miner;
using namespace minacoin::server;

#include "include/catch.hpp"
#include "include/test.h"

TEST_CASE("miner")
{
    initializeIoc(); 
    
    SECTION("mine a block") {
        auto server = make_unique<Server>(); 
        auto wallet = server->wallet(); 
        
        //add some transactions 
        Transaction* trans1 = wallet->send("48948948948", 100, server->blockchain(), server->txPool());
        Transaction* trans2 = wallet->send("4894894e948", 100, server->blockchain(), server->txPool());
        Transaction* trans3 = wallet->send("489489489dd", 100, server->blockchain(), server->txPool());
        
        //txpool should have 3 transactions
        REQUIRE(server->txPool()->txCount() == 3); 
        
        //mine them 
        server->miner()->mine();
        
        //txpool should have 0 transactions
        REQUIRE(server->txPool()->txCount() == 0); 
        REQUIRE(server->blockchain()->height() == 2); 
    }
}

