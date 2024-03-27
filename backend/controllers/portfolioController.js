import asyncHandler from "express-async-handler";
import {MongoClient} from "mongodb";
import axios from "axios";

const uri = "mongodb+srv://yadavpriyanka0807:6XrAlyxKw0zQvpmb@cluster0.rt4d58i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


const buyStock = asyncHandler(async(req, res)=> {
    const client = new MongoClient(uri);
    
    try {
        const { quantity, price, symbol, name } = req.body;
        await client.connect();
        const database = client.db('HW3');
        const portfolio = database.collection('portfolio');

        

    } catch (error) {
        
    }
});

const getPortfolio = asyncHandler(async(req, res)=>{

});
