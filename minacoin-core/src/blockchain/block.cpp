#include "block.hpp" 
#include "../util/timestamp.h" 
#include "../util/crypto/crypto.h" 
#include "../wallet/transaction.hpp" 
#include <Poco/JSON/JSON.h>
#include <Poco/JSON/Parser.h>
#include <Poco/Dynamic/Var.h>

namespace minacoin::blockchain {
	
	string GENESIS_BLOCK_HASH = "GENESIS_BLOCK_HASH";
	constexpr uint DEFAULT_DIFFICULTY = 3;
	
	const uint MINE_RATE = 10000; 

	Block::Block(uint timestamp, const string& lastHash, const string& hash, vector<IBlockDataItem*>& data, uint nonce, uint difficulty) {
		this->_timestamp = timestamp; 
		this->_lastHash = lastHash;
		this->_hash = hash; 
		this->_nonce = nonce; 
		this->_difficulty = difficulty; 
		
		this->logTag("BLK");
		
		//copy data 
		for(auto it = data.begin(); it != data.end(); ++it) {
			auto item = *it; 
			this->_data.push_back(item);
		}
	}

	Block::~Block() {
	}

	Block* Block::genesis() {
		vector<IBlockDataItem*> data;
		return new Block(0, "---", GENESIS_BLOCK_HASH, data, 0, DEFAULT_DIFFICULTY); 
	}

	std::string Block::hash(uint timestamp, const string& lastHash, vector<IBlockDataItem*>& data, uint nonce, uint difficulty) {
		
		Poco::JSON::Object obj; 
		obj.set("timestamp", timestamp);
		obj.set("lastHash", lastHash); 
		obj.set("nonce", nonce); 
		obj.set("difficulty", difficulty); 
		//TODO: include serialized data in hash 
		
		ostringstream oss;
		obj.stringify(oss); 
		
		std::string jsonString = oss.str();
		return minacoin::util::crypto::hash(jsonString.c_str());
	}

	Block* Block::mineBlock(Block* lastBlock, vector<IBlockDataItem*>& data) {
		uint timestamp = minacoin::util::timestamp(); 
		string lastHash = lastBlock->hash(); 
		uint difficulty = lastBlock->difficulty(); 
		uint nonce = 0; 
		std::string hash; 
		
		auto logger = IOC::resolve<ILoggerFactory>()->createLogger("BLK:mineBlock"); 		
		logger->info("mining block: difficulty is %d", difficulty); 
		
		do {
			nonce++; 
			timestamp = minacoin::util::timestamp(); 
			auto diff = Block::adjustDifficulty(lastBlock, timestamp); 
			if (diff != difficulty) {
				difficulty = diff;
				logger->info("difficulty adjusted to %d", difficulty); 
			}
			hash = Block::hash(timestamp, lastHash, data, nonce, difficulty); 
			
		} while (hash.substr(0,difficulty).compare(string(difficulty, '0')) != 0);
		
		logger->info("block %s mined", hash.c_str()); 
		return new Block(timestamp, lastHash, hash, data, nonce, difficulty);		
	}

	std::string Block::blockHash(Block* block) {
		return Block::hash(block->timestamp(), block->lastHash(), *block->data(), block->nonce(), block->difficulty());
	}
	
	bool Block::containsDataItem(const std::string& id) {
		for (auto it = _data.begin(); it != _data.end(); ++it) {
			if ((*it)->id().compare(id) == 0) {
				return true;
			}
		}
		return false;
	}
	
	uint Block::adjustDifficulty(Block* lastBlock, uint currentTime) {
		uint difficulty = lastBlock->difficulty(); 
		if (difficulty < 1) {
			difficulty = 1; 
		}
		if ((lastBlock->timestamp() + MINE_RATE) > currentTime) {
			difficulty++;
		} else {
			if (difficulty > 1) 
				difficulty--;
		}    
		return difficulty;
	}
	
	string Block::toJson() {
		Poco::JSON::Object obj; 
		
		//serialize base properties
		obj.set("timestamp", this->_timestamp);
		obj.set("lastHash", this->_lastHash); 
		obj.set("nonce", this->_nonce); 
		obj.set("difficulty", this->_difficulty); 		
		
		//serialize data 
		Poco::JSON::Array::Ptr txArray = new Poco::JSON::Array();
		
		int index = 0;
		Poco::JSON::Parser parser;
		
        for(auto it = _data.begin(); it != _data.end(); ++it) {
			string txJson = (*it)->toJson();
			
			auto result = parser.parse(txJson);
			auto object = result.extract<Poco::JSON::Object::Ptr>();
			
			parser.reset();
			txArray->set(index++, *object); 
		}
		
		//set the data property with serialized json array 
		obj.set("data", txArray); 
		
		ostringstream oss;
		obj.stringify(oss); 
		
		return oss.str();
	}
	
	void Block::fromJson(const string& json) {
		Poco::JSON::Parser parser;
		
		auto result = parser.parse(json);
		auto object = result.extract<Poco::JSON::Object::Ptr>();
		
		this->_timestamp = object->getValue<uint>("timestamp");
		this->_lastHash = object->getValue<std::string>("lastHash");
		this->_nonce = object->getValue<uint>("nonce");
		this->_difficulty = object->getValue<uint>("difficulty");

		//deserialize data 
		auto chain = object->get("data"); 
		auto txArray = chain.extract<Poco::JSON::Array::Ptr>();
		
		//clear existing data first 
		this->clearData();
		
		//deserialize data items
		for (auto it= txArray->begin(); it != txArray->end(); ++it)
		{
			auto dataJson = (*it).extract<Poco::JSON::Object::Ptr>(); 
			ostringstream oss;
			dataJson->stringify(oss);
			IBlockDataItem* item = minacoin::wallet::Transaction::createFromJson(oss.str()); 
			this->_data.push_back(item);
		}
	}
	
	Block* Block::createFromJson(const string& json) {
		vector<IBlockDataItem*> data;
		Block* output = new Block(0, "", "", data, 0, 0);
		output->fromJson(json); 
		return output;
	}
	
	void Block::clearData() {
        for(auto it = _data.begin(); it != _data.end(); ++it) {
			delete *it;
		}
		this->_data.clear();
	}
}