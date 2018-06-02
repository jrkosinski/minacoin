
//TODO: move to stringUtil
String.prototype.padRight = function(totalLen, paddingChar) {
	var target = this;
    if (!paddingChar)
        paddingChar = ' ';
    while(target.length < totalLen)
        target += paddingChar;
	return target;
};

String.prototype.padLeft = function(totalLen, paddingChar) {
	var target = this;
    if (!paddingChar)
        paddingChar = ' ';
    while(target.length < totalLen)
        target = paddingChar + target;
	return target;
};


function ExceptionHelper() {
    this.try = (callback) => {
        try {
            return callback();
        }
        catch (e) {
            showError(e);
            return null;
        }
    }
}

var exception = new ExceptionHelper();

function showHideProgress(show) {
    if (show)
        $("#progressOverlay").show();
    else
        $("#progressOverlay").hide();
}

function showProgress() {
    showHideProgress(true);
}

function hideProgress() {
    showHideProgress(false);
}

function login() {
    exception.try(() => {
        var username = $("#usernameText").val().trim();
        var password = $("#passwordText").val().trim();

        if (username.length && password.length) {
            showProgress();
            api.authenticate({ username: username, password: password }, (output, err) => {
                if (err) {
                    showError(err);
                }
                else {
                    hideProgress();
                    if (output && output.authorized) {
                        if (output.authToken) {
                            console.log('setting auth token ' + output.authToken);
                            cookies.setAuthToken(output.authToken);
                        }

                        showMainScreen();
                    }
                }
            });
        }
    });
}

function logout() {
    exception.try(() => {
        cookies.deleteAuthToken();
        showProgress();
        setTimeout(() => {
            hideProgress();
            showLogin();
        }, 1000);
    });
}

function checkAuth() {
    exception.try(() => {
        api.authorize((output, err) => {
            if (err) {
                showError(err);
            }
            else {
                if (output && output.authorized) {
                    //alert('auth'); 
                }
                else {
                    showLogin(100);
                }
            }
        });
    });
}

function showForm(id) {
    $(id).css('display', 'initial');
    //$(id).css('margin-top', '0px'); 
    //$(id).show();
}

function hideForm(id) {
    $(id).css('display', 'none');
    //$(id).css('margin-top', '1000px'); 
    //$(id).hide();
}

function hideAllForms() {
    exception.try(() => {
        hideForm('#errorOverlay');
        hideForm('#loginOverlay');
    });
}

function showError(error) {
    console.log(error);
    hideProgress();
    showForm("#errorOverlay");
}

function showLogin() {
    exception.try(() => {
        showForm('#loginOverlay');
        window.common.showingForm = 'login';
    });
}

function authTokenExists(){
    var cookie = cookies.getAuthToken();
    return (cookie && cookie.length);
}

function startup(callback){    
    common.exception.try(() => {
        hideProgress();
        hideAllForms();

        //if auth is enabled, check auth first
        if (config.authEnabled){
            
            if (authTokenExists()){               
                showProgress(); 

                api.authorize((response, err) => {
                    hideProgress(); 

                    if (response){
                        if (!response.authorized)
                            showLogin();
                        else
                            callback();
                    }

                    if (err)
                        showError(err); 
                });
            }
            else{
                showLogin();
            }
        }
        else
            showMainScreen();

        //enter key functionality
        document.onkeydown = function () {
            if (window.event.keyCode == '13') {
                switch (common.showingForm) {
                    case 'login':
                        login();
                        break;
                }
            }
        }
    });
}

function getQuerystring() {
    var queries = {};
    $.each(document.location.search.substr(1).split('&'),function(c,q){
        var i = q.split('=');
        queries[i[0].toString()] = i[1].toString();
    });
    return queries;
}


$(document).ready(function () {
    window.common = {
        exception,
        showHideProgress,
        showProgress,
        hideProgress,
        login,
        logout,
        checkAuth,
        showForm,
        hideForm,
        hideAllForms,
        showError,
        showLogin,
        authTokenExists,
        startup,
        getQuerystring        
    };
}); 