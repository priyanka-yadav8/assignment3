import express from "express";
import { getPortfolio, addToPortfolio, updatePorfolio, removeFromPortfolio, getOneStockPortfolio} from "../controllers/portfolioController.js";

const router = express.Router();

router.route("/get-portfolio").get(getPortfolio);
router.route("/add-to-portfolio").post(addToPortfolio);
router.route("/update-portfolio/:ticker").patch(updatePorfolio);
router.route("/remove-from-portfolio/:ticker").delete(removeFromPortfolio);
router.route("/get-one-stock-portfolio/:ticker").get(getOneStockPortfolio);

export default router;
