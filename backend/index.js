import express from "express";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorMiddleware.js";
import stockDetailsRoutes from "./routes/stockDetailsRoutes.js";

const app = express();
dotenv.config();

app.use(express.json());


app.get("/", (req, res) => {
    res.send("App is running...");
});

app.use("/api/stocks",stockDetailsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(3000,() => console.log(`Server listening at port ${PORT}`));
