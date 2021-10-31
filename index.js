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
        const database = client.db("Traveezy");
        const servicesCollection = database.collection("services");
        const userServiceCollection = database.collection("userServices");

        // GET API '
        // all events
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        })
        //single event
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const services = await servicesCollection.findOne(query)
            res.send(services)
        })

        app.get('/userServices', async (req, res) => {
            const cursor = userServiceCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        })
        //single event
        app.get('/userServices/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const services = await userServiceCollection.findOne(query)
            res.send(services)
        })

        // POST API
        app.post('/services', async (req, res) => {
            const newService = req.body
            const result = await servicesCollection.insertOne(newService);
            res.json(result)
        })
        app.post('/userServices', async (req, res) => {
            const newOrder = req.body
            const result = await userServiceCollection.insertOne(newOrder);
            res.json(result)
        })

        // UPDATE API 
        // app.put('/userServices/:id', async (req, res) => {
        //     const id = req.params.id
        //     const updatedOrder = req.body
        //     const filter = { _id: ObjectId(id) }
        //     const options = { upsert: true }
        //     const updateDoc = {
        //         $set: {
        //             status: updatedOrder.status,
        //         },
        //     };
        //     const result = await usersCollection.updateOne(filter, updateDoc, options)
        //     res.json(result)
        // })

        // DELETE API 
        app.delete('/userServices/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await userServiceCollection.deleteOne(query)
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