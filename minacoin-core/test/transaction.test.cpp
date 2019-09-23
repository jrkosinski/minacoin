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

#include "include/catch.hpp"
#include "include/test.h"

TEST_CASE("wallet")
{
    initializeIoc(); 
    
    SECTION("transaction amounts are correct") {
        auto server = make_unique<Server>(false); 
        auto wallet = server->wallet(); 
        string recipient = "x0x0x0x0x0x0x"; 
        float amount = 100; 
        
        Transaction* tx = wallet->send(recipient, amount, server->blockchain()); 
        
        //outputs the `amount` subtracted from the wallet balance
        REQUIRE(tx->outputSelf().amount == wallet->balance() - amount); 
        
        //outputs the `amount` added to the recipient
        REQUIRE(tx->outputRecip().at(0).amount == amount); 
        REQUIRE(tx->outputRecip().size() == 1); 
        
        //inputs the balance of the Wallet
        REQUIRE(tx->inputAmount() == wallet->balance()); 
    }
    
    SECTION("validation of transactions") {
        auto server = make_unique<Server>(false); 
        auto wallet = server->wallet(); 
        string recipient = "x0x0x0x0x0x0x"; 
        Transaction* tx = wallet->send(recipient, 100, server->blockchain()); 
        
        //validates a valid transaction
        REQUIRE(tx->verify()); 
        
        //TODO: this test case
        //invalidates a invalid transaction
        //tx->outputRecip().at(0).amount = 2; 
        
        //transaction.outputs[0].amount = 500000;
        //expect(Transaction.verifyTransaction(transaction)).toBe(false);
    }
    
    SECTION("exceeding wallet balance") {
        auto server = make_unique<Server>(false); 
        auto wallet = server->wallet(); 
        string recipient = "x0x0x0x0x0x0x"; 
        float amount = wallet->balance()+1; 
        
        Transaction* tx = wallet->send(recipient, amount, server->blockchain()); 
        
        REQUIRE(!tx);
    }
    
    SECTION("transaction updates") {
        auto server = make_unique<Server>(false); 
        auto wallet = server->wallet(); 
        string recipient1 = "x0x0x0x0x0x0x"; 
        string recipient2 = "x0x0x0x0x0x0x"; 
        float amount = 100; 
        
        Transaction* tx = wallet->send(recipient1, amount, server->blockchain()); 
        tx = tx->update(wallet->address(), recipient2, wallet->balance(), amount); 
        
        REQUIRE(tx->outputSelf().amount == (wallet->balance() - (amount*2))); 
        REQUIRE(tx->outputRecip().size() == 2); 
        REQUIRE(tx->outputRecip().at(0).address == recipient1); 
        REQUIRE(tx->outputRecip().at(1).address == recipient2); 
        REQUIRE(tx->outputRecip().at(0).amount == amount); 
        REQUIRE(tx->outputRecip().at(1).amount == amount); 
    }
    
    SECTION("reward transactions") {
        auto server = make_unique<Server>(false); 
        auto wallet = server->wallet(); 
        float amount = 100; 
        
        Transaction* tx = Transaction::reward(wallet->address(), "0x0x00x0x"); 
        REQUIRE(tx->outputRecip().size() == 1); 
        REQUIRE(tx->outputRecip().at(0).address == wallet->address()); 
        REQUIRE(tx->outputRecip().at(0).amount == __MINING_REWARD__); 
    }
    
    SECTION("serialize/deserialize transaction") {
        auto server = make_unique<Server>(false); 
        auto wallet = server->wallet(); 
        string recipient = "x0x0x0x0x0x0x"; 
        float amount = 100; 
        
        Transaction* tx = wallet->send(recipient, amount, server->blockchain()); 
        
        string json = tx->toJson(); 
        Transaction* txx = Transaction::createFromJson(json); 
        
        REQUIRE(tx->outputSelf().amount == wallet->balance() - amount); 
        REQUIRE(tx->outputRecip().at(0).amount == amount); 
        REQUIRE(tx->outputRecip().size() == 1); 
        REQUIRE(tx->inputAmount() == wallet->balance()); 
        REQUIRE(tx->verify()); 
    }
}

