#include "blockchain.hpp" 
#include <algorithm> 
#include <vector> 
#include <string.h> 
#include <Poco/JSON/JSON.h>
#include <Poco/JSON/Parser.h>
#include <Poco/Dynamic/Var.h>

using namespace std;

namespace minacoin::blockchain {
	
	size_t Blockchain::height() {
		return this->_chain.size();
	}

	Block* Blockchain::blockAt(size_t index) {
		return this->_chain.at(index); 
	}
	
	Block* Blockchain::lastBlock() {
		return this->blockAt(this->height()-1); 
	}

	Blockchain::Blockchain() {
		this->_chain.push_back(Block::genesis());
	}

	Blockchain::~Blockchain() {
		this->clearChain();
	}

	Block* Blockchain::addBlock(vector<IBlockDataItem*>& data) {
		Block* block = Block::mineBlock(this->lastBlock(), data); 
		
		//if (data != NULL) {
            //check here to make sure that duplicate transactions don't exist
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
		
		this->_chain.push_back(block); 
		
		return block;
	}

	bool Blockchain::isValidChain(vector<Block*>& chain)  {
		
		//check that first block is genesis block 
		if (chain.at(0)->hash() != GENESIS_BLOCK_HASH) {
			//logger.warn('invalid chain: invalid genesis block');
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
			
			if (block->lastHash().compare(lastBlock->hash()) != 0) {
				//logger.warn(`invalid chain: invalid block ${block.hash}`);
				return false;
			}
		}

		return true;
	}

	void Blockchain::replaceChain(vector<Block*>& newChain) {
		if (newChain.size() <= this->height()) {
			//logger.info("received chain is not longer than the current chain");
			return;
		}
		else if (Blockchain::isValidChain(newChain)) {
			//logger.info("received chain is invalid");
			return;
		}
		
		//logger.info("replacing the current chain with new chain"); 
		this->_chain.clear();
		
		for_each(newChain.begin(), newChain.end(), [this](Block* const& b) {
			this->_chain.push_back(b); 
		}); 
	}
        	
	vector<IBlockDataItem*> Blockchain::getDataItems() {
		vector<IBlockDataItem*> output; 
		return output; 
	}
	
	string Blockchain::toJson() {
		Poco::JSON::Object obj; 
		
		//serialize base properties
		obj.set("height", this->height());
		
		//serialize blocks 
		Poco::JSON::Array::Ptr blockArray = new Poco::JSON::Array();
		
		int index = 0;
		Poco::JSON::Parser parser;
		
        for(auto it = _chain.begin(); it != _chain.end(); ++it) {
			string blockJson = (*it)->toJson();
			
			auto result = parser.parse(blockJson);
			auto object = result.extract<Poco::JSON::Object::Ptr>();
			
			parser.reset();
			blockArray->set(index++, *object); 
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
			Block* block = Block::createFromJson(oss.str()); 
			this->_chain.push_back(block);
		}
	}
	
	void Blockchain::clearChain() {
        for(auto it = _chain.begin(); it != _chain.end(); ++it) {
			delete *it;
		}
		this->_chain.clear();
	}
	
	Blockchain* Blockchain::createFromJson(const string& json) {
		Blockchain* output = new Blockchain();
		output->fromJson(json); 
		return output; 
	}
}
