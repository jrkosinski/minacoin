#ifndef __KEYPAIR_H__
#define __KEYPAIR_H__

#include "../../inc.h"
#include "crypto++/hex.h"
#include "crypto++/eccrypto.h"
#include "crypto++/osrng.h"
#include "crypto++/oids.h"
#include <ostream>
#include <sstream>
#include "../base64/base64.h"

using namespace CryptoPP; 

namespace minacoin::util::crypto {
    class KeyPair {
        private: 
            CryptoPP::ECDSA<ECP, SHA1>::PrivateKey _privateKey;
            CryptoPP::ECDSA<ECP, SHA1>::PublicKey _publicKey;
            string _pubKeyStr;
            string _privKeyStr;
            
        public: 
            std::string publicKey() const { return this->_pubKeyStr; } 
            std::string privateKey() const { return this->_privKeyStr; }
            
        public: 
            KeyPair(CryptoPP::ECDSA<ECP, SHA1>::PrivateKey privateKey, CryptoPP::ECDSA<ECP, SHA1>::PublicKey publicKey)  {
                this->_publicKey = publicKey; 
                this->_privateKey = privateKey;
                
                //get string value of public key
                ByteQueue bq;
                publicKey.Save(bq);
                HexEncoder encoder;
                bq.CopyTo(encoder);
                encoder.MessageEnd();
                string pubKeyEncoded; 
                CryptoPP::StringSink ss(pubKeyEncoded);
                encoder.CopyTo(ss);
                ss.MessageEnd();
                
                this->_pubKeyStr = minacoin::util::base64::string_compress_encode(pubKeyEncoded);                 
                
                //private string 
                string privKeyStr;
                privateKey.Save(CryptoPP::HexEncoder(new CryptoPP::StringSink(privKeyStr)).Ref());
                
                this->_privKeyStr = privKeyStr;
            }  
           
           ~KeyPair() {
                //https://www.cryptopp.com/wiki/Elliptic_Curve_Digital_Signature_Algorithm
            }
            
        public: 
            std::string sign(const string& data) const {
                AutoSeededRandomPool rng;
                string signature;

                ECDSA<ECP,SHA1>::Signer signer(this->_privateKey); 
                CryptoPP::StringSource ss(data, true,
                                    new CryptoPP::SignerFilter(rng, signer,
                                    new CryptoPP::HexEncoder(
                                        new CryptoPP::StringSink(signature))));
                
                return signature;
            }
            
        public: 
            static KeyPair* generate()  {
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
            
            static KeyPair* deserialize(const string& pubKey, const string& privKey) {
                CryptoPP::ECDSA<ECP, SHA1>::PrivateKey privateKey; 
                CryptoPP::ECDSA<ECP, SHA1>::PublicKey publicKey; 
                
                publicKey.Load(CryptoPP::StringSource(KeyPair::decompressPubKey(pubKey), true, new CryptoPP::HexDecoder()).Ref());
                privateKey.Load(CryptoPP::StringSource(privKey, true, new CryptoPP::HexDecoder()).Ref());        
                
                return new KeyPair(privateKey, publicKey); 
            }
            
            static string decompressPubKey(const std::string& pubKey) {
                return minacoin::util::base64::string_decode_decompress(pubKey); 
            }
    };
}

#endif 

