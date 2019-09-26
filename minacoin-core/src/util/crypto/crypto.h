#ifndef __CRYPTO_H__
#define __CRYPTO_H__

#include "../../inc.h"
#include "keypair.hpp"

namespace minacoin::util::crypto {
	
	std::string hash(const char* data);
	
	char* hashStr(const std::string& data); 
	
	std::string guid(); 
	
	KeyPair* generateKeyPair();
	
	bool verify(const std::string& publicKey, const std::string& signature, const std::string& data); 
}

#endif
