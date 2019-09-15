#ifndef __FILE_DATABASE_H__
#define __FILE_DATABASE_H__

#include "../inc.h" 
#include "idatabase.hpp"
#include <fstream> 

using namespace minacoin::wallet;
using namespace minacoin::blockchain;

namespace minacoin::util::database {
    class FileDatabase: public IDatabase {
        private: 
            string _walletFilename = __WALLET_DB_FILENAME__; 
            string _blockchainFilename = __BLOCKCHAIN_DB_FILENAME__; 
            
        public: 
            virtual Wallet* getWallet() override {
                string json = this->readFile(_walletFilename); 
                return Wallet::createFromJson(json);
            }
            
            virtual Blockchain* getBlockchain() override {
                string json = this->readFile(_blockchainFilename); 
                return Blockchain::createFromJson(json);
            }
            
            virtual void saveWallet(Wallet& wallet) override {
                this->saveFile(_walletFilename, wallet); 
            }
             
            virtual void saveBlockchain(Blockchain& blockchain) override {
                this->saveFile(_blockchainFilename, blockchain); 
            } 
            
        private: 
            void saveFile(string filename, IJsonSerializable& data) {
                ofstream file; 
                file.open(filename); 
                file << data.toJson(); 
                file.close(); 
            }
            
            string readFile(string filename) {
                string output, line; 
                ifstream file(filename); 
                if (file.is_open()) {
                    while(getline(file, line)) {
                        output += line;
                    }
                    file.close();
                }
                return output; 
            }
    }; 
}

#endif