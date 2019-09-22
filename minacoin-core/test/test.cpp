#include "include/test.h"
#include "include/catch.hpp"
#include "../src/inc.h"
#include "../src/ioc.hpp"
#include "../src/util/logging/iloggerfactory.hpp"
#include "../src/util/logging/spdloggerfactory.hpp"
#include "../src/util/database/idatabase.hpp"
#include "../src/util/database/filedatabase.hpp"
#include "../src/util/database/memorydatabase.hpp"
#include "../src/blockchain/block.hpp"
#include "../src/blockchain/blockchain.hpp"
#include "../src/blockchain/iblockdataitem.hpp"
#include "../src/wallet/wallet.hpp"
#include "../src/wallet/transaction.hpp"
#include "../src/wallet/txpool.hpp"
#include "../src/server/server.hpp"

using namespace minacoin::util;
using namespace minacoin::util::logging;
using namespace minacoin::util::database;
using namespace minacoin::server;


IOC* initializeIoc() {
    IOC* ioc = IOC::instance(); 
    IOC::registerService<ILoggerFactory>(std::make_shared<SpdLoggerFactory>()); 
    IOC::registerService<IDatabase>(std::make_shared<MemoryDatabase>()); 
    return ioc;
}

void addDataToBlockchain(Server* server, size_t count) {
	
    //add some transactions 
    for(size_t n=0; n<count; n++) {
        Transaction* tx = server->wallet()->send("48948948948", 10, server->blockchain(), server->txPool());
    }
    
    //mine them 
    server->miner()->mine();
}
