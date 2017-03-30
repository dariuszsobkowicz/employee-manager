import React from "react";
import ReactDOM from "react-dom";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-theme.css";

import {AppState} from "./AppState";
import App from "./components/App";

ReactDOM.render(<App store={AppState}/>, document.getElementById("root"));



