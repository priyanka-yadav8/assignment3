import asyncHandler from "express-async-handler";
import { MongoClient } from "mongodb";
import axios from "axios";

const uri =
  "mongodb+srv://yadavpriyanka0807:6XrAlyxKw0zQvpmb@cluster0.rt4d58i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const FINNHUB_API_KEY = "cn0qd0pr01quegsk27sgcn0qd0pr01quegsk27t0";

// const fetchStockData = async (symbol) => {
//   try {
//     // Fetch stock profile
//     const stock_profile_url = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
//     const stock_profile_response = await axios.get(stock_profile_url);
//     const { ticker, name } = stock_profile_response.data;

//     // Fetch stock quote
//     // const stock_quote_url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
//     // const stock_quote_response = await axios.get(stock_quote_url);
//     // const { c, d, dp } = stock_quote_response.data;

//     // Combine the data
//     return { ticker, name };
//   } catch (error) {
//     console.error(`Error fetching data for ${symbol}:`, error);
//   }
// };

const getWatchlist = asyncHandler(async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("HW3");
    const watchlist = database.collection("watchlist");
    const documents = await watchlist.find().toArray();

    console.log(documents);
    const watchlist_data = [];

    for (const document of documents) {
      const ticker = document.stock;
      const name = document.name;
      const res = {
        "ticker" : ticker,
        "name": name
      }
      watchlist_data.push(res);
    }

    // console.log(responses,"responses");
    const responses = {
      watchlist: watchlist_data,
    };

    res.status(200).send(responses);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to retrieve Watchlist", error: error.message });
  } finally {
    await client.close();
  }
});

const addToWatchlist = asyncHandler(async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("HW3");
    const watchlist = database.collection("watchlist");
    const { ticker, name } = req.body;

    const doc = { stock: ticker, name: name };
    const result = await watchlist.insertOne(doc);

    res.status(200).json({ message: `${ticker} added to Watchlist` });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: `Failed to add ${ticker} to Watchlist`,
        error: error.message,
      });
  } finally {
    await client.close();
  }
});

const removeFromWatchlist = asyncHandler(async (req, res) => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db("HW3");
    const watchlist = database.collection("watchlist");
    const { symbol } = req.body;

    const result = await watchlist.deleteOne({ stock: symbol });

    if (result.deletedCount === 1) {
      console.log(
        `Successfully deleted one document with stock symbol: ${symbol}`
      );
    } else {
      console.log(`No documents matched the symbol: ${symbol}.`);
    }
    res.status(200).json({ message: `${symbol} deleted from Watchlist` });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: `Failed to delete ${symbol} from Watchlist`,
        error: error.message,
      });
  } finally {
    await client.close();
  }
});

const getStockFromWatchlist = asyncHandler(async (req, res) => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db("HW3");
    const watchlist = database.collection("watchlist");
    let { ticker } = req.params;
    ticker = ticker.toUpperCase();
    const query = { stock: ticker };
    const result = await watchlist.findOne(query);
    if(result==null){
        res.status(404).json({message: `${ticker} not found`});

    } else {
        res.status(200).json({
            ticker : result.stock,
            name : result.name
        });
    }
  } catch (error) {
    console.error(error);
    res.status(error.code).json({
      message: "Failed to retrieve stock from Portfolio : ",
      error: error.message,
    });
  } finally{
    await client.close();

  }
});

export { getWatchlist, addToWatchlist, removeFromWatchlist, getStockFromWatchlist };
