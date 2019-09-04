import { actions as walletInfoActions } from "./WalletInfo";
//import { actions as sendFundsActions } from "./SendFunds";

export const fetchWalletInfoAction = () => {
    return (dispatch, getState, { httpApi}) => {
        dispatch(walletInfoActions.fetchWalletInfoStart());

        httpApi.getWalletInfo().then((data) => {
            dispatch(walletInfoActions.fetchWalletInfoSuccess({data}));
        }).catch((e) => {
            dispatch(walletInfoActions.fetchWalletInfoFailure());
        });
    };
}