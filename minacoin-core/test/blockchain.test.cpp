#include "../src/blockchain/block.hpp"
#include "../src/blockchain/blockchain.hpp"
#include "../src/blockchain/iblockdataitem.hpp"
#include "../src/wallet/wallet.hpp"
#include "../src/wallet/transaction.hpp"
#include "../src/wallet/txpool.hpp"
#include "../src/server/server.hpp"
#include "../src/util/crypto/crypto.h"
#include "../src/util/database/filedatabase.hpp"

#include <stdio.h>
#include <vector> 

using namespace minacoin::blockchain; 
using namespace minacoin::wallet;
using namespace minacoin::server;

#define CATCH_CONFIG_MAIN

#include "include/catch.hpp"
#include "include/test.h"

TEST_CASE("blockchain")
{
    initializeIoc(); 
    
    SECTION("genesis block") {
        Blockchain* blockchain = new Blockchain(); 
        
        REQUIRE(blockchain->height() == 1);
    }
    
    SECTION("blockchain serialization") {
        Blockchain* blockchain = new Blockchain(); 
        
        string json = blockchain->toJson(); 
        
        Blockchain* blockchain2 = new Blockchain(); 
        blockchain2->fromJson(json); 
        
        REQUIRE(blockchain->height() == blockchain2->height());
    }
    
    SECTION("block integrity") {
        auto server = make_unique<Server>(false); 
        auto wallet = server->wallet(); 
        auto blockchain = server->blockchain(); 
        
        //add some transactions 
        Transaction* trans1 = wallet->send("48948948948", 100, server->blockchain(), server->txPool());
        Transaction* trans2 = wallet->send("4894894e948", 100, server->blockchain(), server->txPool());
        Transaction* trans3 = wallet->send("489489489dd", 100, server->blockchain(), server->txPool());
        
        //mine them 
        server->miner()->mine();
        
        Block* lastBlock = blockchain->lastBlock(); 
        Block* prevBlock = blockchain->blockAt(blockchain->height() -2 ); 
        
        //ensure that block's lastHash is the same as the hash of the prev block 
        REQUIRE(lastBlock->lastHash() == prevBlock->hash());
        
        //ensure that block has 3 transactions + 1 reward transaction
        REQUIRE(lastBlock->data().size() == 4); 
        
        //ensure that block hash has the appropriate number of zeros 
        size_t zeroCount = 0;
        for (size_t n=0; n<lastBlock->hash().length(); n++) {
            if (lastBlock->hash()[n] == '0') {
                zeroCount++;
            } else {
                break;
            }
        }
        REQUIRE(zeroCount == lastBlock->difficulty()); 
        
        //lower difficulty
        uint newDifficulty = Block::adjustDifficulty(lastBlock, lastBlock->timestamp() + 300000); 
        REQUIRE(newDifficulty == (lastBlock->difficulty() -1)); 
       
        //raise difficulty
        newDifficulty = Block::adjustDifficulty(lastBlock, lastBlock->timestamp() + 1); 
        REQUIRE(newDifficulty == (lastBlock->difficulty() +1)); 
        
        /*
        FileDatabase* fdb = new FileDatabase(); 
        fdb->saveBlockchain(blockchain); 
        */
    }
}

