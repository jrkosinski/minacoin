import {
    FETCH_WALLET_INFO__START,
    FETCH_WALLET_INFO__SUCCESS,
    FETCH_WALLET_INFO__FAILURE,
} from "./actions";

const initialState = {
    fetchedWalletInfo: null,
    fetchFailure: false
};

const reducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch(type) {
        case FETCH_WALLET_INFO__START:
            return {
                ...state
            };
        case FETCH_WALLET_INFO__SUCCESS:
            return {
                ...state,
                fetchedWalletInfo: payload
            };
        case FETCH_WALLET_INFO__FAILURE:
            return {
                ...state,
                fetchFailure: true
            };

        default:
            return state;
    }
};

export default reducer;