#include "transaction.hpp"
#include "../util/timestamp.h" 
#include "../util/crypto/crypto.h" 
#include <Poco/JSON/JSON.h>
#include <Poco/JSON/Parser.h>
#include <Poco/Dynamic/Var.h>
#include "boost/lexical_cast.hpp"

namespace minacoin::wallet {
    
    Transaction::Transaction(){
        this->logTag("TX");
        this->_id = minacoin::util::crypto::guid();
        this->logger()->info("transaction %s created", this->_id.c_str()); 
    }
    
    Transaction::~Transaction() {
        
    }
    
	Transaction* Transaction::update(const string& sender, const string& recipient, float senderBalance, float amount) {
        return NULL;
    }
			
	void Transaction::sign(minacoin::util::crypto::KeyPair* keyPair) {         
        this->logger()->info("signing transaction %s", this->_id.c_str()); 
        this->_input.signature = keyPair->sign(minacoin::util::crypto::hash(this->serializeOutputs().c_str()));
        this->logger()->info("transaction signature is %s", this->_input.signature.c_str()); 
    } 
			
    Transaction* Transaction::create(const string& sender, const string& recipient, float senderBalance, float amount) {
        
        Transaction* transaction = new Transaction(); 
        
        //add outputs 
        transaction->_outputRecip.amount = amount;
        transaction->_outputRecip.address = recipient;
        transaction->_outputSelf.amount = (senderBalance - amount); 
        transaction->_outputSelf.address = sender;
        
        transaction->_input.timestamp = minacoin::util::timestamp();
        transaction->_input.amount = senderBalance;
        
        return transaction;
    }
			
    bool Transaction::verify(Transaction* tx) {
        return true;
    }
			
    //Transaction* Transaction::reward(Wallet* miner, Wallet* blockchainWallet) {
   //     return NULL;
    //}
    
    string Transaction::serializeOutputs() {
        string output = "{output1:{address:"; 
        output += this->_outputRecip.address; 
        output += ",amount:";
        output += boost::lexical_cast<std::string>(this->_outputRecip.amount);
        output += "},output2:{address:"; 
        output += this->_outputSelf.address; 
        output += ",amount:";
        output += boost::lexical_cast<std::string>(this->_outputSelf.amount);
        
        return output; 
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