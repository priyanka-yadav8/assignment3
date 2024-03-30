import express from "express";
import { getStockDetails, getCompanyNews, getInsights, getStocksQuote, autoComplete, getHistoricalChart } from "../controllers/stockDetailsController.js";

const router = express.Router();

router.route("/get-stock-details").post(getStockDetails);
router.route("/get-stock-quote").post(getStocksQuote);
router.route("/get-company-news").post(getCompanyNews);
router.route("/get-insights").post(getInsights);
router.route("/autocomplete/:ticker").get(autoComplete);
router.route("/get-historical-chart/:tickerSymbol").get(getHistoricalChart);

export default router;