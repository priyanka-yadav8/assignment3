import asyncHandler from "express-async-handler";
import {MongoClient} from "mongodb";
import axios from "axios";


const uri = "mongodb+srv://yadavpriyanka0807:6XrAlyxKw0zQvpmb@cluster0.rt4d58i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const FINNHUB_API_KEY = "cn0qd0pr01quegsk27sgcn0qd0pr01quegsk27t0";

const fetchStockData = async(symbol)=> {
    try {
        // Fetch stock profile
        const stock_profile_url = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
        const stock_profile_response = await axios.get(stock_profile_url);
        const { ticker, name } = stock_profile_response.data;
  
        // Fetch stock quote
        const stock_quote_url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
        const stock_quote_response = await axios.get(stock_quote_url);
        const { c, d, dp } = stock_quote_response.data;
  
        // Combine the data
        return { ticker, name, c, d, dp };
      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
      }
};

const getWatchlist = asyncHandler(async(req, res)=>{
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('HW3');
        const watchlist = database.collection('watchlist');
        const documents = await watchlist.find().toArray();
        
        console.log(documents);
        const watchlist_data = [];

        for (const document of documents) {
            const symbol = document.stock;
            const res = await fetchStockData(symbol);
            watchlist_data.push(res);
        }

        // console.log(responses,"responses");
        const responses = {
            "watchlist": watchlist_data
        }

        res.status(200).send(responses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve Watchlist", error: error.message });
    } finally{
        await client.close();
    }

});

const addToWatchlist = asyncHandler(async(req,res)=>{
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('HW3');
        const watchlist = database.collection('watchlist');
        const { symbol } = req.body;

        const doc = { "stock": symbol };
        const result = await watchlist.insertOne(doc);

        res.status(201).json({message : `${symbol} added to Watchlist`});

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Failed to add ${symbol} to Watchlist`, error: error.message });
    }
});


const removeFromWatchlist = asyncHandler(async(req,res)=>{
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db('HW3');
        const watchlist = database.collection('watchlist');
        const { symbol } = req.body;

        const result = await watchlist.deleteOne({ stock: symbol });

        if (result.deletedCount === 1) {
            console.log(`Successfully deleted one document with stock symbol: ${symbol}`);
        } else {
            console.log(`No documents matched the symbol: ${symbol}.`);
        }
        res.status(200).json({ message: `${symbol} deleted from Watchlist` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Failed to delete ${symbol} from Watchlist`, error: error.message });
    }
});

export { getWatchlist, addToWatchlist, removeFromWatchlist };
