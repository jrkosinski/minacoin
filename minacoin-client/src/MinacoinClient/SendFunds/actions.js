export const SEND_FUNDS__START = "SEND_FUNDS__START";
export const SEND_FUNDS__SUCCESS = "SEND_FUNDS__SUCCESS";
export const SEND_FUNDS__FAILURE = "SEND_FUNDS__FAILURE";

export const sendFundsStart = () => ({
    type: SEND_FUNDS__START
});

export const sendFundsSuccess = ({data}) => {
    return ({
        type: SEND_FUNDS__SUCCESS,
        payload: data
    });
}

export const sendFundsFailure = () => ({
    type: SEND_FUNDS__FAILURE
});