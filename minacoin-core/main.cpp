#include "lib/blockchain/block.hpp"
#include "lib/blockchain/blockchain.hpp"
#include "lib/wallet/wallet.hpp"
#include "lib/wallet/transaction.hpp"
#include "lib/wallet/txpool.hpp"
#include "lib/util/crypto/crypto.h"

#include <stdio.h>
#include <iostream> 

#include "lib/util/logging/spdlogger.hpp"
#include "lib/util/logging/spdloggerfactory.hpp"
#include "lib/ioc.hpp"

using namespace std;
using namespace minacoin::lib;
using namespace minacoin::lib::blockchain;
using namespace minacoin::lib::wallet;
using namespace minacoin::lib::util::logging; 

//TODO: go over all functions, replace immutable pointers with const ref&

IocContainer* initializeIoc() {
	IocContainer* ioc = IocContainer::instance(); 
	auto ptr = make_shared<SpdLoggerFactory>(); 
	ioc->registerService<ILoggerFactory>(ptr); 
	return ioc;
}


int main() {
	auto ioc = initializeIoc(); 
	ILogger* logger = ioc->resolve<ILoggerFactory>()->createLogger("TAG");
	
	Blockchain* blockchain = new Blockchain(); 
	
	logger->info("blockchain height is {0:d}", (int)blockchain->height()); 
	logger->info("genesis block hash is {0}", blockchain->blockAt(0)->hash().c_str());
	
	Wallet* wallet = new Wallet();
	TxPool* txPool = new TxPool();
	Transaction* trans1 = wallet->send("48948948948", 100, blockchain, txPool);
	Transaction* trans2 = wallet->send("4894894e948", 100, blockchain, txPool);
	Transaction* trans3 = wallet->send("489489489dd", 100, blockchain, txPool);
	
	cout << txPool->txCount() << endl; 
	
	delete wallet;
	delete txPool;
	delete trans1; 
	delete trans2; 
	delete trans3; 
	
	return 0;
}