const express = require('express');
var cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const objectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hg2sj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const servicesCollection = client.db("roam-tourism").collection("services");

  // get all services
  app.get("/tours", async (req, res) => {
    const result = await servicesCollection.find({}).toArray();
    res.send(result);
  });

  // get single tour
  app.get("/singleTour/:id", async (req, res) => {
    const result = await servicesCollection.findOne({ _id: objectId(req.params.id) });
    res.send(result);
  });

  // post api
  app.post("/addTours", async (req, res) => {
    console.log(req.body);
    const result = await servicesCollection.insertOne(req.body)
    res.send(result.insertedId);
  });

});

// GET API
app.get('/', (req, res) => {
  res.send('Running tourism servers');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});