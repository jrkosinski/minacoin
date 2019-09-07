#ifndef __CRYPTO_H__
#define __CRYPTO_H__

#include <string> 

namespace minacoin { namespace lib { namespace util { namespace crypto {
	
	std::string hash(const char* data);
	
	void generateKeyPair();
}}}}

#endif
