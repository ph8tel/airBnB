const MongoClient = require('mongodb').MongoClient;
const keys = require('./keys')
const uri = `mongodb+srv://ph8l:${keys.pass}@cluster0.kl61z.mongodb.net/Cluster0?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true })
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
module.exports = client