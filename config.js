'use strict';

exports.DIFFICULTY = 3;
exports.MINE_RATE = 100000;
exports.INITIAL_BALANCE = 500; //TODO: remove initial balance (set to 0)
exports.HTTP_PORT = process.env.HTTP_PORT || 3001;
exports.P2P_PORT = process.env.P2P_PORT || 5001;
exports.MINING_REWARD = 50;