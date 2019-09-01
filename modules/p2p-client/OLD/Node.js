'use strict'; 

const p2p = require('p2p');
const events = require('events'); 

const common = require('minacoin-common'); 
const exception = common.exceptions('NODE');

const TRUSTED_PEER = {
    host: 'localhost',
    port: 5000
};

const MAX_PEERS = 100;

// 
// Node 
// 
// generic p2p node class
//
// Events
//  - receivedMessage
//  - receivedConnection 
//  - connected
// 
// John R. Kosinski 
// 25 May 2018
// 
class Node {
    constructor(host, port) {
        this._peers = [];
        this._peer = null;
        this._event = new events.EventEmitter();
        
        this.host = host;
        this.port = port;
    }

    /**
     * initialize the instance; open the server & listen 
     */
    initialize() {
        exception.try(() => {
            this._peer = p2p.peer({
                host: this.host,
                port: this.port
            });

            //just saying hello
            this._peer.handle.hello = (payload, done) => {            
                receiveHello(this, payload, done);
            };

            //notify of another peer
            this._peer.handle.notifyPeer = (payload, done) => {
                receiveNotify(this, payload, done); 
            };

            this._peer.handle.message = (payload, done) => {
                receiveMessage(this, payload, done); 
            };
        });
    }

    /**
     * connect to known seed peer 
     */
    async connect () {
        await exception.tryAsync(async () => {  
            if (!peersEqual(TRUSTED_PEER, this)) {
                if (await sayHello(this, TRUSTED_PEER))
                    console.log('connected to ' + peerToString(TRUSTED_PEER)); 
                    this._event.emit('connected', TRUSTED_PEER); 
            }
        });
    }

    /**
     * broadcast the given message to all peers
     * @param {json} data message in json object form to broadcast to all known peers 
     */
    broadcastData (data) {
        exception.try(() => {
            console.log('broadcasting');
            if (!data) 
                data = {}; 
            data.host = this.host;
            data.port = this.port;

            for (let n=0; n<this._peers.length; n++) {
                this._peer.remote(this._peers[n]).run('handle/message', data, (err, result) => {
                    //..
                }); 
            }
        });
    }

    /**
     * sends a direct message to a specific peer 
     * @param {peer} peer the peer to which to send 
     * @param {json} message the message to send (JSON)
     */
    sendMessage(peer, message) {
        exception.try(() => {
            console.log('sending message to ' + peerToString(peer));
            this._peer.remote(peer).run('handle/message', message, (err, result) => {
                //..
            }); 
        });
    }

    /**
     * returns string representation 
     * @returns {string}
     */
    toString() {
        return peerToString(this);
    }

    /**
     * adds an event listener
     * @param {string} eventName 
     * @param {function} handler 
     */
    on(eventName, handler) {
        this._event.on(eventName, handler); 
    }; 

    /**
     * adds a one-time-only event listener
     * @param {string} eventName 
     * @param {function} handler 
     */
    once(eventName, handler) {
        this._event.once(eventName, handler); 
    }; 

    /**
     * removes an event listener
     * @param {string} eventName 
     * @param {function} handler 
     */
    off(eventName, handler) {
        this._event.removeListener(eventName, handler); 
    };
} 


/**
 * adds a new known recognized peer to the list 
 * @param {Node} node 
 * @param {peer} peer the new peer
 * @returns {bool}
 */
function /*bool*/ addPeer(node, peer) {
    return exception.try(() => {
        if (node._peers.length > MAX_PEERS) 
            return true;

        for (let n=0; n<node._peers.length; n++) {
            if (node._peers[n].host === peer.host && node._peers[n].port === peer.port) 
                return false;
        }

        node._peers.push(peer); 
        node._event.emit('receivedConnection', peer);
        console.log(`peer ${peerToString(peer)} added`); 
        logPeers(node);
        return true; 
    });
}

/**
 * converts a peer spec to a string representation 
 * @param {peer} peer the peer to stringify 
 * @returns {string}
 */
function /*string*/ peerToString(peer) {
    return `${peer.host}:${peer.port}`;
}

/**
 * logs list of known peers (of a node)
 * @param {Node} node 
 */
function logPeers(node) {
    exception.try(() => {
        for (let n=0; n<node._peers.length; n++) {
            console.log(peerToString(node._peers[n])); 
        }
    });
}

/**
 * 
 * @param {Node} node broadcast knowledge of a new peer to all other peers
 * @param {peer} peer the new peer to broadcast to others 
 */
function broadcastPeer(node, peer) {
    exception.try(() => {
        for (let n=0; n<node._peers.length; n++) {
            if (!peersEqual(peer, node._peers[n]))
                sendPeerToPeer(node, node._peers[n], peer); 
        }
    });
}
    
/**
 * transmits knowledge of a peer to one other peer 
 * @param {Node} node 
 * @param {peer} recipient the peer to which to send 
 * @param {peer} peer the peer whose knowledge to send
 */
function sendPeerToPeer(node, recipient, peer) {
    exception.try(() => {
        console.log(`sending peer ${peerToString(peer)} to ${peerToString(recipient)}`);
        node._peer.remote(recipient).run('handle/notifyPeer', peer, (err, result) => {
            // ...
        });
    });
}

/**
 * say hello to introduce yourself to a new peer
 * @param {Node} node 
 * @param {peer} peer peer to greet
 * @returns {Promise(peer)}
 */
function /*Promise(peer)*/ sayHello(node, peer) {
    return new Promise((resolve, reject) => {
        exception.try(() => {
            console.log(`sending hello to ${peerToString(peer)}`); 

            node._peer.remote(peer).run('handle/hello', {host:node.host, port:node.port}, (err, result) => {
                addPeer(node, peer); 
                resolve(peer); 
            }); 
        });
    });
}

/**
 * returns true if given peers are equal 
 * @param {peer} p1 
 * @param {peer} p2 
 * @returns {bool}
 */
function /*bool*/ peersEqual(p1, p2) {
    return (p1.host === p2.host && p1.port === p2.port); 
} 

/**
 * receive and handle a hello from a remote peer
 * @param {Node} node 
 * @param {peer} peer the sender
 * @param {fn} callback to call when finished processing request 
 */
function receiveHello(node, peer, callback) {
    exception.try(() => {
        console.log(`got hello from ${peerToString(peer)}`); 

        addPeer(node, peer); 
        broadcastPeer(node, peer);            
            
        callback(null, {host:node.host, port:node.port});    
    });
}

/**
 * receive and handle a peer notification from a remote peer
 * @param {Node} node 
 * @param {peer} peer a potentially new peer that I should greet if I haven't already 
 * @param {fn} callback to call when finished processing request 
 */
async function receiveNotify(node, peer, callback) {
    await exception.tryAsync(async () => {
        console.log(`got notify of ${peerToString(peer)}`); 

        if (addPeer(node, peer)) {
            if (await sayHello(node, peer))
                broadcastPeer(node, peer); 
        }

        callback(null, {host:node.host, port:node.port});        
    });
}

/**
 * receive and handle some message from a remote peer
 * @param {Node} node 
 * @param {string} data data received from remote source 
 * @param {fn} callback to call when finished processing request 
 */
function receiveMessage(node, data, callback) {
    exception.try(() => {
        console.log(`got message: ${JSON.stringify(data)}`); 
        node._event.emit('receivedMessage', data); 
        callback(null); 
    });
}; 


module.exports = Node;

/*
    GREETING 
    - connect to known peer (KP)
    - KP responds with a list of n random peers to connect to 
    - node says hello to new peers 
    - peers send back lists of their peers
    - node says hello to sent peers until its list is full 

    MAINTAINING
    - as nodes drop off, request new ones from KP

    ADDING A NEW BLOCK
    - add new block 
    - notify peers of new block (send chain length + final block hash)

    RECEIVE CHAIN UPDATE 
    - receive chain size 
        - is it longer than my chain? 
        - no: ignore 
        - yes: request list of block hashes 
            - how many match? 
            - for each non-match, request that block 
    
    RECEIVE ASYNC BLOCK UPDATE 
    - do I have a slot for it? 
        - yes: update the slot 
        - no: do nothing 

    NETWORK MESSAGES (send)
    - hello 
    - connect to KP
    - request peers 
    - notify peers of new block
    - request chain (hashes)
    - request block 
    - send chain 
    - send block

    NETWORK MESSAGES (receive) 
    - hello 
    - request peers
    - handle chain update 
    - handle chain request
    - handle block request 
    - 


    1. i connect to the known 
        known peer adds me 
    2. the known peer sends me out to all his buds (none atm) 
    3. another guy connects to the known peer
        known peer adds him 
    4. known peer sends him out to all his buds (me) 
    5. i get a notification of the new guy 
    6. i add newguy to my list of peers
        i notify all my peers about newguy
        known peer gets notification - does nothing cause newguy is already his peer 

    - A connects to KP
        - KP adds A (KP:[A])
        - A adds KP (A:[KP])
    - KP notifies all peers of A (noone to notify atm) 
    - B connects to KP
        - KP adds B (KP:[A,B])
        - B adds KP (B: [KP])
    - KP notifies [A] of B 
    - A receives knowledge of B 
        - A adds B (A:[KP, B])
        - A sends hello to B 
        - B receives hello from A 
        - B adds A (B:[KP,A])

    (KP:[A,B])
    (A:[KP, B])
    (B:[KP,A])

    - C connects to KP
        - KP adds C (KP:[A,B,C])
        - C adds KP (C:[KP])
    - KP notifies all peers (A, B) of C 
    - A receives knowledge of C 
        - A adds C (A:[KP,B,C])
        - A sends hello to C
        - C receives hello from A 
        - C adds A (C:[KP,A])
    - B receives knowledge of C 
        - B adds C (B:[KP,A,C])
        - B sends hello to C
        - C receives hello from B
        - C adds B (C:[KP,A,B])

    (KP:[A,B,C])
    (A:[KP,B,C])
    (B:[KP,A,C])
    (C:[KP,A,B])
*/