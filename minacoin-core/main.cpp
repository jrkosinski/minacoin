#include "src/blockchain/block.hpp"
#include "src/blockchain/blockchain.hpp"
#include "src/wallet/wallet.hpp"
#include "src/wallet/transaction.hpp"
#include "src/wallet/txpool.hpp"
#include "src/miner/miner.hpp"
#include "src/util/crypto/crypto.h"

#include <stdio.h>
#include <iostream> 

#include "src/util/logging/spdlogger.hpp"
#include "src/util/logging/spdloggerfactory.hpp"
#include "src/ioc.hpp"

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