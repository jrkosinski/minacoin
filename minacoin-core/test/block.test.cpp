#include "include/test.h"
#include "include/catch.hpp"

#include "../src/blockchain/block.hpp"
#include "../src/blockchain/blockchain.hpp"
#include "../src/blockchain/iblockdataitem.hpp"
#include "../src/wallet/wallet.hpp"
#include "../src/wallet/transaction.hpp"
#include "../src/wallet/txpool.hpp"
#include "../src/util/crypto/crypto.h"

#include <stdio.h>
#include <vector> 

using namespace minacoin::blockchain; 
using namespace minacoin::wallet;

TEST_CASE("block")
{
    initializeIoc(); 
    
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
        REQUIRE(Block::blockHash(block) == Block::blockHash(block2)); 
        
        //require that block data matches 
        REQUIRE(block->dataEquals(block2)); 
    }
    
    SECTION("block hash & difficulty") {
        vector<IBlockDataItem*> data;
        Block* block = new Block(11, "last-hash", "my-hash", data, 13, 24);
        
        string json = block->toJson(); 
        vector<IBlockDataItem*> data2;
        Block* block2 = Block::createFromJson(json);
    }
}

