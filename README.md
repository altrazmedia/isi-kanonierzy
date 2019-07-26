Simple project for my university classes. It consists of few parts: 

- scrapping the content of tens of thousands articles from a webpage
- indexing them into the Elasticsearch engine
- a simple web app connected to the Elasticsearch which allows to search through the documents

# Content of the project

## client

A simple app made in React. It displays a search form with advanced sorting and filtering options, search results and also charts presenting some simple stats of the found documents. 

## server

API connecting the React App to the Elasticsearch engine. I used Express library (mostly due to lack of time, I'm aware it could be a little bit of overkill).

## setup

### crawler.js

Script that's scrapping all the articles from kanonierzy.com website and saves them into a JSON file. It's using the [puppeteer package](https://www.npmjs.com/package/puppeteer).

### elasticsearch-setup.js

It does exactly what the filename says - sets up the elasticsearch index. I've used the [Stempel Polish Analysis Plugin](https://www.elastic.co/guide/en/elasticsearch/plugins/current/analysis-stempel.html) to provide stemming for Polish texts.

### bulk.js

Indexing the downloaded documents from a JSON file into the Elasticsearch engine.