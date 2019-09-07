#ifndef __WALLET_H__
#define __WALLET_H__

#include <string> 
#include "../util/crypto.h" 

using namespace std; 

namespace minacoin { namespace lib { namespace blockchain { 
	
	class Wallet {
		private: 
			float _balance;
			string _address; 
			//keyPair 
			
		public: 
			Wallet();
			~Wallet(); 
			
		public: 
			void sign(string data); 
			//Transaction* createTransaction(string recipient, float amount, Blockchain* blockchain /*TxPool */); 
			//float updateBalance(Blockchain* blockchain); 
			
		private:
			//float calculateBalance(Blockchain* blockchain); 
	}; 
}}}

#endif 
