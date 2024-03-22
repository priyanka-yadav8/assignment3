import express from "express";
import { getWatchlist, addToWatchlist, removeFromWatchlist } from "../controllers/watchlistController.js";

const router = express.Router();

router.route("/get-watchlist").get(getWatchlist);
router.route("/add-to-watchlist").post(addToWatchlist);
router.route("/remove-from-watchlist").delete(removeFromWatchlist);

export default router;
