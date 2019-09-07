#include "blockchain.hpp" 
#include <algorithm> 
#include <vector> 
#include <string.h> 

using namespace std;

namespace minacoin { namespace lib { namespace blockchain {
	
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
		
	}

	Block* Blockchain::addBlock(vector<Transaction*>& data) {
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
			
			if (strcmp(block->lastHash(), lastBlock->hash()) != 0) {
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
}}}
