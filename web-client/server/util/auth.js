'use strict';

// 
// 
// John R. Kosinski
// 20 Nov 2017
const AWS = require("aws-sdk"); 
const CognitoSDK = require('amazon-cognito-identity-js-node');
const jwt = require('jwt-js');

const config = require('../config');
const common = require("minacoin-common"); 
const exception = common.exceptions('AUTH');

// ----------------------------------------------------------------------------------------------- 
// authorizes a request by validating the given token with Amazon Cognito service
// 
// args
//  token: the auth token to validate
//
// returns: boolean (true if authorized)
async function doAuthorize(token) {
    return exception.try(() => {        
        if (token)
            console.log('authorize ' + token.substring(0, 40)); 

        //if auth turned off, just return true 
        if (!config.authEnabled)
            return true;

        //Fail if the token is not jwt
        var decodedJwt = jwt.decodeToken(token, {complete: true});
        if (!decodedJwt) {
            console.log("Not a valid JWT token");
            return false; 
        }
        console.log(JSON.stringify(decodedJwt));

        //Fail if token is not from your UserPool
        if (decodedJwt.payload.iss != 'https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_z3JtEUeLY') {
            console.log("invalid issuer");
            return false; 
        }

        //Reject the jwt if it's not an 'Access Token'
        if (decodedJwt.payload.token_use != 'id') {
            console.log("Not an access token");
            return false; 
        }

        //Get the kid from the token and retrieve corresponding PEM
        var kid = decodedJwt.header.kid;

        return true;
        /*
        var pem = pems[kid];
        if (!pem) {
            console.log('Invalid access token');
            context.fail("Unauthorized");
            return;
        }
        */

        //Verify the signature of the JWT token to ensure it's really coming from your User Pool

    //TODO: re-enable this 
    /*
        jwt.verify(token, pem, { issuer: iss }, function(err, payload) {
            if(err) {
                context.fail("Unauthorized");
            } else {
                //Valid token. Generate the API Gateway policy for the user
                //Always generate the policy on value of 'sub' claim and not for 'username' because username is reassignable
                //sub is UUID for a user which is never reassigned to another user.
                var principalId = payload.sub;

                //Get AWS AccountId and API Options
                var apiOptions = {};
                var tmp = event.methodArn.split(':');
                var apiGatewayArnTmp = tmp[5].split('/');
                var awsAccountId = tmp[4];
                apiOptions.region = tmp[3];
                apiOptions.restApiId = apiGatewayArnTmp[0];
                apiOptions.stage = apiGatewayArnTmp[1];
                var method = apiGatewayArnTmp[2];
                var resource = '/'; // root resource
                if (apiGatewayArnTmp[3]) {
                    resource += apiGatewayArnTmp[3];
                }
                //For more information on specifics of generating policy, refer to blueprint for API Gateway's Custom authorizer in Lambda console
                var policy = new AuthPolicy(principalId, awsAccountId, apiOptions);
                policy.allowAllMethods();
                var policyData = {
                    'principalId': principalId,
                    'username': payload['cognito:username'],
                    //'groups': payload['cognito:groups'],
                    'email': payload.email
                };
                console.log(context);
                var finalPolicy = policy.build();
                finalPolicy.context = policyData;
                console.log(finalPolicy);
                context.succeed(finalPolicy);
            }
        });
        */
    });
}

// ----------------------------------------------------------------------------------------------- 
// authenticates a user with Amazon Cognito service
// 
// args
//  username: 
//  password: 
//
// returns: auth token (string) if authenticated; null otherwise
async function authenticate(username, password) {

    //if auth not enabled, just return anything 
    if (!config.authEnabled)
        return '{}'; 
        
	AWS.CognitoIdentityServiceProvider.AuthenticationDetails = CognitoSDK.AuthenticationDetails;
	AWS.CognitoIdentityServiceProvider.CognitoUserPool = CognitoSDK.CognitoUserPool;
	AWS.CognitoIdentityServiceProvider.CognitoUser = CognitoSDK.CognitoUser;

	var authenticationData = {
        Username : username,
        Password : password,
    };
    var authenticationDetails = new AWS.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
    var poolData = { UserPoolId : 'ap-southeast-2_z3JtEUeLY',
        ClientId : '48i8ggqodhi0hrp3mdm0dr88mj'
    };
    var userPool = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    var userData = {
        Username : username,
        Pool : userPool
    };
    var cognitoUser = new AWS.CognitoIdentityServiceProvider.CognitoUser(userData);

	return (new Promise((resolve, reject) => {
		cognitoUser.authenticateUser(authenticationDetails, {
			onSuccess: function (result) {
				//var accessToken = result.getAccessToken().getJwtToken();
				/*Use the idToken for Logins Map when Federating User Pools with Cognito Identity or when passing through an Authorization Header to an API Gateway Authorizer*/
				console.log('idToken + ' + result.idToken.jwtToken);
				resolve(result.idToken.jwtToken);
                //resolve(accessToken);
			},

			newPasswordRequired : (result) => { 
				console.log('new password required');
				console.log(JSON.stringify(result));
				resolve(null);
			},

			onFailure: function(err) {
				console.log(err);
				resolve(null);
			},
		});
	}));
}

//  
async function authorize(authToken) {
	//if auth not enabled, always return true
	if (!config.authEnabled)
		return true;

	if (!authToken)
		return false;

	//validate token
	return await doAuthorize(authToken);
}

// ----------------------------------------------------------------------------------------------- 
async function getAuth(querystring, body, authToken) {
	console.log('get auth');

	if (await authorize(authToken)) {
		return { authorized: true };
	}
	else {
		return { authorized: false };
	}
}

// ----------------------------------------------------------------------------------------------- 
async function postAuth(querystring, body, authToken) {
	console.log('post auth (login)');

	//authenticate
	var username = body['username'];
	var password = body['password'];
	var authToken = await authenticate(username, password);

	if (authToken)
		return { authorized: true, authToken: authToken };
	else
		return { authorized: false };
}


module.exports = {
    authorize : authorize,
    getAuth : getAuth,
    postAuth : postAuth
}