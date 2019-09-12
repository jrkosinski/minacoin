#include "lib/blockchain/block.hpp"
#include "lib/blockchain/blockchain.hpp"
#include "lib/wallet/wallet.hpp"
#include "lib/wallet/transaction.hpp"
#include "lib/wallet/txpool.hpp"
#include "lib/util/crypto/crypto.h"

#include <stdio.h>
#include <iostream> 

#include "lib/util/logging/spdlogger.hpp"

using namespace std;
using namespace minacoin::lib::blockchain;
using namespace minacoin::lib::wallet;

//TODO: go over all functions, replace immutable pointers with const ref&


int main() {
	
	auto logger = new minacoin::lib::util::logging::SpdLogger(); 
	logger->info("hi this is logger");
	
	Blockchain* blockchain = new Blockchain(); 
	
	printf("blockchain height is %d\n", (int)blockchain->height()); 
	printf("genesis block hash is %s\n", blockchain->blockAt(0)->hash().c_str());
	
	//cout << Block::hash(12, "sterit", NULL, 1, 3) << endl; 
	
	//minacoin::lib::util::crypto::generateKeyPair();
	
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