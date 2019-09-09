#include "../lib/blockchain/block.hpp"
#include "../lib/blockchain/blockchain.hpp"
#include "../lib/wallet/wallet.hpp"
#include "../lib/wallet/transaction.hpp"
#include "../lib/wallet/txpool.hpp"
#include "../lib/util/crypto.h"

#include <stdio.h>
#include <iostream> 

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
}

