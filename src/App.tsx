import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import EditorPage from "./components/EditorPage/EditorPage";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <EditorPage />
        </Route>
      </Switch>
    </Router>
  );
}
