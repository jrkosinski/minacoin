
#include "minacoin-core.hpp"

namespace minacoin::api {
    Server* server = nullptr;
    
    void initialize(bool initFromDb) {
        if (!server) {
            server = new Server(initFromDb); 
        }
    }
    
    vector<Transaction*> getTxPoolTransactions() {
        vector<Transaction*> output; 
        if (server) {
            output = server->txPool()->validTxs(server->blockchain()); 
        }
        return output; 
    }
     
    BCInfo getBlockchainInfo() {
        BCInfo output; 
        output.chainSize = 0; 
        output.txPoolSize = 0; 
        output.wallet.address = "";
        output.wallet.balance = 0; 
        
        if (server) {
            output.chainSize = server->blockchain()->height(); 
            output.txPoolSize = server->txPool()->txCount(); 
            output.wallet.address = server->wallet()->address(); 
            output.wallet.balance = server->wallet()->balance(); 
        }
        return output; 
    }
     
    vector<Block*> getBlocks() {
        vector<Block*> output; 
        if (server) {
            output = server->blockchain()->getChain();
        }
        return output; 
    }
     
    Transaction* transferTo(const string& recipAddress, float amount) {
        Transaction* output = nullptr;
        if (server) {
            output = server->wallet()->send(recipAddress, amount, server->blockchain()); 
        }
        return output; 
    }
     
    Block* mine() {
        Block* output = nullptr;
        if (server) {
            output = server->miner()->mine(); 
        }
        return output; 
    }
    
    bool replaceChain(const vector<Block*>& blocks) {
        if (server) {
            return server->blockchain()->replaceChain(blocks);
        }
        return false;
    }
     
    bool addTxToPool(const Transaction* tx) {
        if (server) {
            //server->txPool()->updateOrAdd(tx); 
            return true; 
        }
        return false;
    }
     
    void clearTxPool() {
        if (server) {
            server->txPool()->clear(); 
        }
    }     
    
    void deallocate() {
        if (server) {
            delete server;
            server = nullptr;
        }
    }
}

