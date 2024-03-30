import express from "express";
import { getWallet, updateWallet } from "../controllers/walletController.js";

const router = express.Router();

router.route("/get-wallet").get(getWallet);
router.route("/update-wallet").patch(updateWallet);

export default router;
