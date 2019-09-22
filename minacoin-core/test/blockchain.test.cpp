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
        REQUIRE(blockchain->lastBlock()->hash() == __GENESIS_BLOCK_HASH__); 
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
        addDataToBlockchain(server.get(), 3);
        
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
        
        //blockchain is valid 
        REQUIRE(blockchain->isValid()); 
        
        /*
        FileDatabase* fdb = new FileDatabase(); 
        fdb->saveBlockchain(blockchain); 
        */
    }
    
    SECTION("validates valid chain") {
        auto server = make_unique<Server>(false); 
        auto wallet = server->wallet(); 
        auto blockchain = server->blockchain(); 
        
        //add some transactions 
        addDataToBlockchain(server.get(), 3);
        
        //blockchain is valid 
        REQUIRE(blockchain->isValid()); 
    }
    
    SECTION("invalidates corrupt chain") {
        auto server = make_unique<Server>(false); 
        auto wallet = server->wallet(); 
        auto blockchain = server->blockchain(); 
        
        //add some transactions 
        addDataToBlockchain(server.get(), 3);
        
        //modify some data to mess with the hash 
        blockchain->lastBlock()->fromJson("{\"data\":[],\"difficulty\":3,\"hash\":\"12121\",\"lastHash\":\"---\",\"nonce\":0,\"timestamp\":0}"); 
        
        //blockchain is not valid 
        REQUIRE(!blockchain->isValid()); 
    }
    
    SECTION("invalidates a chain with corrupt genesis block") {
        auto server = make_unique<Server>(false); 
        auto wallet = server->wallet(); 
        auto blockchain = server->blockchain(); 
        
        //add some transactions 
        addDataToBlockchain(server.get(), 3);
        
        //mess with the genesis block 
        blockchain->blockAt(0)->fromJson("{\"data\":[],\"difficulty\":3,\"hash\":\"12121\",\"lastHash\":\"---\",\"nonce\":0,\"timestamp\":0}"); 
        
        //blockchain is not valid 
        REQUIRE(!blockchain->isValid()); 
    }
    
    /*
    SECTION("replaces a valid chain") {
        auto server1 = make_unique<Server>(false); 
        auto server2 = make_unique<Server>(false); 
        
        addDataToBlockchain(server1.get(), 3);
        
        addDataToBlockchain(server2.get(), 3);
        addDataToBlockchain(server2.get(), 3);
        
        auto blockCount1 = server1->blockchain()->height(); 
        
        server1->blockchain()->replaceChain(server2->blockchain()); 
        
        auto blockCount2 = server1->blockchain()->height(); 
        
        REQUIRE(blockCount2 > blockCount1); 
        REQUIRE(blockCount2 == (blockCount1 + 1)); 
    }
    
    SECTION("does not replace chain with a shorter chain") {
        auto server1 = make_unique<Server>(false); 
        auto server2 = make_unique<Server>(false); 
        
        addDataToBlockchain(server1.get(), 3);
        addDataToBlockchain(server1.get(), 3);
        
        addDataToBlockchain(server2.get(), 3);
        
        auto blockCount1 = server1->blockchain()->height(); 
        
        server1->blockchain()->replaceChain(server2->blockchain()); 
        
        auto blockCount2 = server1->blockchain()->height(); 
        
        REQUIRE(server1->blockchain()->height() > server2->blockchain()->height());
        REQUIRE(blockCount2 == blockCount1); 
    }
    */
}
