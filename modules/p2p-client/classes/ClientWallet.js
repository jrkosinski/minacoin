'use strict'; 

const async = require('asyncawait/async');
const await = require('asyncawait/await');

const core = require('minacoin-core'); 
const common = require('minacoin-common'); 
const Wallet = core.Wallet;
const Block = core.Block;
const Chain = core.Chain;
const Node = require('./Node'); 

const exception = common.exceptions('CWAL');

// ======================================================================================================
// ClientWallet 
// 
// John R. Kosinski 
// 26 May 2018
// 
function ClientWallet(host, port, wallet, database) {
    const _this = this;
    const _pendingTransactions = [];

    this.wallet = wallet;
    this.node = new Node(host, port); 
    this.connected = false;
    this.database = database;

    // ---------------------------------------------------------------------------------------------------
    const /*bool*/ syncNewBlock = (block) => {
        return exception.try(() => {
            let output = false; 

            if (block) {
                //do we already have the block? 
                if (!_this.wallet.chain.blockExists(block)) {
                    output = _this.wallet.chain.addBlock(block);
                    _this.save(); 
                }
            }

            return output; 
        });
    }; 

    // ---------------------------------------------------------------------------------------------------
    //
    const replaceChain = (newChain) => {
        return exception.try(() => {
            const chain = core.deserializeChain(newChain); 
            if (chain && chain.isValid()) {

                //if no wallet, instantiate one 
                if (!_this.wallet) {
                    _this.wallet = new Wallet(chain, _this.node.toString()); 
                }

                _this.wallet.chain = chain;
                console.log('new chain size is ' + _this.wallet.chain.size());
                _this.save(); 
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
                        if (syncNewBlock(core.deserializeBlock(data.payload, _this.wallet.chain)))
                            _this.node.broadcastData(data); 

                        break;
                    case 'fullChain': 
                        const newChain = data.payload;
                        
                        //favor the longer chain 
                        if (newChain.blocks.length > (_this.wallet ? _this.wallet.chain.size() : 0)) {
                            if (replaceChain(newChain)) {

                                //re-broadcast it 
                                _this.node.broadcastData(data); 
                            }
                        }

                        break;
                    case 'chainRequest': 
                        //TODO: send only to one who requested it 
                        _this.broadcastFullChain();
                        break;
                }
            }
        });
    }; 


    // ---------------------------------------------------------------------------------------------------
    // gets the public key (address) of the wallet
    // 
    /*string*/ this.getAddress = () => {
        return _this.wallet ? _this.wallet.publicKey : null; 
    }; 

    // ---------------------------------------------------------------------------------------------------
    // gets the wallet's current balance 
    // 
    /*float*/ this.getBalance = () => {        
        return _this.wallet ? _this.wallet.getBalance() : null; 
    }; 

    // ---------------------------------------------------------------------------------------------------
    // gets the chain's current size in number of blocks
    // 
    /*int*/ this.getChainSize = () => {        
        return _this.wallet ? _this.wallet.chain.size() : null; 
    }; 

    // ---------------------------------------------------------------------------------------------------
    // gets an array of block objects
    // 
    /*Block[]*/ this.getBlocks = () => {        
        return _this.wallet ? _this.wallet.chain.blocks : []; 
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
                const chain = _this.wallet.chain;

                if (transaction) {
                    //add it to a new block 
                    const block = new Block(chain, chain.lastBlock().hash); 
                    if (block.addTransaction(transaction)) {
                        block.mineBlock(); 
    
                        //add block to chain 
                        if (chain.addBlock(block)) {
        
                            //and broadcast the new chain to all peers 
                            //_this.broadcastNewBlock(block); 
                            this.broadcastFullChain(); 
        
                            //add to pending transactions 
                            _pendingTransactions.push(transaction); 
                        }
                    }
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
            _this.node.broadcastData({ 
                type: 'newBlock', 
                payload: block.serialize()
            }); 
        });
    }; 

    // ---------------------------------------------------------------------------------------------------
    this.broadcastFullChain = () => {
        exception.try(() => {
            _this.node.broadcastData({
                type:'fullChain', 
                payload:_this.wallet.chain.serialize()
            }); 
        });
    }; 

    // ---------------------------------------------------------------------------------------------------
    this.connectToNetwork = () => {
        exception.try(() => {
            _this.node.on('connected', () => {
                console.log('connected to network'); 
                _this.connected = true;             
            });

            _this.node.on('receivedMessage', onReceivedMessage); 

            _this.node.initialize(); 
            _this.node.connect();             
        });
    }; 

    // ---------------------------------------------------------------------------------------------------
    this.save = async(() => {
        exception.try(() => {
            if (_this.database) {
                await(_this.database.saveWallet(_this.wallet)); 
            }
        });
    });
}

module.exports = ClientWallet;