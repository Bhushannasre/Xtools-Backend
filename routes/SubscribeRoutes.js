import express from "express";
import subscribeUser from "../controller/subscribeController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/subscribe", requireAuth, subscribeUser);

export default router;