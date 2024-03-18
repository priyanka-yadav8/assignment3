import express from "express";
import { stockDetails } from "../controllers/stockDetailsController.js";

const router = express.Router();

router.route("/get-stock-details").get(stockDetails);

export default router;