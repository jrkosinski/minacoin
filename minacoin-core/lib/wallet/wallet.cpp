#include "wallet.hpp"
#include "../util/crypto/crypto.h"
#include <Poco/JSON/JSON.h>
#include <Poco/JSON/Parser.h>
#include <Poco/Dynamic/Var.h>

using namespace std; 

namespace minacoin::wallet { 
	
    Wallet::Wallet() {
        this->_balance = 500; //TODO: add config & get from config
        this->_keyPair = minacoin::util::crypto::generateKeyPair();
        this->_address = this->_keyPair->publicKey();

        this->logTag("WAL");
        this->logger()->info("wallet created: public key is %s", this->_address);
    }
    
    Wallet::~Wallet() {
        delete this->_keyPair;
    }
    
	void Wallet::sign(const string& data) {
        
    }
    
    Transaction* Wallet::send(const string& recipient, float amount, Blockchain* blockchain, TxPool* txPool)  {
        //logger.info(`creating transaction: send ${amount} to ${recipient}`);

        //update balance 
        this->updateBalance(blockchain);
                
        //disallow transactions to myself 
        if (recipient == this->address()) {
            //logger.warn('cannot send a transaction to yourself!'); 
            return nullptr; 
        }

        //disallow transaction if more than balance
        if (amount > this->balance()) {
            //logger.warn(`amount: ${amount} exceeds the current balance: ${this.balance}`);
            return nullptr;
        }

        //get existing transaction
        Transaction* transaction = nullptr; //transactionPool.existingTransaction(this.publicKey);

        if (transaction != NULL) {
            /*
            //if existing transaction, we have to take its amount into account 
            //when calculating the balance 
            const combinedAmount = (amount + transaction.outputs[0].amount);
            if (combinedAmount > this.balance) {
                logger.warn(`combined amount: ${combinedAmount} exceeds the current balance: ${this.balance}`);
                return;
            }
                
            transaction.update(this, recipient, amount);
            */
        }
        else {
            transaction = Transaction::create(this->address(), recipient, this->balance(), amount);
            //transactionPool.updateOrAddTransaction(transaction);
        }
        
        //sign the transaction
        transaction->sign(this->_keyPair); 
        
        //update the transaction pool 
        txPool->updateOrAdd(transaction);

        return transaction;
    }
    
    float Wallet::updateBalance(Blockchain* blockchain) {
        
        //TODO: get from config 
        float balance = 500; 
        
        //get all data items from blockchain
        vector<IBlockDataItem*> dataItems = blockchain->getDataItems();
        
        //get all of my transactions 
        vector<Transaction*> inputTxs; 
        for(auto it = dataItems.begin(); it != dataItems.end(); ++it) {
            Transaction* tx = dynamic_cast<Transaction*>(*it); 
            if (tx->input().address == this->address()) {
			    inputTxs.push_back(tx); 
            }
        }

        uint lastTransTime = 0;

        if (inputTxs.size() > 0) {
            Transaction* latestTx = inputTxs[0];
            for(auto it = inputTxs.begin(); it != inputTxs.end(); ++it) {
                Transaction* tx = *it; 
                if (tx->timestamp() > latestTx->timestamp()) {
                    latestTx = tx;
                }
            }

            //balance is output back to sender
            balance = latestTx->outputSelf().amount; 

            // save the timestamp of the latest transaction made by the wallet
            lastTransTime = latestTx->timestamp();
        }

        // get the transactions that were addressed to this wallet ie somebody sent some money
        // and add its ouputs.
        // since we save the timestamp we would only add the outputs of the transactions received
        // only after the latest transactions made by us
        for(auto it = dataItems.begin(); it != dataItems.end(); ++it) {
            Transaction* tx = dynamic_cast<Transaction*>(*it); 
            if (tx->timestamp() > lastTransTime) {
                if (tx->outputRecip().address == this->address()) {
                    balance += tx->outputRecip().amount; 
                }
            }
        }

        return balance;
    }
    
    string Wallet::toJson() {
		Poco::JSON::Object obj; 
        
		obj.set("balance", this->_balance);
		obj.set("address", this->_address);
		obj.set("privateKey", this->_keyPair->privateKey());
		
		ostringstream oss;
		obj.stringify(oss); 
		
		return oss.str();
    }
    
    void Wallet::fromJson(const string& json) {
		Poco::JSON::Parser parser;
		
		auto result = parser.parse(json);
		auto object = result.extract<Poco::JSON::Object::Ptr>();
		
		auto balance = object->getValue<float>("balance");
		auto address = object->getValue<std::string>("address");
		auto privateKey = object->getValue<std::string>("privateKey");
        
        this->_balance = balance;
        this->_address = address;
		
        //TODO: recreate keyPair from public & private key
    }
    
    Wallet* Wallet::createFromJson(const string& json) {
        Wallet* output = new Wallet();
        output->fromJson(json);
        return output; 
    }
}


