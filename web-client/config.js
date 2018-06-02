'use strict';

module.exports = {  
    httpClientPort: parseInt(process.env.HTTP_CLIENT_PORT),
    httpServerPort: parseInt(process.env.HTTP_SERVER_PORT),
    allowedOrigins: process.env.ALLOWED_CORS_ORIGINS
};

