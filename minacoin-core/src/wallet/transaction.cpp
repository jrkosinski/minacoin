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
       
        this->logger()->info("updating transaction %s...", this->id().c_str()); 

        //make sure we don't exceed the balance of sender
        //TODO: here need to check cumulative amount 
        if (amount > senderBalance){
            this->logger()->warn("amount %f exceeds balance");
            return nullptr;
        }
        
        this->_outputSelf.amount -= amount; 

        //add a new output 
        TxOutput newOutput; 
        newOutput.address = recipient;
        newOutput.amount = amount; 
        this->_outputRecip.push_back(newOutput); 

        return this;
    }
			
    //TODO: pass by ref, not pointer 
	void Transaction::sign(const minacoin::util::crypto::KeyPair* keyPair) {         
        this->logger()->info("signing transaction %s", this->_id.c_str()); 
        this->_input.address = keyPair->publicKey(); 
        this->_input.signature = keyPair->sign(minacoin::util::crypto::hash(this->serializeOutputs().c_str()));
        this->logger()->info("transaction signature is %s", this->_input.signature.c_str()); 
    } 
			
    Transaction* Transaction::create(const string& sender, const string& recipient, float senderBalance, float amount) {
        
        Transaction* tx = new Transaction(); 
        
        //add outputs 
        tx->configure(sender, recipient, senderBalance, amount);
        
        return tx;
    }
    
    Transaction* Transaction::reward(const string& minerAddress, const string& bcAddress) {
        Transaction* tx = new Transaction(); 
        tx->configure(bcAddress, minerAddress, __MINING_REWARD__, __MINING_REWARD__); 
        
        return tx;
    }
			
    bool Transaction::verify() const {
        string publicKey = this->_input.address;
        string signature = this->_input.signature;
        string data = minacoin::util::crypto::hash(this->serializeOutputs().c_str()); 
        
        return minacoin::util::crypto::verify(publicKey, signature, data); 
    }
    
    string Transaction::serializeInput() const {
        string output = "{input:{address:" + this->_input.address + ",amount:" + std::to_string(this->_input.amount) + "}}"; 
        return output;     
    }
    
    string Transaction::serializeOutputs() const {
        string output = "{outputRecip:["; 
        for(auto it=this->_outputRecip.begin(); it!=_outputRecip.end(); ++it) {            
            output += "{address:" + it->address + ",amount:" + std::to_string(it->amount) + "}";
        }
        output += "],outputSelf:{address:"; 
        output += this->_outputSelf.address; 
        output += ",amount:";
        output += boost::lexical_cast<std::string>(this->_outputSelf.amount);
        output += "}";
        
        return output; 
    }
    
    string Transaction::getHash() const {
        return minacoin::util::crypto::hash((this->serializeInput() + this->serializeOutputs()).c_str()); 
    }

	string Transaction::toJson() const { 
		Poco::JSON::Object obj; 
		Poco::JSON::Object input; 
		Poco::JSON::Array::Ptr outputRecip = new Poco::JSON::Array(); 
		Poco::JSON::Object outputSelf; 
        
		obj.set("id", this->_id);
        
        input.set("address", this->_input.address);
        input.set("timestamp", this->_input.timestamp);
        input.set("amount", this->_input.amount);
        input.set("signature", this->_input.signature);
        
        size_t index = 0;
        for(auto it=this->_outputRecip.begin(); it!=_outputRecip.end(); ++it) {     
		    Poco::JSON::Object outputR;        
            outputR.set("address", it->address);
            outputR.set("amount", it->amount);
            outputRecip->set(index++, outputR);   
        }
        
        outputSelf.set("address", this->_outputSelf.address);
        outputSelf.set("amount", this->_outputSelf.amount);
        
        obj.set("input", input);
        obj.set("outputRecip", outputRecip);
        obj.set("outputSelf", outputSelf);
		
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
        auto outputRecipObj = object->get("outputRecip").extract<Poco::JSON::Array::Ptr>();
        this->_outputRecip.clear(); 
		for (auto it= outputRecipObj->begin(); it != outputRecipObj->end(); ++it)
		{
			auto outp = (*it).extract<Poco::JSON::Object::Ptr>(); 
            TxOutput outr; 
            outr.amount = outp->getValue<float>("amount");
            outr.address = outp->getValue<string>("address");
            this->_outputRecip.push_back(outr);
		}
        
        //output self 
        auto outputSelfObj = object->get("outputSelf").extract<Poco::JSON::Object::Ptr>();
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
        
        TxOutput outputRecip; 
        outputRecip.address = recipient; 
        outputRecip.amount = outputAmount;
        
        this->_outputRecip.push_back(outputRecip); 
        
        this->_outputSelf.address = sender;
        this->_outputSelf.amount = (inputAmount - outputAmount);
    }
    
    bool Transaction::equals(const IBlockDataItem* item) const {
        if (item) {
            return this->equals(reinterpret_cast<const Transaction*>(item)); 
        }
        return false;
    }
    
    bool Transaction::equals(const IBlockDataItem& item) const {
        return this->equals(&item);
    }
    
    bool Transaction::equals(const Transaction* tx) const {
        if (tx) {
            //if ids match, they are equal for sure. 
            if (tx->id() == this->id()) {
                return true;
            }
            
            //TODO: otherwise, might they still be equal? ...
            return this->dataEquals(tx);
        }
        
        return false;
    }
    
    bool Transaction::equals(const Transaction& tx) const {
        return this->equals(&tx);
    }
    
    bool Transaction::dataEquals(const Transaction* tx) const {
        if (!tx) {
            return false;
        }
        
        if (!Transaction::inputsEqual(this->_input, tx->_input)) {
            return false;
        }
        
        if (this->_outputRecip.size() != tx->_outputRecip.size()) {
            return false;
        }
        
        for(size_t n=0; n<this->_outputRecip.size(); n++) {
            if (!Transaction::outputsEqual(this->_outputRecip.at(n), tx->_outputRecip.at(n))) {
                return false;
            }
        }
        
        return true;
    }
    
    bool Transaction::dataEquals(const Transaction& tx) const {
        return this->dataEquals(&tx);
    }
    
    bool Transaction::inputsEqual(const TxInput& a, const TxInput& b) {
        if (a.address != b.address) {
            return false;
        }
        if (a.amount != b.amount) {
            return false;
        }
        if (a.timestamp != b.timestamp) {
            return false;
        }
        if (a.signature != b.signature) {
            return false;
        }
        return true;
    }
    
    bool Transaction::outputsEqual(const TxOutput& a, const TxOutput& b) {
        if (a.address != b.address) {
            return false;
        }
        if (a.amount != b.amount) {
            return false;
        }
        return true;
    }
}