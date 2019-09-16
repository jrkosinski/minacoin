#include "server.hpp" 
#include "../ioc.hpp"
#include "../util/database/idatabase.hpp"

using namespace minacoin::blockchain;
using namespace minacoin::miner;
using namespace minacoin::wallet;
using namespace minacoin::util::database;

namespace minacoin::server {
    
    Server::Server(bool initFromDb) {
        this->_blockchain = nullptr;
        this->_wallet = nullptr;
        this->_txPool = nullptr;
        this->_miner = nullptr;
        
        if (initFromDb) {
            auto db = IOC::resolve<IDatabase>();
            this->_blockchain = db->getBlockchain(); 
            this->_wallet = db->getWallet(); 
        }
        
        if (!this->_blockchain) {
            this->_blockchain = new Blockchain(); 
        }
        
        if (!this->_wallet) {
            this->_wallet = new Wallet(); 
        }
        
        this->_txPool = new TxPool(); 
        this->_miner = new Miner(this->_blockchain, this->_wallet, this->_txPool); 
    }
    
    Server::~Server() {
        if (this->_txPool) {
            delete this->_txPool; 
            this->_txPool = nullptr;
        }
        if (this->_blockchain) {
            delete this->_blockchain; 
            this->_blockchain = nullptr;
        }
        if (this->_wallet) {
            delete this->_wallet; 
            this->_wallet = nullptr;
        }
        if (this->_miner) {
            delete this->_miner; 
            this->_miner = nullptr;
        }
    }
}