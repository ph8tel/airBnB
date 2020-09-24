const express = require('express');
const router = express.Router();

var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
const keys = require('../keys.js')

//credentials for mongodb
const encodedPass = encodeURIComponent(keys.pass)
const uri = `mongodb+srv://ph8l:${encodedPass}@cluster0.kl61z.mongodb.net/?retryWrites=true&w=majority`

// Create a new MongoClient
const { MongoClient } = require("mongodb");
const client = new MongoClient(uri, { useUnifiedTopology: true });

// Connect to mongodb
async function run() {
    try {
        // Connect the client to the server
        await client.connect();

        // Establish and verify connection
        await client.db("sample_airbnb").command({ ping: 1 });


        console.log("Connected successfully to air_bnb server");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
        console.log('connection left open to db')
    }
}
run().catch(console.dir);


router.get('/get-one', async(req, res) => {
    const database = client.db("sample_airbnb");
    const collection = database.collection("listingsAndReviews");
    const query = req.query
    console.log('waiting for results', )
    const listing = await collection.findOne(query);
    console.log('got result', listing)
        // since this method returns the matched document, not a cursor, print it directly
        // console.log('sending ', listing.name)
    console.log('query is', query)
    res.render('pages/single-listing.ejs', { listing: listing })


})

router.get('/get-many', async(req, res) => {
    const database = client.db("sample_airbnb");
    const collection = database.collection("listingsAndReviews");

    const query = req.query || { accommodates: 4 }

    const listings = []
    const limit = req.query.limit ? Number(req.query.limit) : 19
    const cursor = collection.find(query)

    await cursor.forEach(listing => listings.push(listing))
    console.log(listings.length, 'sent', 'q is', query)
    res.render('pages/index.ejs', { listings: listings })

})

router.get('/get-by-choice', async(req, res) => {
    const database = client.db("sample_airbnb");
    const collection = database.collection("listingsAndReviews");
    const query = req.query
    const limit = req.query.limit ? Number(req.query.limit) : 19
    let listings = []
    console.log('query obj is ', query, limit)
    const cursor = await collection.find(query)
    cursor.forEach(listing => {
        console.log('adding', listing)
        listings.push(listing)
    })
    console.log('found this man items: ', listings.length)
    res.render('pages/search-results.ejs', { listings: listings })
})

module.exports = router;