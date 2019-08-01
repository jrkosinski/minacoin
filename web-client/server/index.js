'use strict';

// 
// John R. Kosinski
// 28 May 2018
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const config = require('../config');
const common = require("minacoin-common"); 
const exception = common.exceptions('SRV');

//const auth = require('./util/auth'); 
const wallet = require('./util/wallet'); 

function applyCorsHeaders(response) {
    response.setHeader('Access-Control-Allow-Origin', config.allowedOrigins);
    response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'X-Custom-Header');
    response.setHeader("Access-Control-Allow-Headers", "authtoken, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
}

async function executeCall(req, res, authorize, call) {
    await exception.tryAsync(async () => {
        applyCorsHeaders(res);
        var doCall = true; 

        if (authorize){
            //const authResponse = await(auth.getAuth(req.query, req.body, req.headers.authtoken));
            const authResponse = { authorized:true}; 
            if (!authResponse.authorized) {
                res.send(authResponse);
                doCall = false;
            }
        }

        if (doCall) {
            const result = await call();
            res.send(result);
        }
    });
}

function addOptionsCall(app, path){ 
    app.options(path, (req, res) => {
        exception.try(() => {
            console.log('OPTIONS ' + path);

            applyCorsHeaders(res);
            res.send('{}');
        });
    });
}

async function run() {
    app.use(bodyParser.json());

    addOptionsCall(app, '/');
    addOptionsCall(app, '/auth');
    addOptionsCall(app, '/wallet');
    addOptionsCall(app, '/wallet/balance');
    addOptionsCall(app, '/wallet/send');

    app.get('/auth', (req, res) => {
        console.log('GET /auth');
        executeCall(req, res, false, async() => { 
            //return await(auth.getAuth(req.query, req.body, req.headers.authtoken));
        }); 
    });

    app.post('/auth', (req, res) => {
        console.log('POST /auth');
        executeCall(req, res, false, async () => { 
            //return await(auth.postAuth(req.query, req.body));
        }); 
    });

    app.get('/wallet', (req, res) => {
        console.log('GET /wallet');
        executeCall(req, res, true, async () => { 
            return await wallet.getWalletInfo(req.query, req.body);
        }); 
    });

    app.get('/wallet/balance', (req, res) => {
        console.log('GET /wallet/balance');
        executeCall(req, res, true, async () => { 
            return await wallet.getBalance(req.query, req.body);
        }); 
    });

    app.post('/wallet/send', (req, res) => {
        console.log('POST /wallet/send');
        executeCall(req, res, true, async () => { 
            return await wallet.sendCoins(req.query, req.body);
        }); 
    });

    //open http port 
    app.listen(config.httpServerPort, () => console.log('server listening on port ' + config.httpServerPort));
}


module.exports = {
    start: run
}