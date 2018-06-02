
function execApiCall (url, method, data, callback) {
    console.log('calling ' + url);

    if (!callback) 
        callback = () => {};

    var options = {
        method: method,
        contentType: 'application/json',
        cache: false,
        beforeSend: (req) => {
            req.setRequestHeader("authtoken", cookies.getAuthToken())
        },
        success: function (result) {
            console.log(result);
            callback(result, null);
        },
        error: function (err) {
            console.log(err);
            callback(null, err);
        }
    };

    if (data) {
        options.dataType = 'json';
        options.data = JSON.stringify(data);
    }

    $.ajax(url, options);
}

function authenticate(credentials, callback) {
    execApiCall(config.apiUrl + '/auth', 'POST', credentials, callback);
}

function authorize(callback){
    execApiCall(config.apiUrl + '/auth', 'GET', {}, callback);
}

function sendCoins(from, to, amount, callback) {
    const url = '/wallet/send'; 
    
    execApiCall(config.apiUrl + url, 'POST', {
        from: from,
        to: to,
        amount: amount
    }, callback);
}

function getWalletBalance(walletAddr, callback) {
    const url = '/wallet/balance?addr=' + walletAddr; 
    
    execApiCall(config.apiUrl + url, 'GET', { }, callback);
}

$(document).ready(function () {
    window.api = {
        authenticate,
        authorize,
        sendCoins, 
        getWalletBalance
    };
}); 