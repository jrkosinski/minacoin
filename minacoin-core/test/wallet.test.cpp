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
#include "../src/util/database/filedatabase.hpp"

#include <stdio.h>
#include <vector> 

using namespace minacoin::blockchain; 
using namespace minacoin::wallet;
using namespace minacoin::server;

TEST_CASE("wallet")
{
    initializeIoc(); 
    
    SECTION("correct balances after transaction") {
        auto server1 = make_unique<Server>(false); //sender
        auto server2 = make_unique<Server>(false); //receiver
        auto senderWallet = server1->wallet(); 
        auto receiverWallet = server2->wallet(); 
        
        float senderBal1 = senderWallet->balance();
        float recipBal1 = receiverWallet->balance();
        float txAmount = 100;
        
        senderWallet->send(receiverWallet->address(), txAmount, server1->blockchain(), server1->txPool()); 
        server1->miner()->mine(); 
        
        server2->blockchain()->replaceChain(server1->blockchain()); 
        
        senderWallet->updateBalance(server1->blockchain()); 
        receiverWallet->updateBalance(server2->blockchain()); 
        
        float senderBal2 = senderWallet->balance();
        float recipBal2 = receiverWallet->balance();
        
        CHECK(senderBal2 < senderBal1); 
        CHECK(recipBal1 < recipBal2); 
        CHECK(recipBal2 == (recipBal1 + txAmount));
    }
}
