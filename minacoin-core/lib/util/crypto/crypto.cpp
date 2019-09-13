
#include "crypto.h" 
#include "crypto++/cryptlib.h"
#include "crypto++/sha.h"
#include "crypto++/hex.h"
#include "crypto++/eccrypto.h"
#include "crypto++/osrng.h"
#include "crypto++/oids.h"
#include <Poco/UUIDGenerator.h>

#include "keypair.hpp" 

#include <iostream> 
#include <stdio.h>

using namespace CryptoPP; 

namespace minacoin::util::crypto {
	
	std::string hash(const char* data) {
		CryptoPP::SHA256 hash;
		byte digest[CryptoPP::SHA256::DIGESTSIZE];

		std::string s(data);
		char* d = (char*) data;
		hash.CalculateDigest(digest, reinterpret_cast<byte*>(&d[0]), s.length());
 
		CryptoPP::HexEncoder encoder;
		std::string output;
		encoder.Attach( new CryptoPP::StringSink(output));
		encoder.Put(digest, sizeof(digest));
		encoder.MessageEnd();
		
		return output;
	}
	
	std::string guid() {
		return Poco::UUIDGenerator().createRandom().toString();
	}
	
	KeyPair* generateKeyPair() {
		return KeyPair::generate();
	}
}

