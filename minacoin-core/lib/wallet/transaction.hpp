#ifndef __TRANSACTION_H__
#define __TRANSACTION_H__

#include "../blockchain/iblockdataitem.hpp" 
#include "../util/keypair.hpp"
#include <string>

using namespace std; 

namespace minacoin::lib::wallet {
	
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
	
	class Transaction: public minacoin::lib::blockchain::IBlockDataItem {
		private: 
			string _id; 
			TxInput _input;
			TxOutput _outputRecip; 
			TxOutput _outputSelf;
		
		public:
			string id() { return _id; }
			uint timestamp() { return _input.timestamp; }
			TxInput input() { return _input; }
			TxOutput outputRecip() { return _outputRecip; }
			TxOutput outputSelf() { return _outputSelf; }
			
		public: 
			Transaction();
			~Transaction(); 
			
		public: 
			Transaction* update(const string& sender, const string& recipient, float senderBalance, float amount); 
			void sign(minacoin::lib::util::crypto::KeyPair* keyPair); 
			
		public: 
			static Transaction* create(const string& sender, const string& recipient, float senderBalance, float amount);
			static bool verify(Transaction* tx); 
			//static Transaction* reward(Wallet* miner, Wallet* blockchainWallet); 
			static Transaction* createFromJson(const string& json);
			
		public: 
			virtual string toJson() override; 
			virtual void fromJson(const string& json) override;
			
		private: 
			string serializeOutputs();
			string serializeInput();
	}; 
}

#endif
