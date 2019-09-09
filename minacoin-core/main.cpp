#include "lib/blockchain/block.hpp"
#include "lib/blockchain/blockchain.hpp"
#include "lib/wallet/wallet.hpp"
#include "lib/wallet/transaction.hpp"
#include "lib/wallet/txpool.hpp"
#include "lib/util/crypto.h"

#include <stdio.h>
#include <iostream> 

using namespace std;
using namespace minacoin::lib::blockchain;
using namespace minacoin::lib::wallet;


#define CATCH_CONFIG_MAIN

#include "test/catch.hpp"

TEST_CASE("getOneBit")
{
    uint8_t data[1];
    printf("outgradeusou");
    REQUIRE(1 == 1);
}


TEST_CASE("getOneBit1")
{
    uint8_t data[1];
    printf("outgradeusou");
    REQUIRE(1 == 2);
}



//TODO: exception handling 
//TODO: logging 
//TODO: add ISerializable interface

/*
int main() {
	
	Blockchain* blockchain = new Blockchain(); 
	
	printf("blockchain height is %d\n", (int)blockchain->height()); 
	printf("genesis block hash is %s\n", blockchain->blockAt(0)->hash());
	
	//cout << Block::hash(12, "sterit", NULL, 1, 3) << endl; 
	
	//minacoin::lib::util::crypto::generateKeyPair();
	
	Wallet* wallet = new Wallet();
	TxPool* txPool = new TxPool();
	Transaction* trans1 = wallet->send("48948948948", 100, blockchain, txPool);
	Transaction* trans2 = wallet->send("4894894e948", 100, blockchain, txPool);
	Transaction* trans3 = wallet->send("489489489dd", 100, blockchain, txPool);
	
	cout << txPool->txCount() << endl; 
	
	return 0;
}
*/