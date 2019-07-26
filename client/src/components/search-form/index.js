import React, { useState } from "react";

import Form from "./Form";

const SearchForm = props => {

  const [ query, setQuery ] = useState("");
  const [ sort, setSort ] = useState("score");
  const [ from, setFrom ] = useState("");
  const [ to, setTo ] = useState("");
  const [ commentsFrom, setCommentsFrom ] = useState("");
  const [ commentsTo, setCommentsTo ] = useState("");
  const [ displayAdvanced, setDisplayAdvanced ] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    submitSearch();
  }

  const submitSearch = () => {
    const url = getUrlFromParams();
    props.history.push(url);
  }

  const getUrlFromParams = () => {
    const params = [];
    
    const values = { query, from, to, commentsFrom, commentsTo, sort };
    Object.keys(values).forEach(name => {
      if (values[name]) {
        const encoded = `${name}=${encodeURI(values[name])}`;
        params.push(encoded);
      }
    })
    const url = `/search?${params.join("&")}`;
    return url;
  }


  const handleChange = e => {
    const value = e.target.value;
    switch (e.target.name) {
      case "query": {
        setQuery(value);
        break
      }
      case "sort": {
        setSort(value);
        break;
      }
      case "from": {
        setFrom(value);
        break;
      }
      case "to": {
        setTo(value);
        break;
      }
      case "commentsFrom": {
        setCommentsFrom(value);
        break;
      }
      case "commentsTo": {
        setCommentsTo(value);
        break;
      }
      default: {
        break;
      }
    }
  }

  const toggleAdvanced = () => {
    setDisplayAdvanced(!displayAdvanced);
  }

  return (
    <Form 
      commentsFrom={commentsFrom}
      commentsTo={commentsTo}
      toggleAdvanced={toggleAdvanced}
      displayAdvanced={displayAdvanced}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      sort={sort}
      query={query}
      from={from}
      to={to}
    />
  )

}

export default SearchForm;
