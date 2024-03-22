import dotenv from "dotenv";
import {MongoClient} from "mongodb";

dotenv.config();

const uri = process.env.MONGODB_URI;

const connectDB = async() => {
    const client = new MongoClient(uri);
    return client;
}

export default connectDB;