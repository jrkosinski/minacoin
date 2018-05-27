'use strict'; 

const async = require('asyncawait/async');
const await = require('asyncawait/await');

const minacore = require('minacoin-core'); 
const Wallet = minacore.Wallet;
const Block = minacore.Block;
const Chain = minacore.Chain;
const deserializeChain = minacore.Chain.deseriaalize;
const Node = require('./Node'); 

const exception = require('../util/exceptions')('CWAL');

// ======================================================================================================
// ClientWallet 
// 
// John R. Kosinski 
// 26 May 2018
// 
function ClientWallet(host, port, chain, name, publicKey, privateKey) {
    const _this = this;
    const _pendingTransactions = [];

    this.wallet = new Wallet(chain, name, publicKey, privateKey); 
    this.node = new Node(host, port); 
    this.connected = false;

    // ---------------------------------------------------------------------------------------------------
    const /*bool*/ syncNewBlock = (block) => {
        return exception.try(() => {
            const output = false; 

            if (block) {
                //do we already have the block? 
                if (!_this.wallet.chain.blockExists(block)) {
                    output = _this.wallet.chain.addBlock(block);
                }
            }

            return output; 
        });
    }; 

    // ---------------------------------------------------------------------------------------------------
    //
    const replaceChain = (newChain) => {
        return exception.try(() => {
            const chain = deserializeChain(newChain); 
            if (chain && chain.isValid()) {
                _this.wallet.chain = chain;
                return true;
            }
            return false;
        });
    };

    // ---------------------------------------------------------------------------------------------------
    // 
    const onReceivedMessage = (data) => {
        exception.try(() => {
            if (data) {
                switch(data.type) {
                    case 'newBlock':
                        //if we can add it, re-broadcast it 
                        if (syncNewBlock(data.payload))
                            _this.node.broadcastData(data); 

                        break;
                    case 'fullChain': 
                        const newChain = data.payload;
                        
                        //favor the longer chain 
                        if (newChain.blocks.length > _this.wallet.chain.size()) {
                            if (replaceChain(newChain)) {

                                //re-broadcast it 
                                _this.node.broadcastData(data); 
                            }
                        }

                        break;
                    case 'chainRequest': 
                        break;
                }
            }
        });
    }; 

    // ---------------------------------------------------------------------------------------------------
    // send funds to another wallet 
    // 
    // @recipient: public key of receiving wallet 
    // @amount: amount to send 
    // 
    this.sendFunds = (recipient, amount) => {
        return exception.try(() => {

            if (!_this.connected) 
                console.log('connect to the network first'); 
            else {
                //make a transaction 
                const transaction = _this.wallet.sendFunds(recipient, amount); 
                if (transaction) {
                    //add it to a new block 
                    const block = new Block(chain, chain.lastHash()); 
                    block.addTransaction(transaction); 
                    block.mineBlock(); 

                    //add block to chain 
                    _this.wallet.chain.add(block); 

                    //and broadcast the new chain to all peers 
                    _this.broadcastNewBlock(block); 

                    //add to pending transactions 
                    _pendingTransactions.add(transaction); 
                }    
            }
        });
    }; 

    // ---------------------------------------------------------------------------------------------------
    // 
    this.requestChain = () => {
        return exception.try(() => {
            _this.node.broadcastData({
                type: 'chainRequest'
            });
        });
    }; 

    // ---------------------------------------------------------------------------------------------------
    // broadcast a new batch of transactions (in a block) to the network 
    // 
    this.broadcastNewBlock = (block) => {
        exception.try(() => {
            if (_this.connected) 
                _this.node.broadcastData(block); 
        });
    }; 

    // ---------------------------------------------------------------------------------------------------
    this.connectToNetwork = () => {
        exception.try(() => {
            _this.node.on('connected', () => {
                console.log('connected to network'); 
                _this.connected = true;             
            });

            _this.node.on('receivedMessage', () => onReceivedMessage); 

            _this.node.initialize(); 
            _this.node.connect();             
        });
    }; 
}

module.exports = ClientWallet;