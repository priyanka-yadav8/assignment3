import asyncHandler from "express-async-handler";
import { MongoClient } from "mongodb";
import axios from "axios";

const uri =
  "mongodb+srv://yadavpriyanka0807:6XrAlyxKw0zQvpmb@cluster0.rt4d58i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const addToPortfolio = asyncHandler(async (req, res) => {
  const client = new MongoClient(uri);

  try {
    const { quantity, cost_price, ticker, name } = req.body;
    await client.connect();
    const database = client.db("HW3");
    const portfolio = database.collection("portfolio");

    const doc = {
      ticker: ticker,
      name: name,
      quantity: quantity,
      cost_price: cost_price,
    };
    const result = await portfolio.insertOne(doc);
    res.status(200).json({ message: `${ticker} bought successfully` });
  } catch (error) {
    console.error(error);
    res.status(error.status).json({
      message: `Failed to add ${ticker} to Portfolio`,
      error: error.message,
    });
  } finally {
    await client.close();
  }
});

const getPortfolio = asyncHandler(async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("HW3");
    const portfolio = database.collection("portfolio");
    const documents = await portfolio.find().toArray();

    console.log(documents);
    const portfolio_data = [];

    for (const doc of documents) {
      portfolio_data.push({
        ticker: doc.ticker,
        name: doc.name,
        quantity: doc.quantity,
        cost_price: doc.cost_price,
      });
    }

    res.status(200).send({ portfolio: portfolio_data });
  } catch (error) {
    console.error(error);
    res.status(error.code).json({
      message: "Failed to retrieve Portfolio : ",
      error: error.message,
    });
  } finally {
    await client.close();
  }
});

const updatePorfolio = asyncHandler(async (req, res) => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db("HW3");
    const portfolio = database.collection("portfolio");
    let { ticker } = req.params;
    const { quantity, cost_price } = req.body;

    ticker = ticker.toUpperCase();
    const filter = { ticker: ticker };
    const updateDoc = {
      $set: {
        quantity: quantity,
        cost_price: cost_price,
      },
    };
    const result = await portfolio.updateOne(filter, updateDoc);
    res.status(200).json({ message: `${ticker} bought successfully` });
  } catch (error) {
    console.error(error);
    res.status(error.code).json({
      message: "Failed to update Portfolio : ",
      error: error.message,
    });
  } finally {
    await client.close();
  }
});

const removeFromPortfolio = asyncHandler(async (req, res) => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db("HW3");
    const portfolio = database.collection("portfolio");
    let { ticker } = req.params;
    const query = { ticker: ticker };
    const result = await portfolio.deleteOne(query);
    if (result.deletedCount === 1) {
      console.log("Successfully deleted one document.");
      res.status(200).json({ message: `${ticker} sold successfully` });
    } else {
      console.log("No documents matched the query. Deleted 0 documents.");
    }
  } catch (error) {
    console.error(error);
    res.status(error.code).json({
      message: "Failed to delete from Portfolio : ",
      error: error.message,
    });
  } finally {
    await client.close();
  }
});

const getOneStockPortfolio = asyncHandler(async (req, res) => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db("HW3");
    const portfolio = database.collection("portfolio");
    let { ticker } = req.params;
    const query = {"ticker": ticker};
    const doc =await portfolio.findOne(query);
    const result = {
        "ticker": doc.ticker,
        "name": doc.name,
        "quantity": doc.quantity,
        "cost_price": doc.cost_price,
    }
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(error.code).json({
      message: "Failed to retrieve stock from Portfolio : ",
      error: error.message,
    });
  } finally {
    await client.close();
  }
});

export { getPortfolio, addToPortfolio, updatePorfolio, removeFromPortfolio, getOneStockPortfolio };
