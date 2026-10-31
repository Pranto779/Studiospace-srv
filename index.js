import express from 'express'
import 'dotenv/config'
const app=express()
import cors from 'cors'
app.use(cors())
app.use(express.json())

const PORT=process.env.PORT || 8000

import { MongoClient } from 'mongodb';

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
 const mongo_client=await connectToMongoDB()
 const db=mongo_client.db('StudioSpace')
 const Studiocollections=db.collection('StudioCollection')

app.get('/',(req,res)=>{
    res.send('Hello node ')
})

// http://localhost:8000/add-studio
app.post('/add-studio',async(req,res)=>{
    const result=req.body
    const data=await Studiocollections.insertOne(result)
    console.log('call');
    res.send(data)
})
// http://localhost:8000/features
app.get('/features',async(req,res)=>{
    const find=await Studiocollections.find().limit(6).toArray()
    res.send(find)
    
})
app.get('/studios',async(req,res)=>{
    const find=await Studiocollections.find().toArray()
    res.send(find)})

app.listen(PORT,()=>{
    console.log('server is running on Port',PORT);
})