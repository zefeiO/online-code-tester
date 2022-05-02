import React, {useEffect} from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import pages
import Home from "./pages/Home";
import About from "./pages/About";
// import SingleCocktail from "./pages/SingleCocktail";
import SingleTest from "./pages/SingleTest";
import Error from "./pages/Error";
// import components
import Navbar from "./components/Navbar";
import io from "socket.io-client"

// let sid = ""

// const socket = io.connect("/")

// socket.on("connected", (data) => {
//   sid = data.sid
// })

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/test/:testName/:testId">
          <SingleTest />
        </Route>
        <Route path="*">
          <Error />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
