import {
  FETCH_CONTACT_DETAILS__FAILURE,
  FETCH_CONTACT_DETAILS__START,
  FETCH_CONTACT_DETAILS__SUCCESS,
} from "./actions";

const initialState = {
  fetchedContact: null,
  fetchFailure: false,
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {

    // TODO something is missing here
    case FETCH_CONTACT_DETAILS__START:
      return {
        ...state,
        fetchedContact: payload,
      };

    // TODO something is wrong here
    case FETCH_CONTACT_DETAILS__SUCCESS:
      //payload is empty, and state.fetchedContact is empty
      console.log('fetchedContact: ' + JSON.stringify(action));
      return {
        ...state,
        fetchedContact: payload, //CHANGED from null
        fetchFailure: false
      };

    case FETCH_CONTACT_DETAILS__FAILURE:
      return {
        ...state,
        fetchFailure: true,
      };

    default:
      return state;
  }
};

export default reducer;