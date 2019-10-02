'use strict';

const LOG_TAG = 'TP2P';

const WebSocket = require('ws');
const ioc = require('../../../util/iocContainer');
const { IP2PServer, MessageType } = require('./IP2PServer');

const logger = ioc.loggerFactory.createLogger(LOG_TAG);
const exception = ioc.ehFactory.createHandler(logger);

const P2P_PORT = config.P2P_PORT;
//PEERS=ws://localhost:5002 P2P_PORT=5001 HTTP_PORT=3001 npm run dev
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];


/**
 * minacoin: TestP2PServer
 * -----------------------
 * a mock p2p server to be used for testing
 *
 * author: John R. Kosinski
 */
class TestP2PServer extends IP2PServer {
    get sockets() { return this._sockets; }

    /**
     * constructor 
     * @param {Blockchain} blockchain 
     * @param {TransactionPool} txPool 
     * @param {Wallet} wallet 
     */
    constructor(coreUnit) {
        super();

        this._coreUnit = coreUnit;
        this._sockets = [];
    }

    /**
     * begin discovering peers and listening for messages 
     */
    listen() {
        exception.try(() => {
            const server = new WebSocket.Server({ port: P2P_PORT });
            server.on('connection',socket => this._connectSocket(socket));
            this._connectToPeers();
            logger.info(`Listening for peer to peer connection on port : ${P2P_PORT}`);
        });
    }

    broadcastTransaction(transaction){
        exception.try(() => {
            this.sockets.forEach(socket =>{
                this._sendTransaction(socket,transaction);
            });
        });
    }

    syncChain() {
        exception.try(() => {
            this.sockets.forEach(s => {
                this._sendChain(s);
            });
        });
    }
    
    pullChain() {
        exception.try(() => {
            this.sockets.forEach(s => {
                this._requestChain(s);
            });
        });
    }

    broadcastClearTransactions() {
        exception.try(() => {
            this.sockets.forEach(s => {
                s.send(JSON.stringify({
                    type: MessageType.clear_transactions
                }));
            });
        });
    }

    _connectSocket(socket) {
        exception.try(() => {
            // push the socket too the socket array
            this.sockets.push(socket);
            logger.info("Socket connected");
            this._messageHandler(socket);
            this._sendChain(socket);
        });
    }

    _connectToPeers() {
        exception.try(() => {
            peers.forEach((peer) => {
                const socket = new WebSocket(peer);
                socket.on('open', () => this._connectSocket(socket));
            });
        });
    }

    _sendTransaction(socket, transaction) {
        exception.try(() => {
            socket.send(JSON.stringify({
                type: MessageType.transaction,
                transaction: transaction
            }));
        });
    }

    _sendChain(socket) {
        exception.try(() => {
            socket.send(JSON.stringify({
                type: MessageType.chain,
                chain: this._coreUnit.getBlocks()
            }));
        });
    }

    _messageHandler(socket) {
        //on recieving a message execute a callback function
        socket.on('message', message =>{
            exception.try(() => {
                const data = JSON.parse(message);
                logger.info("data: " + data);

                switch(data.type){
                    case MessageType.chain:
                        /**
                         * call replace blockchain if the
                         * received chain is longer it will replace it
                         */
                        this._coreUnit.replaceChain(data.chain);
                        this._updateWalletBalance();
                        break;
                    case MessageType.transaction:
                        /**
                         * add transaction to the transaction
                         * pool or replace with existing one
                         */
                        this._coreUnit.addTxToPool(data.transaction);
                        this._updateWalletBalance();
                        break;
                    case MessageType.clear_transactions:
                        this._coreUnit.clearTxPool();
                        break;
                    case MessageType.chain_request: 
                        this._sendChain(socket); 
                        break;
                }
            });
        });
    }

    _updateWalletBalance() {
        exception.try(() => {
            this._coreUnit.updateWallet();
        });
    }
    
    _requestChain(socket) {
        exception.try(() => {
            socket.send(JSON.stringify({
                type: MessageType.chain_request
            }));
        });
    }
}

class Factory {
    /*IP2PServer*/ createInstance(blockchain, txPool, wallet) {
        return new TestP2PServer(blockchain, txPool, wallet);
    }
}

const factory = new Factory();

module.exports = {
    factory,
    P2PServer: TestP2PServer
}