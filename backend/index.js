import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler } from "./middleware/errorMiddleware.js";
import stockDetailsRoutes from "./routes/stockDetailsRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";
const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
    res.send("App is running...");
});

app.use("/api/stocks",stockDetailsRoutes);
app.use("/api/watchlist", watchlistRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT,() => console.log(`Server listening at port ${PORT}`));
