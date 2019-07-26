const axios = require("axios");
const { elasticsearch_url, elasticsearch_index } = require("../keys");

const url = `${elasticsearch_url}/${elasticsearch_index}`;

(async () => {

  try {
    await axios({ method: "delete", url }); // deleting the index if it exists
    console.log(`Index has been deleted`)
  }
  catch(err) {}

  try {
    await axios({ 
      method: "put",
      url,
      body: {
        "mappings": {
          "properties": {
            "content": { 
              "type" : "text",
              "analyzer": "polish"
            },
            "title": {
              "type": "text",
              "analyzer": "polish"
            },
            "author": {
              "type": "text",
              "analyzer": "polish",
              "fields": {
              "keyword": { 
                "type": "keyword"
              }
            }
            }
          }
        }    
      }
    })
    console.log("Cretated the new index with mappings")
  } catch(err) {
    console.log(err.response.message)
  }
     
})();