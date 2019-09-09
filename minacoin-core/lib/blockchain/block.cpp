#include "block.hpp" 
#include "../util/timestamp.h" 
#include "../util/crypto.h" 
#include <Poco/JSON/JSON.h>
#include <Poco/JSON/Parser.h>
#include <Poco/Dynamic/Var.h>

namespace minacoin { namespace lib { namespace blockchain {
	
	string GENESIS_BLOCK_HASH = "GENESIS_BLOCK_HASH";
	
	const uint MINE_RATE = 100000; 

	Block::Block(uint timestamp, const string& lastHash, const string& hash, vector<IBlockDataItem*>& data, uint nonce, uint difficulty) {
		this->_timestamp = timestamp; 
		this->_lastHash = lastHash;
		this->_hash = hash; 
		//this->_data = (byte*)data; 
		this->_nonce = nonce; 
		this->_difficulty = difficulty; 
	}

	Block::~Block() {
	}

	Block* Block::genesis() {
		vector<IBlockDataItem*> data;
		return new Block(0, "---", GENESIS_BLOCK_HASH, data, 0, 0); 
	}

	std::string Block::hash(uint timestamp, const string& lastHash, vector<IBlockDataItem*>& data, uint nonce, uint difficulty) {
		
		Poco::JSON::Object obj; 
		obj.set("timestamp", timestamp);
		obj.set("lastHash", lastHash); 
		obj.set("nonce", nonce); 
		obj.set("difficulty", difficulty); 
		
		ostringstream oss;
		obj.stringify(oss); 
		
		std::string jsonString = oss.str();
		return minacoin::lib::util::crypto::hash(jsonString.c_str());
	}

	Block* Block::mineBlock(Block* lastBlock, vector<IBlockDataItem*>& data) {
		uint timestamp = minacoin::lib::util::timestamp(); 
		const char* lastHash = lastBlock->hash(); 
		uint difficulty = lastBlock->difficulty(); 
		uint nonce = 0; 
		std::string hash; 
		
		do {
			nonce++; 
			timestamp = minacoin::lib::util::timestamp(); 
			difficulty = Block::adjustDifficulty(lastBlock, timestamp); 
			hash = Block::hash(timestamp, lastHash, data, nonce, difficulty); 
			
		} while (hash.substr(0,difficulty).compare(string('0', difficulty)) != 0);
		
		return NULL;
	}

	std::string Block::blockHash(Block* block) {
		return Block::hash(block->timestamp(), block->lastHash(), *block->data(), block->nonce(), block->difficulty());
	}
	
	uint Block::adjustDifficulty(Block* lastBlock, uint currentTime) {
		uint difficulty = lastBlock->difficulty(); 
		difficulty = (lastBlock->timestamp() + MINE_RATE) > currentTime ? (difficulty+1) : (difficulty-1);             
		return difficulty;
	}
}}}
