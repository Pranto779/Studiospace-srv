import express from "express";
import "dotenv/config";
const app = express();
import cors from "cors";
app.use(cors());
app.use(express.json());
const Middlewere =async (req, res, next) => {
  const authdata = req.headers.authorization;
  
if (!authdata){
    return res.status(401).send({ msg: "Unauthorized" });

}
const token=authdata.split(' ')[1]
if(!token){
  return res.status(401).send({ msg: "Unauthorized" });
}

const JWKS=createRemoteJWKSet(new URL('http://localhost:3000/api/auth/jwks'))




try {
  const {payload} =await jwtVerify(token,JWKS)
   next();
} catch (error) {
  return res.status(500).send({ msg: "Server error" });
}

 
 
  
};

const PORT = process.env.PORT || 8000;

import { MongoClient, ObjectId } from "mongodb";
import { createRemoteJWKSet, jwtVerify } from "jose";

const client = new MongoClient(process.env.MONGO_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
const mongo_client = await connectToMongoDB();
const db = mongo_client.db("StudioSpace");
const Studiocollections = db.collection("StudioCollection");
const BookingCollections = db.collection("BookingCollections");

app.get("/", (req, res) => {
  res.send("Hello node ");
});

// http://localhost:8000/add-studio
app.post("/add-studio", async (req, res) => {
  const result = req.body;
  const data = await Studiocollections.insertOne(result);
  res.send(data);
});
// http://localhost:8000/features
app.get("/features", async (req, res) => {
  const find = await Studiocollections.find().limit(6).toArray();
  res.send(find);
});

app.get("/studios/:id",Middlewere, async (req, res) => {
 
  const { id } = req.params;
  const result = await Studiocollections.findOne({ _id: new ObjectId(id) });
   
  res.send(result);
});
// http://localhost:8000/studios:id
app.patch("/studios/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const result = await Studiocollections.updateOne(
    { _id: new ObjectId(id) },
    { $set: data }
  );

  res.send(result);
});
app.get("/listing/:email",Middlewere, async (req, res) => {
  const { email } = req.params;
  const result = await Studiocollections.find({ email: email }).toArray();
  res.send(result);
});
// http://localhost:8000/listing/:id
app.patch("/listing/:id", async (req, res) => {
  const { id } = req.params;
  const result = await Studiocollections.updateOne(
    { _id: new ObjectId(id) },
    { $set: req.body },
  );
  res.send(result);
});
app.delete("/listing/:id", async (req, res) => {
  const { id } = req.params;
  const result = await Studiocollections.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});
// http://localhost:8000/mybookCollection
app.post("/mybookCollection", async (req, res) => {
  const Book = req.body;
  const Booking = await BookingCollections.insertOne(Book);
  res.send(Booking);
});

// http://localhost:8000/mybooking
app.get("/mybooking",Middlewere, async (req, res) => {
  const Book = await BookingCollections.find().toArray();
  res.send(Book);
});
// http://localhost:8000/mybooking/:id
app.delete("/mybooking/:id",async (req, res) => {
  const { id } = req.params;
  const result = await BookingCollections.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});
app.get("/studios", async (req, res) => {
  const { category } = req.query;

  const result = await Studiocollections.find(
    category ? { category: category } : {}
  ).toArray();

  res.send(result);
});
app.listen(PORT, () => {
  console.log("server is running on Port", PORT);
});
