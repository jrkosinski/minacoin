#include "../src/blockchain/block.hpp"
#include "../src/blockchain/blockchain.hpp"
#include "../src/blockchain/iblockdataitem.hpp"
#include "../src/wallet/wallet.hpp"
#include "../src/wallet/transaction.hpp"
#include "../src/wallet/txpool.hpp"
#include "../src/server/server.hpp"
#include "../src/util/crypto/crypto.h"
#include "../src/util/database/idatabase.hpp"
#include "../src/util/database/filedatabase.hpp"
#include "../src/ioc.hpp"

#include <stdio.h>
#include <vector> 

using namespace minacoin::blockchain; 
using namespace minacoin::wallet;
using namespace minacoin::server;
using namespace minacoin::util::database;

#include "include/catch.hpp"
#include "include/test.h"

TEST_CASE("database")
{
    initializeIoc(); 
    
    SECTION("blockchain write and read") {
        auto server = make_unique<Server>();
        
        addDataToBlockchain(server.get()); 
        
        auto blockchain = server->blockchain();
        
        auto db = make_unique<FileDatabase>();
        
        db->saveBlockchain(server->blockchain());
        
        auto blockchain2 = db->getBlockchain(); 
        
        REQUIRE(blockchain2);
        REQUIRE(blockchain2->height() == blockchain->height());
        REQUIRE(blockchain2->lastBlock()->data().size() == blockchain->lastBlock()->data().size());
    }
    
    SECTION("wallet write and read") {
        auto server = make_unique<Server>();
        
        addDataToBlockchain(server.get()); 
        
        auto wallet = server->wallet(); 
        
        auto db = IOC::resolve<IDatabase>(); 
        
        db->saveWallet(server->wallet());
        
        auto wallet2 = db->getWallet();
        
        REQUIRE(wallet2); 
        REQUIRE(wallet2->address() == wallet->address());
        REQUIRE(wallet2->balance() == wallet->balance());
    }
}

