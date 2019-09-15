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
}

