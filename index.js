const express = require("express")
const { MongoClient } = require('mongodb');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.euv3j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("Helping-Hand");
        const eventsCollection = database.collection("events");
        const userEventsCollection = database.collection("userEvents");

        // GET API '
        // all events
        app.get('/events', async (req, res) => {
            const cursor = eventsCollection.find({})
            const events = await cursor.toArray()
            res.send(events)
        })
        //single event
        app.get('/events/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const events = await eventsCollection.findOne(query)
            res.send(events)
        })

        app.get('/userEvents', async (req, res) => {
            const cursor = userEventsCollection.find({})
            const events = await cursor.toArray()
            res.send(events)
        })
        //single event
        app.get('/userEvents/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const events = await userEventsCollection.findOne(query)
            res.send(events)
        })

        // POST API
        app.post('/events', async (req, res) => {
            const newEvent = req.body
            const result = await eventsCollection.insertOne(newEvent);
            res.json(result)
        })

        app.post('/userEvents', async (req, res) => {
            const newEvent = req.body
            const result = await userEventsCollection.insertOne(newEvent);
            res.json(result)
        })
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Node.js Server RUNNING')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})