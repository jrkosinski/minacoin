'use strict'; 

const async = require('asyncawait/async');
const await = require('asyncawait/await');

const core = require('minacoin-core'); 
const common = require('minacoin-common'); 
const Wallet = core.Wallet;
const Block = core.Block;
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
    const _knownWallets = {}; 

    this.wallet = wallet;
    this.node = new Node(host, port); 
    this.connected = false;
    this.database = database;

    // ---------------------------------------------------------------------------------------------------
    // integrate a new block into the chain
    // 
    // @block: the block to integrate 
    // 
    // returns: true if block successfully added 
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
    // completely replaces existing chain with the given new one; if no wallet exists, one will be created
    // 
    // @newChain: the new chain with which to replace any existing
    // 
    // returns: true if given chain is validated & accepted 
    const /*bool*/ replaceChain = (newChain) => {
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
    // fires when a message is received from another node on the p2p network 
    // 
    // @data: the data received from the node 
    // 
    const onReceivedMessage = (data) => {
        exception.try(() => {
            if (data) {
                if (data.from && data.from.peer) 
                    addKnownWallet(data.from.wallet); 

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
                        //_this.sendFullChain(data.from.peer);
                        _this.broadcastFullChain();
                        break;
                }
            }
        });
    }; 

    // ---------------------------------------------------------------------------------------------------
    // 
    // @data: in the form { name, address }
    const addKnownWallet = (data) => {
        exception.try(() => {
            if (data && data.address && data.name) {
                _knownWallets[data.address] = data.name;
            }
        }); 
    }; 

    // ---------------------------------------------------------------------------------------------------
    // creates a standardized message format for broadcasting or sending 
    // 
    // @type: a string that identifies the type of message to send 
    // @payload: the main data payload 
    // 
    // returns: JSON structure
    const formatMessage = (type, payload) => {
        return {
            type: type, 
            payload: payload,
            from: {
                peer: {
                    host: _this.node.host,
                    port: _this.node.port
                },
                wallet: {
                    name: _this.getWalletName(),
                    address: _this.getAddress()
                }
            }
        }
    }; 


    // ---------------------------------------------------------------------------------------------------
    this.getKnownWallets = () => { return _knownWallets; }; 

    // ---------------------------------------------------------------------------------------------------
    // gets the friendly name of the wallet (if any), or returns the wallet public key if none
    // 
    /*string*/ this.getWalletName = () => {
        let output = null; 
        if (_this.wallet) {
            const name = _this.wallet.name; 
            if (name && name.length) 
                output = name; 
            else 
                output = _this.wallet.publicKey;                
        }
        return output; 
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
    // requests the chain from neighbors on the network; sends out a message to other nodes, requesting 
    // their copy of the current chain
    // 
    this.requestChain = () => {
        return exception.try(() => {
            _this.node.broadcastData(formatMessage('chainRequest')); 
        });
    }; 

    // ---------------------------------------------------------------------------------------------------
    // broadcast a new batch of transactions (in a block) to the network 
    // 
    this.broadcastNewBlock = (block) => {
        exception.try(() => {
            _this.node.broadcastData(formatMessage('newBlock', block.serialize())); 
        });
    }; 

    // ---------------------------------------------------------------------------------------------------
    // broadcasts the entire data of the full chain to other nodes 
    // 
    this.broadcastFullChain = () => {
        exception.try(() => {
            _this.node.broadcastData(formatMessage('fullChain', _this.wallet.chain.serialize())); 
        });
    }; 

    // ---------------------------------------------------------------------------------------------------
    // sends the entire data of the full chain to a specific node
    // 
    // @peer: the peer to whom to send 
    // 
    this.sendFullChain = (peer) => {
        exception.try(() => {
            _this.node.sendMessage(peer, formatMessage('fullChain', _this.wallet.chain.serialize())); 
        });
    }; 

    // ---------------------------------------------------------------------------------------------------
    // attempts to initiate a connection to the network by connecting to a known node 
    // 
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
    // serializes self and saves to local database
    // 
    this.save = async(() => {
        exception.try(() => {
            if (_this.database) {
                await(_this.database.saveWallet(_this.wallet)); 
            }
        });
    });
}

module.exports = ClientWallet;