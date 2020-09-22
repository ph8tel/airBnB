const express = require('express')
const app = express()
const port = process.env.port || 3333
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')));
const keys = require('./keys')

const encodedPass = encodeURIComponent(keys.pass)
const uri = `mongodb+srv://ph8l:${encodedPass}@cluster0.kl61z.mongodb.net/?retryWrites=true&w=majority`

const { MongoClient } = require("mongodb");
const client = new MongoClient(uri);

app.get('/', (req, res) => {
    res.send('hello world')
})

app.get('/air', async(req, res) => {

    async function run() {
        try {
            await client.connect();

            const database = client.db("sample_airbnb");
            const collection = database.collection("listingsAndReviews");

            const query = { _id: "1001265" };

            const listing = await collection.findOne(query);
            // since this method returns the matched document, not a cursor, print it directly
            res.json(listing)

        } finally {
            await client.close();
        }
    }
    run().catch(err => {
        console.dir
        res.json(err)
    });
})

app.listen(port, console.log(`running on port ${port}`))