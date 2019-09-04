import { combineReducers } from "redux";

//import { reducer as addressBookReducer } from "./AddressBook";
import { reducer as minacoinClientReducer } from "./MinacoinClient";

export default combineReducers({
  //addressBook: addressBookReducer,
  minacoinClient: minacoinClientReducer
});
