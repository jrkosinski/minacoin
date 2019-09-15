#ifndef __FILE_DATABASE_H__
#define __FILE_DATABASE_H__

#include "../inc.h" 
#include "idatabase.hpp"

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
            
            virtual void saveWallet(const Wallet& wallet) override {
                this->saveFile(_walletFilename, wallet); 
            }
             
            virtual void saveBlockchain(const Blockchain& blockchain) override {
                this->saveFile(_blockchainFilename, blockchain); 
            } 
            
        private: 
            void saveFile(string filename, const IJsonSerializable& data) {
                
            }
            
            string readFile(string filanem) {
                return ""; 
            }
    }; 
}

#endif