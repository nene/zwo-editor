import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";
import EditorPage from "./components/EditorPage/EditorPage";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/editor/:id" component={EditorPage} />
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}
