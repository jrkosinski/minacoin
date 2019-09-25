#include "src/inc.h" 
#include "src/blockchain/block.hpp"
#include "src/blockchain/blockchain.hpp"
#include "src/wallet/wallet.hpp"
#include "src/wallet/transaction.hpp"
#include "src/wallet/txpool.hpp"
#include "src/miner/miner.hpp"
#include "src/util/database/idatabase.hpp"
#include "src/util/database/filedatabase.hpp"
#include "src/util/database/memorydatabase.hpp"
#include "src/util/crypto/crypto.h"

#include <stdio.h>

#include "src/util/logging/spdlogger.hpp"
#include "src/util/logging/spdloggerfactory.hpp"
#include "src/ioc.hpp"
#include "src/server/server.hpp"

#include "src/util/base64/base64.h"

using namespace minacoin::blockchain;
using namespace minacoin::wallet;
using namespace minacoin::miner;
using namespace minacoin::server;
using namespace minacoin::util::logging; 
using namespace minacoin::util::database; 

//TODO: go over all functions, replace immutable pointers with const ref&

IOC* initializeIoc() {
	IOC* ioc = IOC::instance(); 
	IOC::registerService<ILoggerFactory>(make_shared<SpdLoggerFactory>()); 
	IOC::registerService<IDatabase>(make_shared<FileDatabase>()); 
	return ioc;
}


void addDataToBlockchain(Server* server, size_t count); 

int main() {
	initializeIoc(); 
	
        auto server1 = make_unique<Server>(false); 
        auto server2 = make_unique<Server>(false); 
        
        addDataToBlockchain(server1.get(), 3);        
        addDataToBlockchain(server2.get(), 3);
        addDataToBlockchain(server2.get(), 3);
        
        auto blockCount1 = server1->blockchain()->height(); 
        
        server1->blockchain()->replaceChain(server2->blockchain()); 
        
        auto blockCount2 = server1->blockchain()->height(); 
	
	return 0;
}


void addDataToBlockchain(Server* server, size_t count) {
	
    //add some transactions 
    for(size_t n=0; n<count; n++) {
        Transaction* tx = server->wallet()->send("48948948948", 10, server->blockchain(), server->txPool());
    }
    
    //mine them 
    server->miner()->mine();
}
