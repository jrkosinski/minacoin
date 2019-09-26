#include "include/test.h"
#include "include/catch.hpp"

#include "../src/blockchain/block.hpp"
#include "../src/blockchain/blockchain.hpp"
#include "../src/blockchain/iblockdataitem.hpp"
#include "../src/wallet/wallet.hpp"
#include "../src/wallet/transaction.hpp"
#include "../src/wallet/txpool.hpp"
#include "../src/server/server.hpp"
#include "../src/util/crypto/crypto.h"

#include <stdio.h>
#include <vector> 

using namespace minacoin::blockchain; 
using namespace minacoin::wallet;
using namespace minacoin::server;

TEST_CASE("txpool")
{
    initializeIoc(); 
    
    SECTION("adds transaction to pool") {
        auto server = make_unique<Server>(false); 
        auto wallet = server->wallet(); 
        auto blockchain = server->blockchain(); 
        auto txpool = server->txPool(); 
        string recipient = "0x0x0x0x0x0x"; 
        float amount = 100; 
        
        auto tx = wallet->send(recipient, amount, blockchain, txpool); 
        
        REQUIRE(txpool->txCount() == 1); 
        REQUIRE(txpool->validTxs(blockchain).size() == 1); 
        REQUIRE(txpool->validTxs(blockchain).at(0)->equals(tx)); 
    }
    
    SECTION("updates transaction in pool") {
        auto server = make_unique<Server>(false); 
        auto wallet = server->wallet(); 
        auto blockchain = server->blockchain(); 
        auto txpool = server->txPool(); 
        string recipient1 = "0x0x0x0x0x0x"; 
        string recipient2 = "101010101010"; 
        float amount = 100; 
        
        auto tx1 = wallet->send(recipient1, amount, blockchain, txpool); 
        auto tx2 = wallet->send(recipient2, amount, blockchain, txpool); 
        
        REQUIRE(txpool->txCount() == 1); 
        REQUIRE(txpool->validTxs(blockchain).size() == 1); 
        
        auto tx = txpool->validTxs(blockchain).at(0); 
        REQUIRE(tx->outputAmount() == (amount*2)); 
        REQUIRE(tx->outputRecip().size() == 2); 
    }
    
    SECTION("clears transactions") {
        auto server = make_unique<Server>(false); 
        auto wallet = server->wallet(); 
        auto blockchain = server->blockchain(); 
        auto txpool = server->txPool(); 
        string recipient = "0x0x0x0x0x0x"; 
        float amount = 100; 
        
        auto tx = wallet->send(recipient, amount, blockchain, txpool); 
        
        REQUIRE(txpool->txCount() == 1); 
        txpool->clear(); 
        REQUIRE(txpool->txCount() == 0); 
    }
    
    SECTION("mixing valid and invalid transactions") {
        //TODO: not sure here whether transactions in pool should be updated or what
    /*
    describe('mixing valid and corrupt transactions',()=>{
        let validTransactions;

        beforeEach(()=>{
            validTransactions = [...transactionPool.transactions];

            // creating new transactions with corrupted transactions
            for (let i = 0;i<6;i++){
                wallet = new Wallet();
                transaction = wallet.createTransaction('r4nd-4ddr355',30,blockchain,transactionPool);
                if (i&1){
                    transaction.input.amount = 999999;
                }
                else{
                    validTransactions.push(transaction);
                }
            }
        });

        it('shows a difference between valid adnd corrupt transactions',()=>{
            expect(JSON.stringify(transactionPool.transactions)).not.toEqual(JSON.stringify(validTransactions));
        });

        it('grabs valid transactions',()=>{
            expect(transactionPool.validTransactions()).toEqual(validTransactions);
        });
    });
    */
    }
}


