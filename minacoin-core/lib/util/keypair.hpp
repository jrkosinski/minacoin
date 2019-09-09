#ifndef __KEYPAIR_H__
#define __KEYPAIR_H__

#include "crypto++/hex.h"
#include "crypto++/eccrypto.h"
#include "crypto++/osrng.h"
#include "crypto++/oids.h"

using namespace CryptoPP; 
using namespace std;

namespace minacoin { namespace lib { namespace util { namespace crypto { 
    class KeyPair {
        private: 
            CryptoPP::ECDSA<ECP, SHA1>::PrivateKey _privateKey;
            CryptoPP::ECDSA<ECP, SHA1>::PublicKey _publicKey;
            string _pubKeyStr;
            string _privKeyStr;
            
        public: 
            std::string publicKey(); 
            std::string privateKey(); 
            
        public: 
            KeyPair(CryptoPP::ECDSA<ECP, SHA1>::PrivateKey privateKey, CryptoPP::ECDSA<ECP, SHA1>::PublicKey publicKey); 
            ~KeyPair();
            
        public: 
            std::string sign(std::string data); 
            
        public: 
            static KeyPair* generate();
    }; 
}}}}

#endif 

