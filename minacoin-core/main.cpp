#include "lib/blockchain/block.hpp"
#include "lib/blockchain/blockchain.hpp"
#include "lib/util/crypto.h"

#include <stdio.h>
#include <iostream> 

using namespace std;
using namespace minacoin::lib::blockchain;

int main() {
	
	Blockchain* blockchain = new Blockchain(); 
	
	printf("blockchain height is %d\n", (int)blockchain->height()); 
	printf("genesis block hash is %s\n", blockchain->blockAt(0)->hash());
	
	//cout << Block::hash(12, "sterit", NULL, 1, 3) << endl; 
	
	minacoin::lib::util::crypto::generateKeyPair();
	
	return 0;
}
