#ifndef __TRANSACTION_H__
#define __TRANSACTION_H__

#include "../inc.h"
#include "../blockchain/iblockdataitem.hpp" 
#include "../util/crypto/keypair.hpp"
#include "../loggingobj.hpp"

using namespace minacoin::util::crypto; 

namespace minacoin::wallet {
	
	struct TxInput {
		uint timestamp;
		float amount; 
		string address; 
		string signature;
	}; 

	struct TxOutput {
		float amount; 
		string address; 
	};
	
	class Transaction: public minacoin::blockchain::IBlockDataItem, LoggingObj {
		private: 
			string _id; 
			TxInput _input;
			TxOutput _outputRecip; 
			TxOutput _outputSelf;
		
		public:
			string id() const override { return _id; };
			uint timestamp() const { return _input.timestamp; }
			TxInput input() const { return _input; }
			string sender() const { return _input.address; }
			TxOutput outputRecip() const { return _outputRecip; }
			TxOutput outputSelf() const { return _outputSelf; }
			float inputAmount() const { return _input.amount; }
			float outputAmount() const { return _outputRecip.amount; }
			float totalOutput() const { return _outputRecip.amount + _outputSelf.amount; }
			
		public: 
			Transaction();
			~Transaction(); 
			
		public: 
			Transaction* update(const string& sender, const string& recipient, float senderBalance, float amount); 
			void sign(minacoin::util::crypto::KeyPair* keyPair); 
			
		public: 
			static Transaction* create(const string& sender, const string& recipient, float senderBalance, float amount);
			static bool verify(Transaction* tx); 
			static Transaction* reward(const string& minerAddress, const string& bcAddress); 
			static Transaction* createFromJson(const string& json);
			
		public: 
			virtual string toJson() const override; 
			virtual void fromJson(const string& json) override;
			
		private: 
			string serializeOutputs() const;
			string serializeInput() const;
			void configure(const string& sender, const string& recipient, float inputAmount, float outputAmount);
	}; 
}

#endif
