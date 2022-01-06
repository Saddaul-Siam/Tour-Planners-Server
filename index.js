const express = require("express");
var cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hg2sj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const toursCollection = client.db("roam-tourism").collection("tours");
  const bookingCollection = client.db("roam-tourism").collection("booking");
  const ordersCollection = client.db("roam-tourism").collection("orders");

  // get all tours
  app.get("/tours", async (req, res) => {
    const result = await toursCollection.find({}).toArray();
    res.send(result);
  });

  // get single tour
  app.get("/singleTour/:id", async (req, res) => {
    const result = await toursCollection.findOne({
      _id: ObjectId(req.params.id),
    });
    res.send(result);
  });

  // add tours
  app.post("/addTours", async (req, res) => {
    console.log(req.body);
    const result = await toursCollection.insertOne(req.body);
    res.json(result);
    // console.log(result);
  });

  //add booking in database
  app.post("/addBooking", async (req, res) => {
    const result = await bookingCollection.insertOne(req.body);
    res.send(result);
    console.log(result);
  });

  // get booking api
  app.get("/bookings", async (req, res) => {
    const result = await bookingCollection.find({}).toArray();
    res.send(result);
  });

  // get all booking by email query
  app.get("/myBooking/:email", async (req, res) => {
    // console.log(req.params);
    const result = await bookingCollection
      .find({ email: req.params.email })
      .toArray();
    res.send(result);
  });

  // add order
  app.post("/addOrder", async (req, res) => {
    console.log(req.body);
    const result = await ordersCollection.insertOne(req.body);
    res.json(result);
    console.log(result);
  });

  // get order api
  app.get("/orders", async (req, res) => {
    const result = await ordersCollection.find({}).toArray();
    res.send(result);
  });

  //Get order api by email
  app.get("/myOrders/:email", async (req, res) => {
    console.log(req.params);
    const result = await ordersCollection
      .find({ email: req.params.email })
      .toArray();
    console.log(result);
    res.send(result);
  });

  // delete single tours
  app.delete("/deleteTours/:id", async (req, res) => {
    console.log(req.params);
    const result = await bookingCollection.deleteOne({ _id: req.params.id });
    console.log(result);
    res.send(result);
  });

  // delete all tours
  app.delete("/deleteTours", async (req, res) => {
    console.log(req.params);
    const result = await bookingCollection.deleteMany({});
    console.log(result);
    res.send(result);
  });

  // delete orders
  app.delete("/deleteOrders/:id", async (req, res) => {
    console.log(req.params);
    const result = await ordersCollection.deleteOne({
      _id: ObjectId(req.params.id),
    });
    console.log(result);
    res.send(result);
  });

  // update-order-status

  app.put("/orderStatusUpdate", async (req, res) => {
    const id = req?.body?.id;
    const status = req?.body?.status;
    const query = { _id: ObjectId(id) };
    const updateDoc = {
      $set: {
        status: status,
      },
    };
    const result = await ordersCollection.updateOne(query, updateDoc);
    res.json(result);
  });
});

// GET API
app.get("/", (req, res) => {
  res.send("Running tourism servers");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
