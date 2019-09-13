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
	auto logger = IOC::resolve<ILoggerFactory>()->createLogger("MAIN");
	
	//Blockchain* blockchain = new Blockchain(); 
	auto blockchain = make_unique<Blockchain>();
	
	logger->info("blockchain height is %d", (int)blockchain->height()); 
	logger->info("genesis block hash is %s", blockchain->blockAt(0)->hash().c_str());
	
	auto wallet = make_unique<Wallet>();
	auto txPool = make_unique<TxPool>();
	auto miner = make_unique<Miner>(blockchain.get(), wallet.get(), txPool.get()); 
	
	Transaction* trans1 = wallet->send("48948948948", 100, blockchain.get(), txPool.get());
	Transaction* trans2 = wallet->send("4894894e948", 100, blockchain.get(), txPool.get());
	Transaction* trans3 = wallet->send("489489489dd", 100, blockchain.get(), txPool.get());
	
	Block* newBlock = miner->mine();
	
	return 0;
}