#include "transaction.hpp"
#include "../util/timestamp.h" 
#include "../util/crypto/crypto.h" 
#include <Poco/JSON/JSON.h>
#include <Poco/JSON/Parser.h>
#include <Poco/Dynamic/Var.h>
#include "boost/lexical_cast.hpp"

namespace minacoin::wallet {
    
    Transaction::Transaction(){
        this->initLogger("TX");
        this->_id = minacoin::util::crypto::guid();
        this->logger()->info("transaction %s created", this->_id.c_str()); 
    }
    
    Transaction::~Transaction() {
        
    }
    
	Transaction* Transaction::update(const string& sender, const string& recipient, float senderBalance, float amount) {
        return NULL;
    }
			
    //TODO: pass by ref, not pointer 
	void Transaction::sign(minacoin::util::crypto::KeyPair* keyPair) {         
        this->logger()->info("signing transaction %s", this->_id.c_str()); 
        this->_input.address = keyPair->publicKey(); 
        this->_input.signature = keyPair->sign(minacoin::util::crypto::hash(this->serializeOutputs().c_str()));
        this->logger()->info("transaction signature is %s", this->_input.signature.c_str()); 
    } 
			
    Transaction* Transaction::create(const string& sender, const string& recipient, float senderBalance, float amount) {
        
        Transaction* tx = new Transaction(); 
        
        //add outputs 
        tx->configure(sender, recipient, senderBalance, amount);
        /*
        transaction->_outputRecip.amount = amount;
        transaction->_outputRecip.address = recipient;
        
        transaction->_outputSelf.amount = (senderBalance - amount); 
        transaction->_outputSelf.address = sender;
        
        transaction->_input.timestamp = minacoin::util::timestamp();
        transaction->_input.amount = senderBalance;
        */
        
        return tx;
    }
    
    Transaction* Transaction::reward(const string& minerAddress, const string& bcAddress) {
        Transaction* tx = new Transaction(); 
        tx->configure(bcAddress, minerAddress, __MINING_REWARD__, __MINING_REWARD__); 
        
        return tx;
    }
			
    bool Transaction::verify(Transaction* tx) {
        string publicKey = tx->_input.address;
        string signature = tx->_input.signature;
        string data = minacoin::util::crypto::hash(tx->serializeOutputs().c_str()); 
        
        return minacoin::util::crypto::verify(publicKey, signature, data); 
    }			
    
    string Transaction::serializeOutputs() const {
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
    
    string Transaction::serializeInput() const {
        return ""; //TODO: do we need this?
    }
			
	string Transaction::toJson() const { 
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
		if (json.empty()) {
			return nullptr;
		}
        Transaction* trans = new Transaction(); 
        trans->fromJson(json);
        return trans;
    }
    
    void Transaction::configure(const string& sender, const string& recipient, float inputAmount, float outputAmount) {
        this->_input.amount = inputAmount;
        this->_input.timestamp = minacoin::util::timestamp();
        this->_input.address = sender;
        
        this->_outputRecip.address = recipient; 
        this->_outputRecip.amount = outputAmount;
        
        this->_outputSelf.address = sender;
        this->_outputSelf.amount = (inputAmount - outputAmount);
    }
}