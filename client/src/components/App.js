import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import SearchForm from "./search-form";
import SearchResults from "./search-results";

const App = () => {

  return (
    <BrowserRouter>
      <Route path="/" component={SearchForm} />
      <Route path="/search" component={SearchResults} />
    </BrowserRouter>
  )
}


export default App;
