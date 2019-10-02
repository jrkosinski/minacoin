'use strict'; 

const { exec } = require('child_process');
const { spawn } = require('child_process');
const { IHttpServer } = require('../../src/lib/server/IHttpServer'); 
const { HttpTestServer } = require('./HttpTestServer'); 

class TestProcess extends IHttpServer {
    constructor(portNumber) {
        super();
        this.port = portNumber;
        this.proc = null;
        this.testServer = null;
    }
    
    start() {
        //this.proc = exec(`node src/index.js ${this.port}`);
        this.proc = spawn('node', ['src/index.js', this.port]);
        this.testServer = new HttpTestServer(`http://localhost:${this.port}`); 
    }
    
    kill() {
        if (this.proc) {
            this.proc.kill();
            this.proc = null;
        }
    }
    
    async /*json*/ getTransactions() {
        return await this.testServer.getTransactions();
    }
    
    async /*json*/ getBlocks() {
        return await this.testServer.getBlocks();
    }
    
    async /*json*/ getPublic() {
        return await this.testServer.getPublic();
    }
    
    async /*Transaction*/ postTransact(recipient, amount) {
        return await this.testServer.postTransact(recipient, amount);
    }
    
    async /*Block*/ postMineTransactions() {
        return await this.testServer.postMineTransactions();
    }
    
    async /*string*/ getWalletAddress() {
        return await this.testServer.getWalletAddress();
    }
    
    async /*float*/ getBalance() {
        return await this.testServer.getBalance();
    }
    
    async /*float*/ getTxPoolCount() {
        return await this.testServer.getTxPoolCount();
    }
}


module.exports = { TestProcess }