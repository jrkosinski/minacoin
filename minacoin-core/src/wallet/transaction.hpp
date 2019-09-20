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
			vector<TxOutput> _outputRecip; 
			TxOutput _outputSelf;
		
		public:
			string id() const override { return _id; };
			uint timestamp() const { return _input.timestamp; }
			TxInput input() const { return _input; }
			string sender() const { return _input.address; }
			const vector<TxOutput>& outputRecip() const { return _outputRecip; }
			TxOutput outputSelf() const { return _outputSelf; }
			float inputAmount() const { return _input.amount; }
			float totalOutput() const { return this->outputAmount() + _outputSelf.amount; }
			float outputAmount() const { 
				float sum = 0; 
				
				//TODO: some kind of sum operation here 
				for(auto it = _outputRecip.begin(); it!= _outputRecip.end(); ++it) {
					sum += it->amount;
				}
				return sum;
			}
			
		public: 
			Transaction();
			~Transaction(); 
			
		public: 
			Transaction* update(const string& sender, const string& recipient, float senderBalance, float amount); 
			void sign(const minacoin::util::crypto::KeyPair* keyPair); 
			
		public: 
			static Transaction* create(const string& sender, const string& recipient, float senderBalance, float amount);
			static bool verify(const Transaction* tx); 
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
