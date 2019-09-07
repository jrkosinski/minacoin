
#include "crypto.h" 
#include "crypto++/cryptlib.h"
#include "crypto++/sha.h"
#include "crypto++/hex.h"
#include "crypto++/eccrypto.h"
#include "crypto++/osrng.h"
#include "crypto++/oids.h"

#include <iostream> 
#include <stdio.h>

using namespace CryptoPP; 

namespace minacoin { namespace lib { namespace util { namespace crypto {
	
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
	
	void generateKeyPair() {
		//ECIES<ECP>::Decryptor d;
		//d.AccessKey().GenerateRandom(GlobalRNG(), MakeParameters(Name::GroupOID(), ASN1::secp256r1()));
		
		CryptoPP::AutoSeededRandomPool prng;
		CryptoPP::ECDSA<ECP, SHA1>::PrivateKey privateKey;
		CryptoPP::ECDSA<ECP, SHA1>::PublicKey publicKey;
		privateKey.Initialize( prng, CryptoPP::ASN1::secp256r1());

		const CryptoPP::Integer& x1 = privateKey.GetPrivateExponent();
		std::cout << "priv:  " << std::hex << x1 << "\n";
		privateKey.MakePublicKey( publicKey );
		publicKey.AccessGroupParameters().SetPointCompression(true);
		const ECP::Point& q = publicKey.GetPublicElement();
		const CryptoPP::Integer& qx = q.x;
		const CryptoPP::Integer& qy = q.y;
		
		std::cout << "pub x: " << std::hex << qx << "\n";
		std::cout << "pub y: " << std::hex << qy << "\n";
	}
}}}}

