#include "crypto++/hex.h"
#include "crypto++/eccrypto.h"
#include "crypto++/osrng.h"
#include "crypto++/oids.h"
#include <iostream>
#include "keypair.hpp"

using namespace CryptoPP; 
using namespace std;

namespace minacoin { namespace lib { namespace util { namespace crypto { 
    
    string KeyPair::publicKey() {
        return this->_pubKeyStr;
    }
    
    string KeyPair::privateKey() {
        return this->_privKeyStr;
    }
    
    KeyPair::KeyPair(CryptoPP::ECDSA<ECP, SHA1>::PrivateKey privateKey, CryptoPP::ECDSA<ECP, SHA1>::PublicKey publicKey) {
        this->_publicKey = publicKey; 
        this->_privateKey = privateKey;
        
        //get string values 
    } 
    
    KeyPair::~KeyPair() {
        
    }
    
    string KeyPair::sign(string data) {
        
    }
        
    KeyPair KeyPair::generate() {
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
                
        KeyPair kp(kp._privateKey = privateKey, kp._publicKey = publicKey);                 
        return kp; 
    }
}}}}
