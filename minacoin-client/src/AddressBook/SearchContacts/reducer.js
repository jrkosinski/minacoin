import {
  SELECT_MATCHING_CONTACT,
  UPDATE_SEARCH_PHRASE__FAILURE,
  UPDATE_SEARCH_PHRASE__START,
  UPDATE_SEARCH_PHRASE__SUCCESS,
} from "./actions";

const initialState = {
  phrase: "",
  matchingContacts: [],
  searchFailure: false,
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  if (payload)
    console.log('payload: ' + JSON.stringify(payload));

  switch (type) {

    case UPDATE_SEARCH_PHRASE__START:
      return {
        ...state,
        phrase: payload.newPhrase,
        searchFailure: false,
      };

    case UPDATE_SEARCH_PHRASE__SUCCESS:
      console.log('success: ' + JSON.stringify(payload));
      return {
        ...state,
        matchingContacts: payload.matchingContacts,
      };

    // TODO something is wrong here
    case UPDATE_SEARCH_PHRASE__FAILURE:
      return {
        ...state,
        searchFailure: true, //CHANGED
      };

    // TODO something is wrong here
    case SELECT_MATCHING_CONTACT:
      console.log(JSON.stringify(payload));
      return {
        ...state,
        phrase: payload.selectedMatchingContact.id,
        matchingContacts: [],
      };

    default:
      return state;

  }
};

export default reducer;