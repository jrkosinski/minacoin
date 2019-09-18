#ifndef __MINACOIN_INC_H__
#define __MINACOIN_INC_H__

#include <string> 
#include <iostream> 

namespace minacoin { }

typedef unsigned char byte; 

#define __abstract_method__             =0

//TODO: replace these with some config or constexpr 
#define __WALLET_INITIAL_BALANCE__      500
#define __MINE_RATE__                   10000
#define __MINING_REWARD__               50
#define __DEFAULT_DIFFICULTY__          3
#define __GENESIS_BLOCK_HASH__          "GENESIS_BLOCK_HASH"
#define __WALLET_DB_FILENAME__          "wallet.dat"
#define __BLOCKCHAIN_DB_FILENAME__      "blockchain.dat"


using namespace std; 
using namespace minacoin; 

#endif 

