#ifndef __WALLET_H__
#define __WALLET_H__

#include <string> 
#include "../util/crypto.h" 
#include "../util/keypair.hpp" 
#include "../blockchain/blockchain.hpp"
#include "../ijsonserializable.hpp"
#include "transaction.hpp"
#include "txpool.hpp"

using namespace std; 
using namespace minacoin::lib; 
using namespace minacoin::lib::blockchain;
using namespace minacoin::lib::util::crypto;

namespace minacoin::lib::wallet { 
	
	class Wallet: public IJsonSerializable {
		private: 
			float _balance;
			string _address; 
			minacoin::lib::util::crypto::KeyPair* _keyPair; 
			
		public: 
			float balance() { return _balance; }
			string address() { return _address; }
			
		public: 
			Wallet();
			~Wallet(); 
			
		public: 
			void sign(const string& data); 
			Transaction* send(const string& recipient, float amount, Blockchain* blockchain, TxPool* txPool); 
			float updateBalance(Blockchain* blockchain);
			
		public: 
			static Wallet* createFromJson(const string& json);
			
		public: 
			virtual string toJson() override; 
			virtual void fromJson(const string& json) override;
	}; 
}

#endif 
