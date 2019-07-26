const axios = require("axios");

const { elasticsearch_index, elasticsearch_url } = require("../keys");

module.exports = async function(req, res) {

  const params = getSearchParams(req.query);

  axios({
    method: "get",
    url: `${elasticsearch_url}/${elasticsearch_index}/_search`,
    data: {
      ...CONST_PARAMS,
      ...params,
      from: req.query.from || 0,
      size: req.query.size || 10
    }
  })
    .then(response => {
      console.log(response)
      const result = {
        total: response.data.hits.total,
        items: response.data.hits.hits,
        aggregations: response.data.aggregations
      };

      return res.send(result);
    })
    .catch(err => {
      if (err.response) {
        return res.status(400).json(err.response);
      }
      else {
        return res.status(500).send();
      }
    })
}


const CONST_PARAMS = {
  "highlight" : {
    "fields" : {
      "content" : {},
      "title": {}
    }
  },
  "aggs": {
    "group_by_author": {
      "terms": {
        "field": "author.keyword",
        "size": 5
      },
    },
    "group_by_year": {
      "terms": {
        "field": "year",
        "size": 100,
        "order" : { "_key" : "asc" }
      }
    },
    "group_by_month": {
      "terms": {
        "field": "month",
        "size": 12,
        "order" : { "_key" : "asc" }
      }
    },
  }
}

/**
 * Getting the search params based on request query
 * @param {Object} queryParams 
 */
function getSearchParams(queryParams) {

  const queryMatchers = getQueryMatchers(queryParams.query);
  const sort = getSortOption(queryParams.sort);
  const range = getRangeOptions(queryParams);
  const params = {
    query: {
      bool: {
        must: [
          ...queryMatchers
        ]
      }
    },
    sort: [...sort]
  }

  if (range) {
    Object.keys(range).forEach(field => {
      params.query.bool.must.push({
        range: {
          [field]: range[field]
        }
      })
    })
  }
  return params;
}


function getQueryMatchers(query) {
  if (!query) {
    return []
  }

  const matchers = [];

  const getFieldQuery = field => {
    const regex = RegExp(`${field}:\\(.*\\)`, "g");
    const found = regex.exec(query);
    const terms = [];
    found && found.forEach(item => {
      const value = /\(.*\)/g.exec(item)[0];
      const stripped = value.slice(1, value.length - 1);
      terms.push(stripped);
    })


    query = query.replace(regex, "");

    if (terms.length) {
      matchers.push({
        "match": {
          [field]: terms.join(" ")
        }
      })
    }

  }

  [ "author", "content", "title" ].forEach(field => {
    // Checking if the user wants to search in specific fields only 
    // example: "author:(James)" query will look for "James" in author field
    getFieldQuery(field)
  });

  if (query.trim()) {
    matchers.unshift({
      "multi_match": {
        fields: [ "title", "content" ],
        query: query.trim()
      }
    })
  }

  return matchers;

}

function getSortOption(sort) {
  const availableOptions = [ "date-desc", "date-asc", "comments-desc", "comments-asc" ];

  if (availableOptions.indexOf(sort) === -1) {
    return []
  }
  else {
    const [ param, order ] = sort.split("-");
    if (param === "date") {
      return [
        { "year": order },
        { "month": order },
        { "day": order },
      ]
    }
    return [{ [param]: order }]
  }

}

function getRangeOptions(options) {
  const range = {};
  const year = {};
  const comments = {};
  if(!isNaN(options.from)) {
    year.gte = Number(options.from)
  }
  if(!isNaN(options.to)) {
    year.lte = Number(options.to)
  }
  if(!isNaN(options.commentsFrom)) {
    comments.gte = Number(options.commentsFrom)
  }
  if(!isNaN(options.commentsTo)) {
    comments.lte = Number(options.commentsTo)
  }

  if (Object.keys(year).length) {
    range.year = year;
  }
  if (Object.keys(comments).length) {
    range.comments = comments;
  }

  return Object.keys(range).length ? range : null;

}