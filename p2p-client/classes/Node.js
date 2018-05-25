'use strict'; 

const p2p = require('p2p');
const events = require('events'); 
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const exception = require('../util/exceptions')('NODE');

// ======================================================================================================
// Node 
// 
// generic p2p node class
//
// Events
//  - receivedMessage
//  - receivedConnection 
//  - started
// 
// John R. Kosinski 
// 25 May 2018
// 
function Node(host, port) {
    const _this = this; 
    const _peers = [];
    const _event = new events.EventEmitter();
    let _peer = null;

    const KNOWN_PEER = {
        host: 'localhost',
        port: 5000
    };

    this.host = host;
    this.port = port;

    // ---------------------------------------------------------------------------------------------------
    // adds a new known recognized peer to the list 
    // 
    // @peer: the new peer 
    const /*bool*/ addPeer = (peer) => {
        return exception.try(() => {
            for (let n=0; n<_peers.length; n++) {
                if (_peers[n].host === peer.host && _peers[n].port === peer.port) 
                    return false;
            }

            _peers.push(peer); 
            _event.emit('receivedConnection', peer);
            console.log(`peer ${peerToString(peer)} added`); 
            logPeers();
            return true; 
        });
    }; 

    const /*string*/ peerToString = (peer) => {
        return `${peer.host}:${peer.port}`;
    };

    // ---------------------------------------------------------------------------------------------------
    // logs list of known peers
    // 
    const logPeers = () => {
        exception.try(() => {
            for (let n=0; n<_peers.length; n++) {
                console.log(peerToString(_peers[n])); 
            }
        });
    };

    // ---------------------------------------------------------------------------------------------------
    // broadcast knowledge of a new peer to all other peers
    // 
    // @peer: the new peer to broadcast to others 
    // 
    const broadcastPeer = (peer) => {
        exception.try(() => {
            for (let n=0; n<_peers.length; n++) {
                if (!peersEqual(peer, _peers[n]))
                    sendPeerToPeer(_peers[n], peer); 
            }
        });
    };
    
    // ---------------------------------------------------------------------------------------------------
    // send knowledge of a peer to one other peer 
    // 
    // @recipient: the peer to which to send 
    // @peer: the peer whose knowledge to send
    // 
    const sendPeerToPeer = (recipient, peer) => {
        exception.try(() => {
            console.log(`sending peer ${peerToString(peer)} to ${peerToString(recipient)}`);
            _peer.remote(recipient).run('handle/notifyPeer', peer, (err, result) => {
                // ...
            });
        });
    }; 

    // ---------------------------------------------------------------------------------------------------
    // say hello to introduce yourself to a new peer
    // 
    // @peer: peer to greet
    //
    // returns: Promise (peer structure)
    const /*peer*/ sayHello = (peer) => {
        return new Promise((resolve, reject) => {
            exception.try(() => {
                console.log(`sending hello to ${peerToString(peer)}`); 

                _peer.remote(peer).run('handle/hello', {host:_this.host, port:_this.port}, (err, result) => {
                    addPeer(peer); 
                    resolve(peer); 
                }); 
            });
        });
    }; 

    // ---------------------------------------------------------------------------------------------------
    // returns true if both given peers are equal 
    // 
    // @p1: peer structure
    // @p2: peer structure
    // 
    const /*bool*/ peersEqual = (p1, p2) => {
        return (p1.host === p2.host && p1.port === p2.port); 
    }; 

    // ---------------------------------------------------------------------------------------------------
    // receive and handle a hello from a remote peer
    // 
    // @peer: the sender 
    // @callback: to call when finished processing request 
    // 
    const receiveHello = (peer, callback) => {
        exception.try(() => {
            console.log(`got hello from ${peerToString(peer)}`); 

            if (addPeer(peer)) {
                broadcastPeer(peer);
                callback({host:_this.host, port:_this.port});    
            }
        });
    };

    // ---------------------------------------------------------------------------------------------------
    // receive and handle a peer notification from a remote peer
    // 
    // @peer: a potentially new peer that I should greet if I haven't already 
    // @callback: to call when finished processing request 
    //
    const receiveNotify = async((peer, callback) => {
        exception.try(() => {
            console.log(`got notify of ${peerToString(peer)}`); 

            if (addPeer(peer)){
                if (await(sayHello(peer))) 
                    broadcastPeer(peer); 

                callback({host:_this.host, port:_this.port});        
            }
        });
    });  

    // ---------------------------------------------------------------------------------------------------
    // receive and handle some message from a remote peer
    // 
    // @data: data received from remote source 
    // @callback: to call when finished processing request 
    //
    const receiveMessage = (data, callback) => {
        exception.try(() => {
            console.log(`got message: ${JSON.stringify(data)}`); 
            _event.emit('receivedMessage', data); 
        });
    }; 

    // ---------------------------------------------------------------------------------------------------
    // initialize the instance; open the server & listen 
    // 
    this.initialize = () => {
        exception.try(() => {
            _peer = p2p.peer({
                host: _this.host,
                port: _this.port
            });

            //just saying hello
            _peer.handle.hello = (payload, done) => {            
                receiveHello(payload, done);
            };

            //notify of another peer
            _peer.handle.notifyPeer = (payload, done) => {
                receiveNotify(payload, done); 
            };

            _peer.handle.message = (payload, done) => {
                receiveMessage(payload, done); 
            };
        });
    }; 

    // ---------------------------------------------------------------------------------------------------
    // connect to known seed peer 
    // 
    this.connect = async(() => {
        exception.try(() => {
            if (await(sayHello(KNOWN_PEER)))
                console.log('connected to ' + peerToString(KNOWN_PEER)); 
                _event.emit('connected', KNOWN_PEER); 
        });
    }); 

    // ---------------------------------------------------------------------------------------------------
    // broadcast the given message to all peers
    // 
    // @data: message in json object form to broadcast to all known peers 
    // 
    this.broadcastMessage = (data) => {
        exception.try(() => {
            console.log('broadcasting');

            for (let n=0; n<_peers.length; n++) {
                _peer.remote(_peers[n]).run('handle/message', {host:_this.host, port:_this.port}, (err, result) => {
                    //..
                }); 
            }
        });
    }; 

    // ----------------------------------------------------------------------------------------------- 
    // adds an event listener
    // 
    this.on = (eventName, handler) => {
        _event.on(eventName, handler); 
    }; 

    // ----------------------------------------------------------------------------------------------- 
    // adds a one-time-only event listener
    // 
    this.once = (eventName, handler) => {
        _event.once(eventName, handler); 
    }; 

    // ----------------------------------------------------------------------------------------------- 
    // removes an event listener
    // 
    this.off = (eventName, handler) => {
        _event.removeListener(eventName, handler); 
    };
} 

module.exports = Node;
/*
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