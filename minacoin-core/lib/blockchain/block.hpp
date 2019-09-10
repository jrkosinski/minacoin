#ifndef __BLOCK_H__
#define __BLOCK_H__

#include <string> 
#include <vector>
#include "iblockdataitem.hpp" 
#include "../ijsonserializable.hpp"

using namespace std;

namespace minacoin::lib::blockchain {

	extern string GENESIS_BLOCK_HASH; 
	
	typedef unsigned char byte; 

	class Block: public IJsonSerializable {
		private: 
			uint _timestamp;
			string _lastHash;
			string _hash; 
			vector<IBlockDataItem*> _data; 
			uint _nonce;
			uint _difficulty;
			
		public: 
			uint timestamp() { return _timestamp; }
			string lastHash() { return _lastHash; }
			string hash() { return _hash; }
			vector<IBlockDataItem*>* data() { return &_data; }
			uint nonce() { return _nonce; }
			uint difficulty() { return _difficulty; }
		
		public: 
			Block(uint timestamp, const string& lastHash, const string& hash, vector<IBlockDataItem*>& data, uint nonce, uint difficulty);
			~Block();
			
		public: 
			string toJson() override;
			void fromJson(const string& json) override;
			
		public: 
			static Block* genesis(); 
			static std::string hash(uint timestamp, const string& lastHash, vector<IBlockDataItem*>& data, uint nonce, uint difficulty); 
			static Block* mineBlock(Block* lastBlock, vector<IBlockDataItem*>& data); 
			static std::string blockHash(Block* block); 
			static uint adjustDifficulty(Block* lastBlock, uint timestamp); 
			static Block* createFromJson(const string& json); 
	}; 
}

#endif 
