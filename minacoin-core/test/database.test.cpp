#include "../src/blockchain/block.hpp"
#include "../src/blockchain/blockchain.hpp"
#include "../src/blockchain/iblockdataitem.hpp"
#include "../src/wallet/wallet.hpp"
#include "../src/wallet/transaction.hpp"
#include "../src/wallet/txpool.hpp"
#include "../src/server/server.hpp"
#include "../src/util/crypto/crypto.h"
#include "../src/util/database/idatabase.hpp"
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
    
    SECTION("database write and read") {
        auto server = make_unique<Server>();
        
        addDataToBlockchain(server.get()); 
        
        auto db = IOC::resolve<IDatabase>(); 
        
        db->saveBlockchain(*(server->blockchain()));
        db->saveWallet(*(server->wallet()));
        
    }
}

