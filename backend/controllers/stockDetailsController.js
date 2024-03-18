import asyncHandler from "express-async-handler";
import axios from "axios";

const FINNHUB_API_KEY = "cn0qd0pr01quegsk27sgcn0qd0pr01quegsk27t0";

const stockDetails = asyncHandler( async (req,res) => {
    const { ticker } = req.body;
    console.log(ticker);
    try {
        const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${FINNHUB_API_KEY}`;
        const response = await axios.get(url);
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve stock details", error: error.message });
    }

   
});

export {stockDetails};