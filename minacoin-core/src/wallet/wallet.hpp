#ifndef __WALLET_H__
#define __WALLET_H__

#include "../inc.h"
#include "../util/crypto/crypto.h"
#include "../util/crypto/keypair.hpp" 
#include "../blockchain/blockchain.hpp"
#include "../ijsonserializable.hpp"
#include "../loggingobj.hpp"
#include "transaction.hpp"
#include "txpool.hpp"

using namespace minacoin::blockchain;
using namespace minacoin::util::crypto;

namespace minacoin::wallet { 
	
	class Wallet: public IJsonSerializable, LoggingObj {
		private: 
			float _balance;
			string _address; 
			minacoin::util::crypto::KeyPair* _keyPair; 
			
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
