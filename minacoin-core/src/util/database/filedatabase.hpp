#ifndef __FILE_DATABASE_H__
#define __FILE_DATABASE_H__

#include "../../inc.h" 
#include "idatabase.hpp"
#include "../../loggingobj.hpp"
#include <fstream> 

using namespace minacoin::wallet;
using namespace minacoin::blockchain;
using namespace minacoin::util::logging; 

namespace minacoin::util::database {
    class FileDatabase: public IDatabase, LoggingObj {
        private: 
            string _walletFilename = __WALLET_DB_FILENAME__; 
            string _blockchainFilename = __BLOCKCHAIN_DB_FILENAME__; 
            
        public: 
            FileDatabase() {
                this->logTag("FDB");
            }
            
        public: 
            virtual Wallet* getWallet() override {
                string json = this->readFile(_walletFilename); 
                return Wallet::createFromJson(json);
            }
            
            virtual Blockchain* getBlockchain() override {
                string json = this->readFile(_blockchainFilename); 
                return Blockchain::createFromJson(json);
            }
            
            virtual void saveWallet(Wallet* wallet) override {
                this->logger()->info("saving wallet to file...");
                this->saveFile(_walletFilename, wallet); 
                this->logger()->info("...saved");
            }
             
            virtual void saveBlockchain(Blockchain* blockchain) override {
                this->logger()->info("saving blockchain to file...");
                this->saveFile(_blockchainFilename, blockchain); 
                this->logger()->info("...saved");
            } 
            
        private: 
            void saveFile(string filename, IJsonSerializable* data) {
                try {
                    ofstream file; 
                    file.open(filename); 
                    file << data->toJson(); 
                    file.close(); 
                }
                catch(std::exception& e) {
                    this->logger()->error(e.what());
                }
            }
            
            string readFile(string filename) {
                try {
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
                catch(std::exception& e) {
                    this->logger()->error(e.what());
                    return "";
                }
            }
    }; 
}

#endif