var env = 'LOCAL';

switch(env) {
    case 'LOCAL': 
        window.config = {
            //logStreamUrl : 'ws://52.63.62.244:4000',
            apiUrl : 'http://localhost:4001',
            authEnabled: false
        };
        break;
        
    case 'DEV':  
        window.config = {
            apiUrl : 'http://52.63.62.244:4101',
            authEnabled: false
        };
        break;

    case 'PROD': 
        window.config = {
            apiUrl : 'http://52.63.62.244:4001',
            authEnabled: false
        };
        break;
}

