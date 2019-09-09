#include "transaction.hpp"
#include "../util/timestamp.h" 
#include "../util/crypto.h" 

namespace minacoin { namespace lib { namespace wallet {
    Transaction::Transaction(){
        this->_id = minacoin::lib::util::crypto::guid();
    }
    
    Transaction::~Transaction() {
        
    }
    
	Transaction* Transaction::update(string sender, string recipient, float senderBalance, float amount) {
        return NULL;
    }
			
	void Transaction::sign(minacoin::lib::util::crypto::KeyPair* keyPair) { 
        
        //logger.info(`signing transaction ${transaction.id}`);
        string sig = keyPair->sign(minacoin::lib::util::crypto::hash(this->serializeOutputs().c_str()));
    } 
			
    Transaction* Transaction::create(string sender, string recipient, float senderBalance, float amount) {
        
        Transaction* transaction = new Transaction(); 
        
        //add outputs 
        transaction->_outputRecip.amount = amount;
        transaction->_outputRecip.address = recipient;
        transaction->_outputSelf.amount = (senderBalance - amount); 
        transaction->_outputSelf.address = sender;
        
        transaction->_input.timestamp = minacoin::lib::util::timestamp();
        transaction->_input.amount = senderBalance;
        
        return transaction;
    }
			
    bool Transaction::verify(Transaction* tx) {
        return false;
    }
			
    //Transaction* Transaction::reward(Wallet* miner, Wallet* blockchainWallet) {
   //     return NULL;
    //}
    
    string Transaction::serializeOutputs() {
        return "";
    }
			
	string Transaction::toJson() { return ""; }
    
	void Transaction::fromJson(string json) { }
}}}