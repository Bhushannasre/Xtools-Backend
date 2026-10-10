import express from "express";
import {
  getPublicProducts,
  getPublicProductById,
  getProductImage,
} from "../controller/productController.js";

const router = express.Router();

router.get("/products", getPublicProducts);
router.get("/products/:id", getPublicProductById);
router.get("/products/:id/image", getProductImage);

export default router;
