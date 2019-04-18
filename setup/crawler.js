const fs        = require("fs");
const puppeteer = require("puppeteer");



/** Extracting the content of the news from kanonierzy.com website and saving it into a JSON file */

const START = 5;      // Index of first news
const END   = 47360;  // Index of last news
const FILENAME = "docs.json";


(async () => {
  const browser = await puppeteer.launch();
  const page    = await browser.newPage();
  const errorFileStream = fs.createWriteStream("crawlerErrors.log", { flags: "a" });

  let docs = [];
  const arrayLength = END + 1 - START;

  await(asyncForEach(Array(arrayLength), async(val, index) => {
    const newsId = START + index;
    try {
      const doc = await scrapNews(newsId, page);
      docs.push(doc);
    } catch (error) {
      errorLog(newsId, error, errorFileStream);
    }

    if (index % 1000 === 0) {
      // appending to the file everytime there are 1000 of docs downloaded
      await appendToFile(docs);
      docs = [];
    }

  }))

  await appendToFile(docs);

  errorFileStream.end();
  await browser.close();
})();


async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

/**
 * Scrapping contet of a single document
 * @param {Number} newsId 
 * @param {Object} page page object from the puppeteer library
 */
async function scrapNews(newsId, page) {
  console.info(`Extracting data from news #${newsId}...`)
  
  const url = `http://kanonierzy.com/news/s/${newsId}/`;
  await page.goto(url);

  const title = await (await (await page.$("h1.sub")).getProperty("textContent")).jsonValue();
  const author_raw = await (await (await page.$(".details .date .hid")).getProperty("textContent")).jsonValue();
  const author = author_raw.replace(",", "").trim();

  const comments_raw = await (await (await page.$(".details .comments")).getProperty("textContent")).jsonValue();
  const comments = parseInt( comments_raw.replace(/[^0-9]/g, ""), 10 );

  const dateAndTime = await (await (await page.$(".details .date")).getProperty("textContent")).jsonValue();
  const day   = parseInt(dateAndTime.match(/[0-9]{2}/g)[0], 10);
  const month = parseInt(dateAndTime.match(/[0-9]{2}/g)[1], 10);
  const year  = parseInt(dateAndTime.match(/[0-9]{4}/g)[0], 10);
  const time  = dateAndTime.match(/[0-9]{2}:[0-9]{2}/g)[0];


  const content = await (await page.evaluate(() => Array.from( document.querySelectorAll(".thenews p:not(.text)"), element => element.textContent ))).join("\n");

  const tags = await page.evaluate(() => Array.from( document.querySelectorAll(".tags a"), element => element.textContent ));

  const doc = { title, author, comments, day, month, year, time, content, tags, url, newsId };

  return doc;
 
}

/** Appending an array of object to the JSON file
 * @param {Array} docs 
 */
async function appendToFile(docs) {
  if (!docs || !docs.length) return;
  console.info("Appending documents to the file...")
  const toAppend = [...docs];

  if (fs.existsSync(FILENAME)) {
    const fileContent = JSON.parse(fs.readFileSync(FILENAME)) || [];
    toAppend.unshift(...fileContent);
  }

  const json = JSON.stringify(toAppend);
  fs.writeFileSync(FILENAME, json);
}


async function errorLog(newsId, error, stream) {
  console.error(`Error with news with id of ${newsId}`);
  const message = `#${newsId}:\t\t${error}\n`;
  stream.write(message)
}
