import express from "express";
import { getStockDetails, getCompanyNews, getInsights, getStocksQuote, autoComplete } from "../controllers/stockDetailsController.js";

const router = express.Router();

router.route("/get-stock-details").post(getStockDetails);
router.route("/get-stock-quote").post(getStocksQuote);
router.route("/get-company-news").post(getCompanyNews);
router.route("/get-insights").post(getInsights);
router.route("/autocomplete/:ticker").get(autoComplete);

export default router;