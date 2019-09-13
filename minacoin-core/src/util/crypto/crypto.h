#ifndef __CRYPTO_H__
#define __CRYPTO_H__

#include <string> 
#include "keypair.hpp"

namespace minacoin::util::crypto {
	
	std::string hash(const char* data);
	
	std::string guid(); 
	
	KeyPair* generateKeyPair();
}

#endif
