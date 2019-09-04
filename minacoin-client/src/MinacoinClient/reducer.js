import { combineReducers } from "redux";

import { reducer as walletInfoReducer } from "./WalletInfo";
import { reducer as sendFundsReducer } from "./SendFunds";

export default combineReducers({
    walletInfo: walletInfoReducer,
    sendFunds: sendFundsReducer
});
