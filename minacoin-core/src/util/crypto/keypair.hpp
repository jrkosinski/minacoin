#ifndef __KEYPAIR_H__
#define __KEYPAIR_H__

#include "../../inc.h"
#include "crypto++/hex.h"
#include "crypto++/eccrypto.h"
#include "crypto++/osrng.h"
#include "crypto++/oids.h"
#include <ostream>
#include <sstream>

using namespace CryptoPP; 

namespace minacoin::util::crypto {
    class KeyPair {
        private: 
            CryptoPP::ECDSA<ECP, SHA1>::PrivateKey _privateKey;
            CryptoPP::ECDSA<ECP, SHA1>::PublicKey _publicKey;
            string _pubKeyStr;
            string _privKeyStr;
            
        public: 
            std::string publicKey() { return this->_pubKeyStr; } 
            std::string privateKey() { return this->_privKeyStr; }
            
        public: 
            KeyPair(CryptoPP::ECDSA<ECP, SHA1>::PrivateKey privateKey, CryptoPP::ECDSA<ECP, SHA1>::PublicKey publicKey)  {
                this->_publicKey = publicKey; 
                this->_privateKey = privateKey;
                
                //TODO: clean up this mess
                /*
                //get string value of public key
                const ECP::Point& q = publicKey.GetPublicElement();
                
                ostringstream ossPub1, ossPub2;
                ossPub1 << std::hex << q.x;        
                ossPub2 << std::hex << q.y;        
                string qx = ossPub1.str();  
                string qy = ossPub2.str();
                size_t len1 = qx.length();
                size_t len2 = qy.length();
                //cout << len1 << ": " << q.x << ": " << qx << "\n"; 
                //cout << len2 << ": " << q.y << ": " << qy << "\n"; 
                
                this->_pubKeyStr = qx + qy; 
                */
                
                //publicKey.Save(CryptoPP::HexEncoder(new CryptoPP::StringSink(this->_pubKeyStr)).Ref());
                        
                //get string value of private key
                
                /*
                const CryptoPP::Integer& x1 = privateKey.GetPrivateExponent();
                ostringstream ossPriv;
                ossPriv << std::hex << x1; 
                this->_privKeyStr = ossPriv.str();
                */
                
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
                
                this->_pubKeyStr = pubKeyEncoded; 
                
                //TODO: compress & base64-encode output for public key (MED)
                //string pubKeyCompressed = string_compress_encode(pubKeyEncoded); 
            
                //private string 
                string privKeyStr;
                privateKey.Save(CryptoPP::HexEncoder(new CryptoPP::StringSink(privKeyStr)).Ref());
                //cout << "priv key str: " << privKeyStr << "\n"; 
                this->_privKeyStr = privKeyStr;
            }  
           
           ~KeyPair() {
                //https://www.cryptopp.com/wiki/Elliptic_Curve_Digital_Signature_Algorithm
            }
            
        public: 
            std::string sign(const string& data) {
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
                
                publicKey.Load(CryptoPP::StringSource(pubKey, true, new CryptoPP::HexDecoder()).Ref());
                privateKey.Load(CryptoPP::StringSource(privKey, true, new CryptoPP::HexDecoder()).Ref());        
                
                return new KeyPair(privateKey, publicKey); 
            }
    };
}

#endif 

