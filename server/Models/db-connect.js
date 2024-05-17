import dotenv from "dotenv";
dotenv.config();
import { MongoClient, ServerApiVersion } from 'mongodb';

//set-up DB
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export default async function run() {
    try {
      await client.connect();
      // confirm connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
      const db = client.db("Visualize");  //setup database object Visualize
      return db;
    }catch(e){
      console.log("error connecting to db:", e);
    }
     finally{}
}