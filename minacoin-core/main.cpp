#include "src/inc.h" 
#include "src/blockchain/block.hpp"
#include "src/blockchain/blockchain.hpp"
#include "src/wallet/wallet.hpp"
#include "src/wallet/transaction.hpp"
#include "src/wallet/txpool.hpp"
#include "src/miner/miner.hpp"
#include "src/util/database/idatabase.hpp"
#include "src/util/database/filedatabase.hpp"
#include "src/util/database/memorydatabase.hpp"
#include "src/util/crypto/crypto.h"

#include <stdio.h>

#include "src/util/logging/spdlogger.hpp"
#include "src/util/logging/spdloggerfactory.hpp"
#include "src/ioc.hpp"
#include "src/server/server.hpp"

#include "src/util/base64/base64.h"

using namespace minacoin::blockchain;
using namespace minacoin::wallet;
using namespace minacoin::miner;
using namespace minacoin::server;
using namespace minacoin::util::logging; 
using namespace minacoin::util::database; 

//TODO: go over all functions, replace immutable pointers with const ref&

IOC* initializeIoc() {
	IOC* ioc = IOC::instance(); 
	IOC::registerService<ILoggerFactory>(make_shared<SpdLoggerFactory>()); 
	IOC::registerService<IDatabase>(make_shared<FileDatabase>()); 
	return ioc;
}

template <typename T> 
string type_of(const T& t) {
	return typeid(t).name();
}

template <class T> 
class type_of1 { 
	private: 
		T* _t; 
		
	public: 
		type_of1(T* t) { _t = t; };
		string name() { return typeid(_t).name(); }
};

template <> 
class type_of1<Wallet*> { 
	public: 
		type_of1(Wallet* w) { }
		string name() { return "walletzki"; }
};

int main() {
	initializeIoc(); 
	
	auto server = make_unique<Server>(false);
	
	cout << type_of1<Server>(server.get()).name() << "\n";
	cout << type_of1<Wallet*>(server->wallet()).name() << "\n";

	return 0;
}