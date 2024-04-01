import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { errorHandler } from "./middleware/errorMiddleware.js";
import stockDetailsRoutes from "./routes/stockDetailsRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";

const app = express();
const _dirname = path.dirname("");
const buildPath = path.join(_dirname, "../frontend/build");

const corsOptions = {
  origin: ["http://localhost:3000", "http://18.223.205.127"],
};
dotenv.config();
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.static(buildPath));

app.get("/", (req, res) => {
  res.send("App is running...");
});

app.use("/api/stocks", stockDetailsRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/wallet", walletRoutes);

app.get("/*", function (req, res) {
  console.log("Request: ", req);

  res.sendFile(
    path.join(__dirname, "../frontend/build/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));
