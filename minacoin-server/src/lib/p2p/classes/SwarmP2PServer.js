'use strict';

const LOG_TAG = 'SP2P';

const ioc = require('../../../util/iocContainer');
const { IP2PServer, MessageType } = require('./IP2PServer');
const { Blockchain } = require('../../blockchain');
const { Transaction } = require('../../wallet');
const crypto = require('crypto');
const Swarm = require('discovery-swarm');
const defaults = require('dat-swarm-defaults');
const getPort = require('get-port');
const R = require('ramda'); 

const logger = ioc.loggerFactory.createLogger(LOG_TAG);
const exception = ioc.ehFactory.createHandler(logger);

/**
 * minacoin: SwarmP2PServer
 * -------------------------
 * a p2p server that uses discovery-swarm, performs automatic discovery of peers
 *
 * author: John R. Kosinski
 */
class SwarmP2PServer extends IP2PServer {
    get sockets() { return this._sockets; }
    get peerCount() { return R.keys(this._peers).length; }

    /**
     * constructor 
     * @param {Blockchain} blockchain 
     * @param {TransactionPool} txPool 
     * @param {Wallet} wallet 
     */
    constructor(coreUnit) {
        super();

        this.coreUnit = coreUnit;
        this._sockets = [];
        this._peers = { };
        this._connectionSeq = 0;
        this._id = crypto.randomBytes(32); //.toString('hex');
        
        this.coreUnit.on('blockMined', () => {
            exception.try(() => {
                //sync the chain
                this.syncChain();
        
                //broadcast directive to clear transaction pool
                this.broadcastClearTransactions();
            });
        });
    }
    
    /*json[]*/ peerList() {
        return exception.try(() => {
            const output = [];
            for (let peerId in this._peers) {
                const peer = this._peers[peerId]; 
                output.push({
                    id: peerId,
                    seq: peer.seq, 
                    remoteAddr: peer.conn.remoteAddress + ':' + peer.conn.remotePort
                }); 
            }
            return output; 
        });
    }

    /**
     * begin discovering peers and listening for messages 
     */
    async listen() {
        await exception.tryAsync(async() => {
            const sw = Swarm(defaults({
                // peer-id
                id: this._id,
            }));

            const port = await getPort();

            sw.listen(port);
            logger.info(`P2P listening on port: ${port}`);

            sw.join('minacoin');

            sw.on('connection', (conn, data) => {
                
                //have we hit our peer limit yet? 
                if (this.peerCount >= this.config.PEER_LIMIT) {
                    conn.close();   //forcibly close 
                }
                else {
                    const seq = this._connectionSeq;
    
                    const peerId = data.id.toString('hex');
                    logger.info(`connected #${seq} to peer: ${peerId}`);
    
                    if (data.initiator) {
                        conn.setKeepAlive(true, 600);
                    }
    
                    //data received
                    conn.on('data', (data) => {
                        logger.info(
                            'received Message from peer ' + peerId,
                            '----> ' + data.toString()
                        );
    
                        this.messageHandler(data);
                    });
    
                    // on close 
                    conn.on('close', () => {
                        logger.info(`connection ${seq} closed, peer id: ${peerId}`);
                        if (this._peers[peerId].seq === seq) {
                            delete this._peers[peerId]
                        }
                    });
    
                    //save the connection
                    if (!this._peers[peerId]) {
                        this._peers[peerId] = {};
                    }
                    this._peers[peerId].conn = conn;
                    this._peers[peerId].seq = seq;
                    this._connectionSeq++;
    
                    //send the chain to the caller 
                    this.sendChain(this._peers[peerId]);
                }
                
            });
        });
    }

    broadcastTransaction(transaction){
        exception.try(() => {
            for (let p in this._peers) {
                this.sendTransaction(this._peers[p], transaction);
            }
        });
    }

    sendTransaction(peer, transaction) {
        exception.try(() => {
            peer.conn.write(JSON.stringify({
                type: MessageType.transaction,
                transaction: transaction.toJson()
            }));
        });
    }

    syncChain() {
        exception.try(() => {
            for (let p in this._peers) {
                this.sendChain(this._peers[p]);
            };
        });
    }

    sendChain(peer) {
        exception.try(() => {
            peer.conn.write(JSON.stringify({
                type: MessageType.chain,
                chain: this._coreUnit.getBlocks()
            }));
        });
    }

    broadcastClearTransactions() {
        exception.try(() => {
            for (let p in this._peers) {
                this._peers[p].conn.write(JSON.stringify({
                    type: MessageType.clear_transactions
                }));
            };
        });
    }

    updateWalletBalance() {
        exception.try(() => {
            this._coreUnit.updateWallet();
        });
    }

    /**
     * defines & handles messages received from a peer
     * @param {string} message 
     */
    messageHandler(message) {
        exception.try(() => {
            const data = JSON.parse(message);
            logger.info("data: " + data);

            switch(data.type){
                case MessageType.chain:
                    /**
                     * call replace blockchain if the
                     * received chain is longer it will replace it
                     */
                    const newChain = Blockchain.fromJson(data.chain);
                    this._coreUnit.replaceChain(newChain.chain);
                    this.updateWalletBalance();
                    break;
                case MessageType.transaction:
                    /**
                     * add transaction to the transaction
                     * pool or replace with existing one
                     */
                    this._coreUnit.addTxToPool(Transaction.fromJson(data.transaction));
                    this.updateWalletBalance();
                    break;
                case MessageType.clear_transactions:
                    this._coreUnit.clearTxPool();
                    break;
            }
        });
    }
}

/**
 * responsibly for delegating instance creation (of P2PServer)
 */
class Factory {
    /*IP2PServer*/ createInstance(blockchain, txPool, wallet) {
        return new SwarmP2PServer(blockchain, txPool, wallet);
    }
}

const factory = new Factory();

module.exports = {
    factory,
    P2PServer: SwarmP2PServer
}