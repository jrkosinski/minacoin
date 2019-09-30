'use strict';


module.exports = {
    DIFFICULTY: 3,
    //MINE_RATE: 100000,
    MINE_RATE: 100,
    INITIAL_BALANCE: 500, //TODO: remove initial balance (set to 0)
    HTTP_PORT: process.env.HTTP_PORT || 3001,
    P2P_PORT: process.env.P2P_PORT || 5001,
    RUN_HTTP_SERVER: process.env.RUN_HTTP_SERVER || true,
    MINING_REWARD: 50,
    USE_DATABASE: false,
    PEER_LIMIT: 3
}