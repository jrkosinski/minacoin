#include "../lib/blockchain/block.hpp"
#include "../lib/blockchain/blockchain.hpp"
#include "../lib/blockchain/iblockdataitem.hpp"
#include "../lib/wallet/wallet.hpp"
#include "../lib/wallet/transaction.hpp"
#include "../lib/wallet/txpool.hpp"
#include "../lib/util/crypto/crypto.h"

#include <stdio.h>
#include <iostream> 
#include <vector> 

using namespace std;
using namespace minacoin::lib::blockchain; 
using namespace minacoin::lib::wallet;

#define CATCH_CONFIG_MAIN

#include "catch.hpp"

TEST_CASE("blockchain")
{
    SECTION("genesis block") {
        Blockchain* blockchain = new Blockchain(); 
        
        REQUIRE(blockchain->height() == 1);
    }
    
    SECTION("block serialization") {
        vector<IBlockDataItem*> data;
        Block* block = new Block(11, "last-hash", "my-hash", data, 13, 24);
        
        string json = block->toJson(); 
        vector<IBlockDataItem*> data2;
        Block* block2 = Block::createFromJson(json);
        
        REQUIRE(block->timestamp() == block2->timestamp()); 
        REQUIRE(block->lastHash().compare(block2->lastHash()) == 0); 
        REQUIRE(block->nonce() == block2->nonce()); 
        REQUIRE(block->difficulty() == block2->difficulty()); 
    }
    
    SECTION("blockchain serialization") {
        Blockchain* blockchain = new Blockchain(); 
        
        string json = blockchain->toJson(); 
        
        Blockchain* blockchain2 = new Blockchain(); 
        blockchain2->fromJson(json); 
        
        REQUIRE(blockchain->height() == blockchain2->height());
    }
}

