#include "wallet.hpp"
#include "../util/crypto/crypto.h"
#include <Poco/JSON/JSON.h>
#include <Poco/JSON/Parser.h>
#include <Poco/Dynamic/Var.h>

namespace minacoin::wallet { 
	
    Wallet::Wallet() {
        this->_balance = __WALLET_INITIAL_BALANCE__; 
        this->_keyPair = minacoin::util::crypto::generateKeyPair();
        this->_address = this->_keyPair->publicKey();

        this->logTag("WAL");
        this->logger()->info("wallet created: public key is %s", _address.c_str());
        this->logger()->info("wallet created: private key is %s", _keyPair->privateKey().c_str());
    }
    
    Wallet::~Wallet() {
        delete this->_keyPair;
    }
    
	void Wallet::sign(const string& data) {
        //TODO: fill this in (HIGH)
    }
    
    Transaction* Wallet::send(const string& recipient, float amount, Blockchain* blockchain, TxPool* txPool)  {
        this->logger()->info("creating transaction: send %f to %s", amount, recipient.c_str());

        //update balance 
        this->updateBalance(blockchain);
                
        //disallow transactions to myself 
        if (recipient == this->address()) {
            this->logger()->warn("cannot send a transaction to yourself!"); 
            return nullptr; 
        }

        //disallow transaction if more than balance
        if (amount > this->balance()) {
            this->logger()->info("amount %f exceeds the current balance %f", amount, this->_balance);
            return nullptr;
        }

        //get existing transaction
        Transaction* transaction = nullptr; //transactionPool.existingTransaction(this.publicKey);

        if (transaction != NULL) {
            //TODO: uncomment this (MED)
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
        }
        
        //sign the transaction
        transaction->sign(this->_keyPair); 
        
        //update the transaction pool 
        txPool->updateOrAdd(transaction);

        return transaction;
    }
    
    float Wallet::updateBalance(Blockchain* blockchain) {
        
        float balance = __WALLET_INITIAL_BALANCE__; 
        
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
		
        //recreate keyPair from public & private key
        this->_keyPair = KeyPair::deserialize(address, privateKey);
    }
    
    Wallet* Wallet::createFromJson(const string& json) {
		if (json.empty()) {
			return nullptr;
		}
        Wallet* output = new Wallet();
        output->fromJson(json);
        return output; 
    }
}


