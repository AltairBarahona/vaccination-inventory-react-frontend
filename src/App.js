import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import ReactDOM from "react-dom";
import Routes from "./routes/routes";

class App extends Component {
  //Change function for class to use state

  render() {
    return (
      <React.StrictMode>
        <Routes />
      </React.StrictMode>
      // document.getElementById("root")
    );
  }
}

export default App;
