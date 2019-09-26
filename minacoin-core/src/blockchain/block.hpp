#ifndef __BLOCK_H__
#define __BLOCK_H__

#include "../inc.h"
#include <vector>
#include "iblockdataitem.hpp" 
#include "../ijsonserializable.hpp"
#include "../loggingobj.hpp"
#include "../merkle/merkletree.hpp"

using namespace minacoin::merkle;

namespace minacoin::blockchain {
	class Block: public IJsonSerializable, LoggingObj {
		private: 
			uint _timestamp;
			string _lastHash;
			string _hash; 
			vector<IBlockDataItem*> _data; 
			MerkleTree* _merkleTree;
			uint _nonce;
			uint _difficulty;
			
		public: 
			uint timestamp() const { return _timestamp; }
			string lastHash() const { return _lastHash; }
			string hash() const { return _hash; }
			string merkleRoot() const { return this->_merkleTree->hash(); }
			const vector<IBlockDataItem*>& data() const { return _data; }
			uint nonce() const { return _nonce; }
			uint difficulty() const { return _difficulty; }
		
		public: 
			Block(uint timestamp, const string& lastHash, const string& hash, const vector<IBlockDataItem*>& data, uint nonce, uint difficulty);
			~Block();
			
		public: 
			bool containsDataItem(const string& id) const; 
			bool dataEquals(const Block* block) const;
			Block* clone() const;
			
		public: 
			string toJson() const override;
			string toJson(bool includeHash) const;
			void fromJson(const string& json) override;
			
		public: 
			static Block* genesis(); 
			static std::string hash(uint timestamp, const string& lastHash, const vector<IBlockDataItem*>& data, uint nonce, uint difficulty); 
			static std::string blockHash(const Block* block); 
			static Block* mineBlock(const Block* lastBlock, const vector<IBlockDataItem*>& data); 
			static uint adjustDifficulty(const Block* lastBlock, uint timestamp); 
			static Block* createFromJson(const string& json); 
			
		private: 
			void clearData();
			MerkleTree* generateMerkleTree() const;
	}; 
}

#endif 
