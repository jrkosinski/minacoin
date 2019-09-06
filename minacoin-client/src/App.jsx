import React from "react";
import { Provider as ReduxProvider } from "react-redux";
//import AddressBook from "./AddressBook";
import MinacoinClient from "./MinacoinClient";

import "./App.css";

/*
FEATURES TO SUPPORT:
- check own balance
- send money to another wallet
- block explorer
- peer explorer

TODO:
- set up API
- set up components
  - view balance
  - send cash
*/

const App = ({ reduxStore }) => (
  <ReduxProvider store={reduxStore}>
    <main className="App">
      <MinacoinClient />
    </main>
  </ReduxProvider>
);

export default App;