import "normalize.css/normalize.css";
import React from "react";
import ReactDOM from "react-dom";

import { RealHttpApi } from "./httpApi";
import { setupStore } from "./store";
import App from "./App";

const reduxStore = setupStore({
  httpApi: new RealHttpApi(),
});

ReactDOM.render(
  <App reduxStore={reduxStore} />,
  document.getElementById("root"),
);

