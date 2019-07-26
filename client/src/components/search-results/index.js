import React, { useState, useEffect } from "react";
import axios from "axios";

import Menu from "./Menu";
import Pagination from "./Pagination";
import Stats from "./Stats";
import Items from "./Items";


const SearchResults = props => {

  const ITEMS_PER_PAGE = 10;
  const [ view, setView ] = useState("items");
  const [ loading, setLoading ] = useState(true); 
  const [ page, setPage ] = useState(1);
  const [ items, setItems ] = useState([]);
  const [ total, setTotal ] = useState(0);
  const [ aggs, setAggs ] = useState({});
  const [ error, setError ] = useState(false);

  useEffect(() => getSearchResults(), [ props.location.search ])
  

  const getSearchResults = () => {
    setLoading(true);
    const urlParams = getUrlParams();
    const page = urlParams.page || 1;
    setPage(Number(page));

    const from = ITEMS_PER_PAGE * (page - 1);

    const url = `http://localhost:3001${decodeURI(props.location.search)}&from=${from}&size=${ITEMS_PER_PAGE}`

    axios.get(url)
      .then(response => {
        const { items, aggregations: aggs, total } = response.data;
        setItems(items);
        setAggs(aggs);
        setTotal(total);
        setError(false);
        setLoading(false);
      })
      .catch(err => {
        setError(true);
        setLoading(false);
      })

  } 

  const getUrlParams = () => {
    const search = decodeURI(props.location.search.slice(1));
    const params = {};
    search.split("&").forEach(item => {
      const [ name, value ] = item.split("=");
      params[name] = value;
    })
    return params;
  }

  const getNumberOfPages = () => {
    return Math.ceil(total / ITEMS_PER_PAGE);
  }

  const handlePageChange = newPage => {
    const searchStr = props.location.search;
    const regex = /page=[0-9]+/g;
    const pageParam = `page=${newPage}`;

    let newSearchStr = "";
    if (regex.test(searchStr)) {
      newSearchStr = searchStr.replace(regex, pageParam);
    }
    else {
      const ampersand = searchStr[searchStr.length - 1] === "&" ? "" : "&";
      newSearchStr = searchStr + ampersand + pageParam;
    }
    
    props.history.push(`/search${newSearchStr}`);
    
  }
  
  return (
    <div className="search-results container">
      {
        loading ? 
          <h3>Wyszukiwanie...</h3>
        :
        error ? 
          <h3 className="error">Wystąpił błąd w trakcie łączenia z serwerem</h3> 
        : <>
            <Menu view={view} setView={setView} />
            {
              view === "items" ? 
                <div className="search-results__content">
                  {
                    items && items.length ? 
                      <>
                        <p className="search-results__info">Znalezionych wyników: {total}</p>
                        <Items items={items}  />
                        <Pagination page={page} changePage={handlePageChange} totalPages={getNumberOfPages()} />
                      </>
                    : <b>Brak wyników wyszukiwania</b>
                  }
                </div>
              : items && items.length > 0 && <Stats aggs={aggs} />
            }
          </>
      }
      
    </div>
  )

}

export default SearchResults;

