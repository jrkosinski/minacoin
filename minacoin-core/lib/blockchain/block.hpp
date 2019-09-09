#ifndef __BLOCK_H__
#define __BLOCK_H__

#include <string> 
#include <vector>
#include "iblockdataitem.hpp" 

using namespace std;

namespace minacoin { namespace lib { namespace blockchain {

	extern string GENESIS_BLOCK_HASH; 
	
	typedef unsigned char byte; 

	class Block {
		private: 
			uint _timestamp;
			string _lastHash;
			string _hash; 
			vector<IBlockDataItem*> _data; 
			uint _nonce;
			uint _difficulty;
			
		public: 
			uint timestamp() { return _timestamp; }
			const char* lastHash() { return _lastHash.c_str(); }
			const char* hash() { return _hash.c_str(); }
			vector<IBlockDataItem*>* data() { return &_data; }
			uint nonce() { return _nonce; }
			uint difficulty() { return _difficulty; }
		
		public: 
			Block(uint timestamp, string lastHash, string hash, vector<IBlockDataItem*>& data, uint nonce, uint difficulty);
			~Block();
			
		public: 
			
		public: 
			static Block* genesis(); 
			static std::string hash(uint timestamp, string lastHash, vector<IBlockDataItem*>& data, uint nonce, uint difficulty); 
			static Block* mineBlock(Block* lastBlock, vector<IBlockDataItem*>& data); 
			static std::string blockHash(Block* block); 
			static uint adjustDifficulty(Block* lastBlock, uint timestamp); 
	}; 
}}}

#endif 
