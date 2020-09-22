const keys = require('./keys')
const encodedPass = encodeURIComponent(keys.pass)
const uri = `mongodb+srv://ph8l:${encodedPass}@cluster0.kl61z.mongodb.net/?retryWrites=true&w=majority`

const { MongoClient } = require("mongodb");



// Create a new MongoClient
const client = new MongoClient(uri, { useUnifiedTopology: true });

async function run() {
    try {
        // Connect the client to the server
        await client.connect();

        // Establish and verify connection
        await client.db("sample_airbnb").command({ ping: 1 });

        console.log("Connected successfully to server");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);

module.exports = client;