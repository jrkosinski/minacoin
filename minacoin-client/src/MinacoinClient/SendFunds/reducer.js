import {
    SEND_FUNDS__START,
    SEND_FUNDS__SUCCESS,
    SEND_FUNDS__FAILURE,
} from "./actions";

const initialState = {
    responseData: null,
    fetchFailure: false
};

const reducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch(type) {
        case SEND_FUNDS__START:
            return {
                ...state
            };
        case SEND_FUNDS__SUCCESS:
            return {
                ...state,
                responseData: payload
            };
        case SEND_FUNDS__FAILURE:
            return {
                ...state,
                fetchFailure: true
            };

        default:
            return state;
    }
};

export default reducer;