
MinaCoin
========

Motivation
----------
To demonstrate how a cryptocurrency (like bitcoin) works at a fairly low level. To keep things moving quickly, I've decided to do a relatively quick & simple rendition of a cryptocurrency in nodejs. I don't think I need to note the specific reasons why this project would be unfeasible for use as an actual currency, but suffice to say that it's for fun and educational purposes only. The inspiration is taken from bitcoin itself, with its proof-of-work and UTXO-based system (along with other features). It's a bit easier to both demo and understand the inner workings, I think, in a nodejs project (rather than in a more complex C++ project), though I would recommend also cloning, perusing, and building the source codes for coins like bitcoin, litecoin, and ethereum. 

*named for my sweet daughter Mina :)*


Guide to Codebase
-----------------
#### minacoin-core
https://github.com/jrkosinski/minacoin/tree/master/modules/minacoin-core
Core blockchain & block classes and logic. Here's where you'll see the inspiration from bitcoin, as well as some big differences.

#### p2p-client
https://github.com/jrkosinski/minacoin/tree/master/modules/p2p-client
Defines the behavior of a minacoin webclient as far as the p2p network. 

#### minacoin-client
https://github.com/jrkosinski/minacoin/tree/master/modules/minacoin-client
A thin layer between the web-client and p2p network functionality (p2p-client); should be removed and the functionality rolled into web-client and p2p-client. 

#### minacoin-common
https://github.com/jrkosinski/minacoin/tree/master/modules/minacoin-common
Common generic utilities. 

#### genesis-server
https://github.com/jrkosinski/minacoin/tree/master/genesis-server
The p2p network relies on one 'special' seed server, and this is it. This server also has the responsibility of generating the genesis block if no blockchain yet exists. 

#### web-client
https://github.com/jrkosinski/minacoin/tree/master/web-client
Example end client app; you can run as many of these as you want, on your local machine, by just changing the port number. 

*see extensive in-code comments for more info*