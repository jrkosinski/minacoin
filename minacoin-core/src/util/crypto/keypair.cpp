#include "crypto++/hex.h"
#include "crypto++/eccrypto.h"
#include "crypto++/osrng.h"
#include "crypto++/oids.h"
#include <iostream>
#include <ostream>
#include <sstream>
#include "keypair.hpp"

using namespace CryptoPP; 
using namespace std;

namespace minacoin::util::crypto {
    
    string KeyPair::publicKey() {
        return this->_pubKeyStr;
    }
    
    string KeyPair::privateKey() {
        return this->_privKeyStr;
    }
    
    KeyPair::KeyPair(CryptoPP::ECDSA<ECP, SHA1>::PrivateKey privateKey, CryptoPP::ECDSA<ECP, SHA1>::PublicKey publicKey) {
        this->_publicKey = publicKey; 
        this->_privateKey = privateKey;
        
        //get string value of public key
        const ECP::Point& q = publicKey.GetPublicElement();
		ostringstream ossPub;
        ossPub << std::hex << q.x << q.y;         
        this->_pubKeyStr = ossPub.str();
                
        //get string value of private key
        const CryptoPP::Integer& x1 = privateKey.GetPrivateExponent();
        ostringstream ossPriv;
        ossPriv << std::hex << x1; 
        this->_privKeyStr = ossPriv.str();
    } 
    
    KeyPair::~KeyPair() {
        //https://www.cryptopp.com/wiki/Elliptic_Curve_Digital_Signature_Algorithm
    }
    
    std::string KeyPair::sign(const string& data) {
        AutoSeededRandomPool rng;
        string signature;

        ECDSA<ECP,SHA1>::Signer signer(this->_privateKey); 
        CryptoPP::StringSource ss(data, true,
                            new CryptoPP::SignerFilter(rng, signer,
                              new CryptoPP::HexEncoder(
                                new CryptoPP::StringSink(signature))));
        
        //printf("data is %s\n", data.c_str()); 
        //printf("signature is %s\n", signature.c_str()); 
        return signature;
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
                
        //std::cout << "pub x: " << std::hex << qx << "\n";
        //std::cout << "pub y: " << std::hex << qy << "\n";
                
        return new KeyPair(privateKey, publicKey); 
    }
}
