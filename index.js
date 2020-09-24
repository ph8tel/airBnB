//express
const express = require('express')
const app = express()

//env vars and setup
const keys = require('./keys')
const port = process.env.port || 3333
const path = require('path')

//tell express where statc files are
app.use(express.static(path.join(__dirname, 'public')));

//how I want to render data to users
app.set('view engine', 'ejs')

//where the templates are to render
app.set('views', path.join(__dirname, 'views'))

//routes to other endpoint logic
const dbRoute = require('./routes/db.js')
app.use('/db/', dbRoute)

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
app.get('/', (req, res) => {
    res.send('hello world')
})

app.get('/dyn', async(req, res) => {

    const database = client.db("sample_airbnb");
    const collection = database.collection("listingsAndReviews");

    const query = { _id: "1001265" };
    console.log('waiting for results')
    const listing = await collection.findOne(query);
    console.log('got result')
        // since this method returns the matched document, not a cursor, print it directly
    console.log('sending ', listing.name)
    res.render('pages/index.ejs', { listing: listing })

})

app.get('/qwe', async(req, res) => {
    const database = client.db("sample_airbnb");
    const collection = database.collection("listingsAndReviews");

    const query = { accommodates: 4 }
    const cursor = collection.find(query).limit(3)

    const listings = []
    await cursor.forEach(listing => listings.push(listing))
    console.log(listings[0].price, 'sent')
    res.render('pages/index.ejs', { listings: listings })

})

const server = app.listen(port, console.log(`running on port ${port}`))
module.exports = server