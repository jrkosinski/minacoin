#ifndef __TRANSACTION_H__
#define __TRANSACTION_H__

#include "wallet.hpp" 
#include "../blockchain/iblockdataitem.hpp" 
#include <string>

using namespace std; 

namespace minacoin { namespace lib { namespace blockchain {
	
	class TxInput {
	}; 

	class TxOutput {
	};
	
	class Transaction: IBlockDataItem {
		private: 
			string _id; 
			TxInput* _input;
			TxOutput* _outputRecip; 
			TxOutput* _outputSelf;
			
		public: 
			Transaction();
			~Transaction(); 
			
		public: 
			Transaction* update(Wallet* senderWallet, string recipient, float amount); 
			
		public: 
			static Transaction* sign(Transaction* tx, Wallet* senderWallet); 
			static Transaction* create(Wallet* senderWallet, string recipient, float amount); 
			static bool verify(Transaction* tx); 
			static Transaction* reward(Wallet* minerWallet, Wallet* blockchainWallet); 
			
		//IBlockDataItem
		public: 
			string toJson() { return ""; }
			void fromJson(string json) { }
	}; 
}}}

#endif
