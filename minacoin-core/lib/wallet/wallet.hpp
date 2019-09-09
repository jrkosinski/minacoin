#ifndef __WALLET_H__
#define __WALLET_H__

#include <string> 
#include "../util/crypto.h" 
#include "../util/keypair.hpp" 
#include "../blockchain/blockchain.hpp"
#include "transaction.hpp"
#include "txpool.hpp"

using namespace std; 
using namespace minacoin::lib; 
using namespace minacoin::lib::blockchain;
using namespace minacoin::lib::util::crypto;

namespace minacoin { namespace lib { namespace wallet { 
	
	class Wallet {
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
	}; 
}}}

#endif 
