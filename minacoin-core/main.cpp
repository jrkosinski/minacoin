#include "lib/blockchain/block.hpp"
#include "lib/blockchain/blockchain.hpp"
#include "lib/wallet/wallet.hpp"
#include "lib/wallet/transaction.hpp"
#include "lib/wallet/txpool.hpp"
#include "lib/miner/miner.hpp"
#include "lib/util/crypto/crypto.h"

#include <stdio.h>
#include <iostream> 

#include "lib/util/logging/spdlogger.hpp"
#include "lib/util/logging/spdloggerfactory.hpp"
#include "lib/ioc.hpp"

using namespace std;
using namespace minacoin;
using namespace minacoin::blockchain;
using namespace minacoin::wallet;
using namespace minacoin::miner;
using namespace minacoin::util::logging; 

//TODO: go over all functions, replace immutable pointers with const ref&

IOC* initializeIoc() {
	IOC* ioc = IOC::instance(); 
	IOC::registerService<ILoggerFactory>(make_shared<SpdLoggerFactory>()); 
	return ioc;
}


int main() {
	initializeIoc(); 
	ILogger* logger = IOC::resolve<ILoggerFactory>()->createLogger("MAIN");
	
	Blockchain* blockchain = new Blockchain(); 
	
	logger->info("blockchain height is %d", (int)blockchain->height()); 
	logger->info("genesis block hash is %s", blockchain->blockAt(0)->hash().c_str());
	
	Wallet* wallet = new Wallet();
	TxPool* txPool = new TxPool();
	Miner* miner = new Miner(blockchain, wallet, txPool); 
	
	Transaction* trans1 = wallet->send("48948948948", 100, blockchain, txPool);
	Transaction* trans2 = wallet->send("4894894e948", 100, blockchain, txPool);
	Transaction* trans3 = wallet->send("489489489dd", 100, blockchain, txPool);
	
	Block* newBlock = miner->mine();
	
	delete wallet;
	delete txPool;
	delete trans1; 
	delete trans2; 
	delete trans3; 
	delete miner;
	
	return 0;
}