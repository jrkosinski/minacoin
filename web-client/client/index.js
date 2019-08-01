'use strict';

// ===============================================================================================
// 
// John R. Kosinski
// 28 May 2018
const express = require('express');
const app = express();

const config = require('../config');
const exception = require("minacoin-common").exceptions('INDEX');


function run (){
    const sendFile = (res, filename) => {
        exception.try(() => {
            res.sendfile('./client/' + filename); 
        });
    };

    const registerGetFile = (filename) => {
        app.get(filename, (req, res) => { 
            sendFile(res, filename);
        });
    };

    app.get('/', (req, res) => { sendFile(res, '/index.html'); });
    registerGetFile('/index.html');

    registerGetFile('/js/main.js');
    registerGetFile('/js/api.js');
    registerGetFile('/js/dateUtil.js');
    registerGetFile('/js/common.js');
    registerGetFile('/js/config.js');

    registerGetFile('/css/main.css');
    registerGetFile('/css/spinner.css');
    
    registerGetFile('/images/close-button.png');
    registerGetFile('/images/icon.png');
    registerGetFile('/images/plus.png');
    registerGetFile('/images/refresh.png');
    registerGetFile('/images/settings.png');
    registerGetFile('/images/redlight.png');
    registerGetFile('/images/greenlight.png');
    registerGetFile('/images/x.png');

    //open http port 
    app.listen(config.httpClientPort, () => console.log('minacoin webclient listening on port ' + config.httpClientPort));
}


module.exports = {
    start: run
}