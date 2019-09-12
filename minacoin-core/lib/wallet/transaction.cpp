#include "transaction.hpp"
#include "../util/timestamp.h" 
#include "../util/crypto.h" 
#include <Poco/JSON/JSON.h>
#include <Poco/JSON/Parser.h>
#include <Poco/Dynamic/Var.h>

namespace minacoin::lib::wallet {
    
    Transaction::Transaction(){
        this->_id = minacoin::lib::util::crypto::guid();
    }
    
    Transaction::~Transaction() {
        
    }
    
	Transaction* Transaction::update(const string& sender, const string& recipient, float senderBalance, float amount) {
        return NULL;
    }
			
	void Transaction::sign(minacoin::lib::util::crypto::KeyPair* keyPair) { 
        
        //logger.info(`signing transaction ${transaction.id}`);
        string sig = keyPair->sign(minacoin::lib::util::crypto::hash(this->serializeOutputs().c_str()));
    } 
			
    Transaction* Transaction::create(const string& sender, const string& recipient, float senderBalance, float amount) {
        
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
    
    string Transaction::serializeInput() {
        return "";
    }
			
	string Transaction::toJson() { 
		Poco::JSON::Object obj; 
		Poco::JSON::Object input; 
		Poco::JSON::Object output1; 
		Poco::JSON::Object output2; 
        
		obj.set("id", this->_id);
        
        input.set("address", this->_input.address);
        input.set("timestamp", this->_input.timestamp);
        input.set("amount", this->_input.amount);
        input.set("signature", this->_input.signature);
        
        output1.set("address", this->_outputRecip.address);
        output1.set("amount", this->_outputRecip.amount);
        
        output2.set("address", this->_outputSelf.address);
        output2.set("amount", this->_outputSelf.amount);
        
        obj.set("input", input);
        obj.set("outputRecip", output1);
        obj.set("outputSelf", output2);
		
		ostringstream oss;
		obj.stringify(oss); 
		
		return oss.str();
    }
    
	void Transaction::fromJson(const string& json) { 
		Poco::JSON::Parser parser;
		
		auto result = parser.parse(json);
		auto object = result.extract<Poco::JSON::Object::Ptr>();
        
        //base properties
        this->_id = object->getValue<string>("id");
		
        //input 
        auto inputObj = object->get("input").extract<Poco::JSON::Object::Ptr>();
		this->_input.address = inputObj->getValue<string>("address");
		this->_input.timestamp = inputObj->getValue<uint>("timestamp");
		this->_input.amount = inputObj->getValue<float>("amount");
		this->_input.signature = inputObj->getValue<string>("signature");
        
        //output recip
        auto outputRecipObj = object->get("outputRecip").extract<Poco::JSON::Object::Ptr>();
        this->_outputRecip.address = outputRecipObj->getValue<string>("address");
        this->_outputRecip.amount = outputRecipObj->getValue<float>("amount");
        
        //output self 
        auto outputSelfObj = object->get("outputRecip").extract<Poco::JSON::Object::Ptr>();
        this->_outputSelf.address = outputSelfObj->getValue<string>("address");
        this->_outputSelf.amount = outputSelfObj->getValue<float>("amount");
    }
    
    Transaction* Transaction::createFromJson(const string& json) {
        Transaction* trans = new Transaction(); 
        trans->fromJson(json);
        return trans;
    }
}