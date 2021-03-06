#include "blockchain.hpp" 
#include <algorithm> 
#include <vector> 
#include <Poco/JSON/JSON.h>
#include <Poco/JSON/Parser.h>
#include <Poco/Dynamic/Var.h>

namespace minacoin::blockchain {
	
	size_t Blockchain::height() const {
		return this->_chain.size();
	}

	Block* Blockchain::blockAt(size_t index) const {
		return this->_chain.at(index); 
	}
	
	Block* Blockchain::lastBlock() const {
		return this->blockAt(this->height()-1); 
	}

	Blockchain::Blockchain() {
		this->_chain.push_back(Block::genesis());
		this->initLogger("BC");
		this->logger()->info("blockchain created");
	}

	Blockchain::~Blockchain() {
		this->clearChain();
	}

	Block* Blockchain::addBlock(const vector<IBlockDataItem*>& data) {
		Block* block = Block::mineBlock(this->lastBlock(), data); 
		
		//if (data != NULL) {
            //TODO: check here to make sure that duplicate transactions don't exist
            /*
                for (let t in data) {
                    if (this.containsTransaction(t.id)) {
                        //reject block
                        logger.warn(`block is being rejected, because transaction ${t.id} is a duplicate`);
                        return null;
                    } 
                };
            */
		//}
		
		if (block) {
			this->_chain.push_back(block); 
		}
		
		return block;
	}
	
	const vector<Block*>& Blockchain::getChain() const {
		return this->_chain;
	}

	bool Blockchain::isValidChain(const vector<Block*>& chain)  {
		
		auto logger = IOC::resolve<ILoggerFactory>()->createLogger("BC:isValidChain"); 
		
		//check that first block is genesis block 
		if (chain.at(0)->hash() != __GENESIS_BLOCK_HASH__) {
			logger->warn("invalid chain: invalid genesis block");
			return false;
		}
		
		
		/*
            //if the last block has a transaction that exists elsewhere in the chain, then 
            // the chain is invalid 
            if (chain.length > 1) {
                //get all transactions from ALL BUT LAST block
                const allTrans = extractTransactionsFromBlocks(R.init(chain)); 
                
                //examine all transactions in last block for duplicity
                const lastBlock = chain[chain.length-1]; 
                for(let i=0; i<lastBlock.data.length; i++) {
                    const t = lastBlock.data[i]; 
                    if (R.find(R.propEq('id', t.id))(allTrans)) {
                        logger.warn(`invalid chain: transaction ${t.id} is duplicated`);
                        return false;
                    }
                }
            }
		*/
		
		//if the chain has any invalid blocks, then the chain is invalid
		for (size_t n=1; n<chain.size(); n++) {
			Block* block = chain.at(n);
			Block* lastBlock = chain.at(n-1);
			
			//the block's hash should validly reflect its data 
			if (block->hash() != Block::blockHash(block)) {
				logger->warn("invalid chain: invalid block hash %s", block->hash().c_str());
				return false;
			}
			
			//the block's prevHash should point to the actual prev block
			if (block->lastHash().compare(lastBlock->hash()) != 0) {
				logger->warn("invalid chain: invalid block prevHash %s", block->hash().c_str());
				return false;
			}
		}

		logger->info("this chain is valid");
		return true;
	}

	bool Blockchain::replaceChain(const vector<Block*>& newChain) {
		if (newChain.size() <= this->height()) {
			this->logger()->info("received chain is not longer than the current chain");
			return false;
		}
		else if (!Blockchain::isValidChain(newChain)) {
			this->logger()->warn("received chain is invalid");
			return false;
		}
		
		this->logger()->info("replacing the current chain with new chain"); 
		while(this->_chain.size() > 0) {
			this->_chain.erase(this->_chain.begin()); 
		}
		
		for (auto it = newChain.begin(); it != newChain.end(); ++it) {
			this->_chain.push_back((*it)->clone()); 
		}
		
		return true;
	}
	
	bool Blockchain::replaceChain(const Blockchain* newChain) {
		return this->replaceChain(newChain->_chain); 
	}
        	
	vector<IBlockDataItem*> Blockchain::getDataItems() const {
		vector<IBlockDataItem*> output; 
		
		for(auto itBlocks = this->_chain.begin(); itBlocks!= this->_chain.end(); ++itBlocks) {
			Block* block = *itBlocks; 
			
			auto blockData = block->data(); 
			for (auto itData = blockData.begin(); itData != blockData.end(); ++itData) {
				output.push_back(*itData); 
			}
		}
		
		return output; 
	}
	
	bool Blockchain::containsDataItem(const string& id) const {
		for (auto it = _chain.begin(); it != _chain.end(); ++it) {
			if ((*it)->containsDataItem(id)) {
				return true;
			}
		}
		return false;
	}
	
	bool Blockchain::isValid() const {
		return Blockchain::isValidChain(this->_chain); 
	}
	
	string Blockchain::toJson() const {
		Poco::JSON::Object obj; 
		
		//serialize base properties
		obj.set("height", this->height());
		
		//serialize blocks 
		Poco::JSON::Array blockArray;
		
		int index = 0;
		Poco::JSON::Parser parser;
		
        for(auto it = _chain.begin(); it != _chain.end(); ++it) {
			string blockJson = (*it)->toJson();
			
			auto result = parser.parse(blockJson);
			auto object = result.extract<Poco::JSON::Object::Ptr>();
			
			parser.reset();
			blockArray.set(index++, *object); 
		}
		
		//set chain property with json array 
		obj.set("chain", blockArray); 
		
		ostringstream oss;
		obj.stringify(oss); 
		
		return oss.str();
	}
	
	void Blockchain::fromJson(const string& json) {		
		Poco::JSON::Parser parser;
		
		auto result = parser.parse(json);
		auto object = result.extract<Poco::JSON::Object::Ptr>();
		
		//deserialize chain 
		if (object->has("chain")) {
			auto chain = object->get("chain"); 
			auto blockArray = chain.extract<Poco::JSON::Array::Ptr>();
			
			//clear existing data first 
			this->clearChain();
			
			//deserialize chain items
			for (auto it= blockArray->begin(); it != blockArray->end(); ++it)
			{
				auto blockJson = (*it).extract<Poco::JSON::Object::Ptr>(); 
				ostringstream oss;
				blockJson->stringify(oss);
				this->_chain.push_back(Block::createFromJson(oss.str()));
			}
		}
	}
	
	void Blockchain::clearChain() {
        for(auto it = _chain.begin(); it != _chain.end(); ++it) {
			delete *it;
		}
		this->_chain.clear();
	}
	
	Blockchain* Blockchain::createFromJson(const string& json) {
		if (json.empty()) {
			return nullptr;
		}
		
		Blockchain* output = new Blockchain(); 
		output->fromJson(json); 
		return output; 
	}
}
