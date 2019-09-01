'use strict'; 

const core = require('minacoin-core'); 
const common = require('minacoin-common'); 

const Wallet = core.Wallet;
const Block = core.Block;

const Node = require('./Node'); 
const exception = common.exceptions('CWAL');

// 
// ClientWallet 
// 
// John R. Kosinski 
// 26 May 2018
// 
class ClientWallet {
    constructor(host, port, wallet, database) {
        this._pendingTransactions = [];
        this._knownWallets = {}; 
    
        this.wallet = wallet;
        this.node = new Node(host, port); 
        this.connected = false;
        this.database = database;
    }    

    /**
     * gets list of known wallets 
     * @returns {Wallet{}}
     */
    /*Wallet{}*/ get knownWallets() { return this._knownWallets; }; 

    /**
     * gets the friendly name of the wallet (if any), or returns the wallet public key if none
     * @returns {string}
     */
    /*string*/ get walletName() {
        let output = null; 
        if (this.wallet) {
            const name = this.wallet.name; 
            if (name && name.length) 
                output = name; 
            else 
                output = this.wallet.publicKey;                
        }
        return output; 
    }

    /**
     * gets the public key (address) of the wallet
     * @returns {string}
     */
    /*string*/ get address() {
        return this.wallet ? this.wallet.publicKey : null; 
    }

    /**
     * gets the wallet's current balance
     * @returns {float}
     */
    /*float*/ get balance() {        
        return this.wallet ? this.wallet.getBalance() : null; 
    }

    /**
     * gets the chain's current size in number of blocks
     * @returns {int}
     */
    /*int*/ get chainSize() {        
        return this.wallet ? this.wallet.chain.size() : null; 
    }

    /**
     * gets an array of block objects
     * @returns {Block[]}
     */
    /*Block[]*/ get blocks() {     
        return this.wallet ? this.wallet.chain.blocks : []; 
    }

    /**
     * send funds to another wallet 
     * @param {string} recipient public key of receiving wallet
     * @param {float} amount amount to send 
     */
    sendFunds(recipient, amount) {
        return exception.try(() => {

            if (!this.connected) 
                console.log('connect to the network first'); 
            else {
                //make a transaction 
                const transaction = this.wallet.sendFunds(recipient, amount); 
                const chain = this.wallet.chain;

                if (transaction) {
                    //add it to a new block 
                    const block = new Block(chain, chain.lastBlock().hash); 
                    if (block.addTransaction(transaction)) {
                        block.mineBlock(); 
    
                        //add block to chain 
                        if (chain.addBlock(block)) {
        
                            //and broadcast the new chain to all peers 
                            //this.broadcastNewBlock(block); 
                            this.broadcastFullChain(); 
        
                            //add to pending transactions 
                            this._pendingTransactions.push(transaction); 
                        }
                    }
                }    
            }
        });
    }

    /**
     * requests the chain from neighbors on the network; sends out a message to other nodes,  
     * requesting their copy of the current chain
     */
    requestChain() {
        return exception.try(() => {
            this.node.broadcastData(formatMessage(this, 'chainRequest')); 
        });
    }

    /**
     * broadcast a new batch of transactions (in a block) to the network 
     * @param {Block} block the block to broadcast
     */
    broadcastNewBlock(block) {
        exception.try(() => {
            this.node.broadcastData(formatMessage(this, 'newBlock', block.serialize())); 
        });
    }

    /**
     * broadcasts the entire data of the full chain to other nodes 
     */
    broadcastFullChain() {
        exception.try(() => {
            this.node.broadcastData(formatMessage(this, 'fullChain', this.wallet.chain.serialize())); 
        });
    }

    /**
     * sends the entire data of the full chain to a specific node
     * @param {peer} peer node to which to send 
     */
    sendFullChain(peer) {
        exception.try(() => {
            this.node.sendMessage(peer, formatMessage(this, 'fullChain', this.wallet.chain.serialize())); 
        });
    }

    /**
     * attempts to initiate a connection to the network by connecting to a known node 
     */
    connectToNetwork() {
        exception.try(() => {
            this.node.on('connected', () => {
                console.log('connected to network'); 
                this.connected = true;             
            });

            this.node.on('receivedMessage', (data) => { onReceivedMessage(this, data);}); 

            this.node.initialize(); 
            this.node.connect();             
        });
    }

    /**
     * serializes self and saves to local database
     */
    async save() {
        await exception.tryAsync(async () => {
            if (this.database) {
                await this.database.saveWallet(this.wallet); 
            }
       });
    }
}


/**
 * integrate a new block into the chain
 * @param {ClientWallet} cw 
 * @param {Block} block the block to integrate 
 * @returns {bool} true if block successfully added 
 */
function /*bool*/ syncNewBlock(cw, block) {
    return exception.try(() => {
        let output = false; 

        if (block) {
            //do we already have the block? 
            if (!cw.wallet.chain.blockExists(block)) {
                output = cw.wallet.chain.addBlock(block);
                cw.save(); 
            }
        }

        return output; 
    });
}

/**
 * completely replaces existing chain with the given new one; if no wallet exists, one will be created
 * @param {ClientWallet} cw 
 * @param {Chain} newChain the new chain with which to replace any existing
 * @returns {bool}
 */
function /*bool*/ replaceChain(cw, newChain) {
    return exception.try(() => {
        const chain = core.deserializeChain(newChain); 

        if (chain && chain.isValid()) {

            //if no wallet, instantiate one 
            if (!cw.wallet) {
                cw.wallet = new Wallet(chain, cw.node.toString()); 
            }

            cw.wallet.chain = chain;
            console.log('new chain size is ' + cw.wallet.chain.size());
            cw.save(); 
            return true;
        }
        return false;
    });
}

/**
 * fires when a message is received from another node on the p2p network 
 * @param {ClientWallet} cw 
 * @param {json} data the data received
 */
function onReceivedMessage(cw, data) {
    exception.try(() => {
        if (data) {
            if (data.from && data.from.peer) 
                addKnownWallet(cw, data.from.wallet); 

            switch(data.type) {
                case 'newBlock':
                    //if we can add it, re-broadcast it 
                    if (syncNewBlock(cw, core.deserializeBlock(data.payload, cw.wallet.chain)))
                        cw.node.broadcastData(data); 

                    break;

                case 'fullChain': 
                    const newChain = data.payload;
                        
                    //favor the longer chain 
                    if (newChain.blocks.length > (cw.wallet ? cw.wallet.chain.size() : 0)) {
                        if (replaceChain(cw, newChain)) {

                            //re-broadcast it 
                            cw.node.broadcastData(data); 
                        }
                    }

                    break;

                case 'chainRequest': 
                    //TODO: send only to one who requested it 
                    //cw.sendFullChain(data.from.peer);
                    cw.broadcastFullChain();
                    break;
            }
        }
    });
}

/**
 * adds an item to known wallets
 * @param {ClientWallet} cw 
 * @param {json} data in the form { name, address }
 */
function addKnownWallet(cw, data) {
    exception.try(() => {
        if (data && data.address && data.name) {
            cw._knownWallets[data.address] = data.name;
        }
    }); 
}

/**
 * creates a standardized message format for broadcasting or sending 
 * @param {ClientWallet} cw 
 * @param {string} type identifies the type of message to send 
 * @param {json} payload the main data payload 
 * @returns {json}
 */
function formatMessage(cw, type, payload) {
    return {
        type: type, 
        payload: payload,
        from: {
            peer: {
                host: cw.node.host,
                port: cw.node.port
            },
            wallet: {
                name: cw.walletName,
                address: cw.address
            }
        }
    }
}; 


module.exports = ClientWallet;