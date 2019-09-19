#ifndef __BLOCK_H__
#define __BLOCK_H__

#include "../inc.h"
#include <vector>
#include "iblockdataitem.hpp" 
#include "../ijsonserializable.hpp"
#include "../loggingobj.hpp"

namespace minacoin::blockchain {

	class Block: public IJsonSerializable, LoggingObj {
		private: 
			uint _timestamp;
			string _lastHash;
			string _hash; 
			vector<IBlockDataItem*> _data; 
			uint _nonce;
			uint _difficulty;
			
		public: 
			uint timestamp() const { return _timestamp; }
			string lastHash() const { return _lastHash; }
			string hash() const { return _hash; }
			vector<IBlockDataItem*>* data() { return &_data; }
			uint nonce() const { return _nonce; }
			uint difficulty() const { return _difficulty; }
		
		public: 
			Block(uint timestamp, const string& lastHash, const string& hash, vector<IBlockDataItem*>& data, uint nonce, uint difficulty);
			~Block();
			
		public: 
			bool containsDataItem(const string& id) const; 
			
		public: 
			string toJson() const override;
			string toJson(bool includeHash) const;
			void fromJson(const string& json) override;
			
		public: 
			static Block* genesis(); 
			static std::string hash(uint timestamp, const string& lastHash, vector<IBlockDataItem*>& data, uint nonce, uint difficulty); 
			static std::string blockHash(const Block* block); 
			static Block* mineBlock(const Block* lastBlock, vector<IBlockDataItem*>& data); 
			static uint adjustDifficulty(const Block* lastBlock, uint timestamp); 
			static Block* createFromJson(const string& json); 
			
		private: 
			void clearData();
	}; 
}

#endif 
