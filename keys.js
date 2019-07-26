module.exports = {
  "elasticsearch_url": process.env.ELASTIC_URL || "http://localhost:9200",
  "elasticsearch_index": "kanonierzy",
  "server_port": process.env.PORT || 3001,
}