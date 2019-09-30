'use strict'; 

const { IHttpServer } = require('../../src/lib/server/IHttpServer'); 
const request = require('request-promise'); 

class HttpTestServer extends IHttpServer {
    constructor(baseUrl) {
        super();
        this.baseUrl = baseUrl;
    }
    
    async /*json*/ getTransactions() {
        const response = await request({
            method: 'GET',
            uri: this.baseUrl + '/transactions'
        }); 
        return JSON.parse(response); 
    }
    
    async /*json*/ getBlocks() {
        const response = await request({
            method: 'GET',
            uri: this.baseUrl + '/blocks'
        }); 
        return JSON.parse(response); 
    }
    
    async /*json*/ getPublic() {
        const response = await request({
            method: 'GET',
            uri: this.baseUrl + '/public'
        }); 
        return JSON.parse(response); 
    }
    
    async /*Transaction*/ postTransact(recipient, amount) {
        return await request({
            method: 'POST',
            uri: this.baseUrl + '/transact', 
            body: { recipient, amount }, 
            json: true
        }); 
    }
    
    async /*Block*/ postMineTransactions() {
        return await request({
            method: 'POST',
            uri: this.baseUrl + '/mine-transactions', 
            body: {}, 
            json: true
        }); 
    }
    
    async /*string*/ getWalletAddress() {
        const info = await this.getPublic(); 
        return info ? info.address : ""; 
    }
    
    async /*float*/ getBalance() {
        const info = await this.getPublic(); 
        return info ? info.balance : ""; 
    }
}


module.exports = { HttpTestServer };