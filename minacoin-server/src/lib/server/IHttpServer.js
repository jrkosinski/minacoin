'use strict'; 

/**
 * minacoin: IHttpServer
 * ---------------------
 * interface for the most basic functions of a full server (e.g. HttpServer)
 *
 * author: John R. Kosinski
 */
class IHttpServer {
    /*json*/ getTransactions() { }
    
    /*json*/ getBlocks() { }
    
    /*json*/ getPublic() { }
    
    /*Transaction*/ postTransact(recipient, amount) { }
    
    /*Block*/ postMineTransactions() { }
}

module.exports = { IHttpServer };