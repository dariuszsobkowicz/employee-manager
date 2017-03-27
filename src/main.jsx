import React from "react";
import ReactDOM from "react-dom";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-theme.css";

const Przyklad = (props) => {
    return (
        <p className="text-primary">Hello World</p>
    );
};

ReactDOM.render(<Przyklad />, document.getElementById("root"));

