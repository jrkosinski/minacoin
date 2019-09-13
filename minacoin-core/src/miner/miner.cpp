#include "miner.hpp" 
#include <vector>

namespace minacoin::miner {
    Miner::Miner(Blockchain* blockchain, Wallet* wallet, TxPool* txPool) {
        this->_blockchain = blockchain;
        this->_wallet = wallet;
        this->_txPool = txPool;
        
        this->logTag("MINR");
    }
    
    Miner::~Miner() {
        
    }
    
    Block* Miner::mine() {
        this->logger()->info("mining..."); 
        
        auto validTxs = this->_txPool->validTxs(this->_blockchain); 
        
        if (validTxs.size() > 0) {
            
            //TODO: add a reward for self
            //validTxs.push_back(Transaction::rewardTransaction(this->_wallet, Wallet::blockchainWallet()));
            
            //add them into a block
            vector<IBlockDataItem*> blockData(validTxs.begin(), validTxs.end());
            auto block = this->_blockchain->addBlock(blockData); 
            
            if (block) {
                //clear tx pool 
                this->logger()->info("block %s mined successfully; clearing transaction pool", block->hash().c_str());
                this->_txPool->clear(); 
            }
            else {
                //clear the transaction pool; maybe we have an old or corrupt pool
                this->logger()->warn("mined block is invalid; clearing transaction pool");
                this->_txPool->clear();
            }
            
            return block;
        }
        else {
            this->logger()->info("no valid transactions to mine");
        }
        
        return nullptr;
    }
}