const axios = require("axios");
const fs    = require("fs");
const { elasticsearch_url, elasticsearch_index } = require("../keys");

const DOCS_PER_REQUEST = 5000;

/** Indexing all the downloaded documents */

(async function() {
  const docs = getSplittedDocs();
  for (const part of docs) {
    await uploadDocs(part);
  }
})();


/** Loads documents from the file and split them into arrays
 * @returns {Array} Array of array containg maximum of DOCS_PER_REQUEST documents
 */
function getSplittedDocs() {

  const fileContent = fs.readFileSync("./docs.json");
  const splitted    = [];

  JSON.parse(fileContent).forEach((doc, index) => {
    const splittedIndex = Math.floor(index / DOCS_PER_REQUEST);
    if (!splitted[splittedIndex]) {
      splitted[splittedIndex] = [ doc ]
    }
    else {
      splitted[splittedIndex].push(doc)
    }
  })

  return splitted;
}


function uploadDocs(docs) {

  let str = "";

  docs.forEach(doc => {
    str += `{ "index": { "_type" : "_doc" } }\n`;
    str += JSON.stringify(doc) + "\n";
  })

  return new Promise((resolve) => {
    axios({
      method: "post",
      url: `${elasticsearch_url}/${elasticsearch_index}/_bulk`,
      headers: { "Content-Type": "application/x-ndjson" },
      data: str,
    })
      .then(() => {
        console.log("Docs uploaded");
        resolve();
      })
      .catch(err => {
        console.log(err);
        resolve();
      })
  })
}


