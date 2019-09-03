'use strict';

const LOG_TAG = 'P2P';

const WebSocket = require('ws');
const config = require('../../config');
const ioc = require('../../util/iocContainer');

const logger = ioc.loggerFactory.createLogger(LOG_TAG);
const exception = ioc.ehFactory.createHandler(logger);

const P2P_PORT = config.P2P_PORT;
//PEERS=ws://localhost:5002 P2P_PORT=5001 HTTP_PORT=3001 npm run dev
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

//message type enum
const MESSAGE_TYPE = {
    chain: 'CHAIN',
    transaction: 'TRANSACTION',
    clear_transactions: 'CLEAR_TRANSACTIONS'
};

class P2PServer {
    get blockchain() { return this._blockchain; }
    get sockets() { return this._sockets; }
    get transactionPool() { return this._transactionPool; }
    get wallet() { return this._wallet; }

    constructor(blockchain, txPool, wallet) {
        this._blockchain = blockchain;
        this._sockets = [];
        this._transactionPool = txPool;
        this._wallet = wallet;
    }

    listen() {
        exception.try(() => {
            const server = new WebSocket.Server({ port: P2P_PORT });
            server.on('connection',socket => this.connectSocket(socket));
            this.connectToPeers();
            logger.info(`Listening for peer to peer connection on port : ${P2P_PORT}`);
        });
    }

    connectSocket(socket) {
        exception.try(() => {
            // push the socket too the socket array
            this.sockets.push(socket);
            logger.info("Socket connected");
            this.messageHandler(socket);
            this.sendChain(socket);
        });
    }

    connectToPeers() {
        peers.forEach((peer) => {
            const socket = new WebSocket(peer);
            socket.on('open', () => this.connectSocket(socket));
        });
    }

    broadcastTransaction(transaction){
        this.sockets.forEach(socket =>{
            this.sendTransaction(socket,transaction);
        });
    }

    sendTransaction(socket, transaction) {
        exception.try(() => {
            socket.send(JSON.stringify({
                type: MESSAGE_TYPE.transaction,
                transaction: transaction
            }));
        });
    }

    syncChain() {
        exception.try(() => {
            this.sockets.forEach(s => {
                this.sendChain(s);
            });
        });
    }

    sendChain(socket) {
        exception.try(() => {
            socket.send(JSON.stringify({
                type: MESSAGE_TYPE.chain,
                chain: this.blockchain.chain
            }));
        });
    }

    broadcastClearTransactions() {
        exception.try(() => {
            this.sockets.forEach(s => {
                s.send(JSON.stringify({
                    type: MESSAGE_TYPE.clear_transactions
                }));
            });
        });
    }

    messageHandler(socket) {
        //on recieving a message execute a callback function
        socket.on('message', message =>{
            exception.try(() => {
                const data = JSON.parse(message);
                logger.info("data ", data);

                switch(data.type){
                    case MESSAGE_TYPE.chain:
                        /**
                         * call replace blockchain if the
                         * recieved chain is longer it will replace it
                         */
                        this.blockchain.replaceChain(data.chain);
                        this.updateWalletBalance();
                        break;
                    case MESSAGE_TYPE.transaction:
                        /**
                         * add transaction to the transaction
                         * pool or replace with existing one
                         */
                        this.transactionPool.updateOrAddTransaction(data.transaction);
                        this.updateWalletBalance();
                        break;
                    case MESSAGE_TYPE.clear_transactions:
                        this.transactionPool.clear();
                        break;
                }
            });
        });
    }

    updateWalletBalance() {
        exception.try(() => {
            if (this.wallet && this.blockchain) {
                this.wallet.updateBalance(this.blockchain);
            }
        });
    }
}

module.exports = P2PServer;