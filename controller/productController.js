import mongoose from "mongoose";
import Product from "../models/productModel.js";

// Builds a fully-qualified image URL from the ACTUAL incoming request
// (protocol + host), instead of depending on a PUBLIC_API_URL env var that
// was never set in .env. This is always correct — in dev, behind a proxy,
// or in production — with zero extra configuration.
function buildImageUrl(req, id) {
  return `${req.protocol}://${req.get("host")}/api/products/${id}/image`;
}

// Only trust a stored imageUrl when it's a genuinely absolute http(s) URL.
// A bare relative path like "/xvox.jpg" is ambiguous — it only resolves
// correctly against ONE specific origin (wherever that static file lives),
// and silently breaks when a consumer resolves it against a different
// origin (e.g. the API's own host instead of the frontend's). Rather than
// let that ambiguity leak out to every consumer, we normalize it here:
// either return a real absolute URL, or always fall back to the Mongo-backed
// /api/products/:id/image route, which works from any origin.
function serialize(product, req) {
  const item = product.toObject ? product.toObject() : { ...product };
  const id = item._id.toString();
  const isAbsoluteUrl = typeof item.imageUrl === "string" && /^https?:\/\//i.test(item.imageUrl);

  return {
    id,
    name: item.name,
    title: item.name,
    description: item.description || "",
    downloadLink: item.downloadLink,
    status: item.status,
    image: isAbsoluteUrl ? item.imageUrl : buildImageUrl(req, id),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export async function getPublicProducts(req, res) {
  try {
    const products = await Product.find({ status: "Active" })
      .select("-imageData")
      .sort({ createdAt: -1 });

    return res.status(200).json({ data: products.map((p) => serialize(p, req)) });
  } catch (error) {
    console.error("Get public products error:", error);
    return res.status(500).json({ error: "Failed to fetch products" });
  }
}

export async function getPublicProductById(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      status: "Active",
    }).select("-imageData");

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({ data: serialize(product, req) });
  } catch (error) {
    console.error("Get public product error:", error);
    return res.status(500).json({ error: "Failed to fetch product" });
  }
}

export async function getProductImage(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).end();
    }

    const product = await Product.findOne({
      _id: req.params.id,
      status: "Active",
    }).select("+imageData imageContentType");

    if (!product?.imageData) {
      return res.status(404).end();
    }

    res.set("Content-Type", product.imageContentType || "image/jpeg");
    res.set("Cache-Control", "public, max-age=86400");
    return res.send(product.imageData);
  } catch (error) {
    console.error("Get product image error:", error);
    return res.status(500).end();
  }
}