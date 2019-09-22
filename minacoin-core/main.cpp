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

int main() {
	initializeIoc(); 
	
	auto logger = IOC::resolve<ILoggerFactory>()->createLogger("MAIN");
	
	
        auto server1 = make_unique<Server>(false); //sender
        auto server2 = make_unique<Server>(false); //receiver
        auto senderWallet = server1->wallet(); 
        auto receiverWallet = server2->wallet(); 
        
        float senderBal1 = senderWallet->balance();
        float recipBal1 = receiverWallet->balance();
        float txAmount = 100;
        
        senderWallet->send(receiverWallet->address(), txAmount, server1->blockchain(), server1->txPool()); 
        server1->miner()->mine(); 
        
        server2->blockchain()->replaceChain(server1->blockchain()); 
        
        /*
        senderWallet->updateBalance(server1->blockchain()); 
        receiverWallet->updateBalance(server2->blockchain()); 
        
        float senderBal2 = senderWallet->balance();
        float recipBal2 = receiverWallet->balance();
        
        REQUIRE(senderBal2 < senderBal1); 
        REQUIRE(recipBal1 > recipBal2); 
        REQUIRE(recipBal2 == (recipBal1 + txAmount));
		*/
	
	/*	
	auto server = make_unique<Server>(false); 
	
	//Blockchain* blockchain = new Blockchain(); 
	auto blockchain = server->blockchain(); 
	auto txPool = server->txPool(); 
	auto wallet = server->wallet();
	auto miner = server->miner();
	
	//string compressed = minacoin::util::base64::string_compress_encode(wallet->address()); 
	//logger->info(compressed); 
	
	logger->info("blockchain height is %d", (int)blockchain->height()); 
	logger->info("genesis block hash is %s", blockchain->blockAt(0)->hash().c_str());
	
	Transaction* trans1 = wallet->send("48948948948", 100, blockchain, txPool);
	Transaction* trans2 = wallet->send("4894894e948", 100, blockchain, txPool);
	Transaction* trans3 = wallet->send("489489489dd", 100, blockchain, txPool);
	
	Block* newBlock = miner->mine();
	blockchain->lastBlock()->fromJson("{\"data\":[],\"difficulty\":3,\"hash\":\"12121\",\"lastHash\":\"---\",\"nonce\":0,\"timestamp\":0}"); 

	logger->info(blockchain->lastBlock()->hash()); 
	logger->info(blockchain->isValid() ? "VALID" : "NOT VALID"); 
	
	auto db = IOC::resolve<IDatabase>();
	db->saveBlockchain(blockchain); 
	db->saveWallet(wallet); 
	
	Blockchain* bc2 = db->getBlockchain(); 
	Wallet* w2 = db->getWallet(); 
	*/

	return 0;
}