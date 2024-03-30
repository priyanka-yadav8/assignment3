import asyncHandler from "express-async-handler";
import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://yadavpriyanka0807:6XrAlyxKw0zQvpmb@cluster0.rt4d58i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const getWallet = asyncHandler(async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("HW3");
    const wallet = database.collection("wallet");
    const response = await wallet.find().toArray();
    res.status(200).json({
      wallet: response[0].cash_balance,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "failed to retrieve wallet", error: error.message });
  } finally {
    await client.close();
  }
});

const updateWallet = asyncHandler(async (req, res) => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db("HW3");
    const wallet = database.collection("wallet");
    const {cash_balance} = req.body;
    const filter = { wallet_id : "ABCD"};
    const updateDoc = {
        $set: {
            cash_balance : cash_balance
        }
    }
    const result = await wallet.updateOne(filter, updateDoc);
    res.status(200).json({message: "Wallet updated successfully"});

  } catch (error) {
    console.error(error);
    res.status(error.code).json({
      message: "Failed to update wallet : ",
      error: error.message,
    });
  } finally{
    await client.close();
  }
});

export { getWallet, updateWallet };
