#include "crypto++/hex.h"
#include "crypto++/eccrypto.h"
#include "crypto++/osrng.h"
#include "crypto++/oids.h"
#include <iostream>
#include "keypair.hpp"

using namespace CryptoPP; 
using namespace std;

namespace minacoin::lib::util::crypto {
    
    string KeyPair::publicKey() {
        return this->_pubKeyStr;
    }
    
    string KeyPair::privateKey() {
        return this->_privKeyStr;
    }
    
    KeyPair::KeyPair(CryptoPP::ECDSA<ECP, SHA1>::PrivateKey privateKey, CryptoPP::ECDSA<ECP, SHA1>::PublicKey publicKey) {
        this->_publicKey = publicKey; 
        this->_privateKey = privateKey;
        
        //TODO: get string values 
        this->_pubKeyStr = "258114075ed5549bfb9ae0e2a5fef724415528b7be5f9fec4922933225e0496";
    } 
    
    KeyPair::~KeyPair() {
        
    }
    
    std::string KeyPair::sign(const string& data) {
        return "signature"; 
    }
        
    KeyPair* KeyPair::generate() {
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
                
        return new KeyPair(privateKey, publicKey); 
    }
}
