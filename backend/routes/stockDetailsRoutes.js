import express from "express";
import { getStockDetails, getCompanyNews, getInsights } from "../controllers/stockDetailsController.js";

const router = express.Router();

router.route("/get-stock-details").get(getStockDetails);
router.route("/get-company-news").get(getCompanyNews);
router.route("/get-insights").get(getInsights);

export default router;