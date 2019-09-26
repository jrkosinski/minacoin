#include "crypto.h" 
#include "crypto++/cryptlib.h"
#include "crypto++/sha.h"
#include "crypto++/hex.h"
#include "crypto++/eccrypto.h"
#include "crypto++/osrng.h"
#include "crypto++/oids.h"
#include <Poco/UUIDGenerator.h>

#include "keypair.hpp" 

#include <stdio.h>
#include <ostream>
#include <sstream>

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
		
		//owner: ?
		encoder.Attach( new CryptoPP::StringSink(output));
		encoder.Put(digest, sizeof(digest));
		encoder.MessageEnd();
		
		return output;
	}
	
	char* hashStr(const std::string& data) {
		return const_cast<char*>(hash(data.c_str()).c_str()); 
	}
	
	std::string guid() {
		return Poco::UUIDGenerator().createRandom().toString();
	}
	
	KeyPair* generateKeyPair() {
		return KeyPair::generate();
	}
	
	bool verify(const std::string& publicKey, const std::string& signature, const std::string& data) {
		bool result = false;
		
        CryptoPP::ECDSA<ECP, SHA1>::PublicKey pubKey;
		pubKey.Load(CryptoPP::StringSource(KeyPair::decompressPubKey(publicKey), true, new CryptoPP::HexDecoder()).Ref());
		
		std::string decodedSignature;
		//owners: ?
		CryptoPP::StringSource ss(signature, true,
									new CryptoPP::HexDecoder(
									new CryptoPP::StringSink(decodedSignature)));
				
		ECDSA<ECP,SHA1>::Verifier verifier(pubKey);
		//owners: ?
		CryptoPP::StringSource ss2(decodedSignature + data, true,
									new CryptoPP::SignatureVerificationFilter(verifier,
									new CryptoPP::ArraySink((byte*)&result,
															sizeof(result))));
														
		return result; 
		
	}
}

