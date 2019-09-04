export const FETCH_WALLET_INFO__START = "FETCH_WALLET_INFO__START";
export const FETCH_WALLET_INFO__SUCCESS = "FETCH_WALLET_INFO__SUCCESS";
export const FETCH_WALLET_INFO__FAILURE = "FETCH_WALLET_INFO__FAILURE";

export const fetchWalletInfoStart = () => ({
    type: FETCH_WALLET_INFO__START
});

export const fetchWalletInfoSuccess = ({data}) => {
    return ({
        type: FETCH_WALLET_INFO__SUCCESS,
        payload: data
    });
}

export const fetchWalletInfoFailure = () => ({
    type: FETCH_WALLET_INFO__FAILURE
});