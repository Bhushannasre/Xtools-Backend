import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    downloadLink: String,
    imageUrl: String,
    imageData: {
      type: Buffer,
      select: false,
    },
    imageContentType: String,
    status: {
      type: String,
      enum: ["Active", "Inactive"],
    },
  },
  {
    timestamps: true,
    collection: "products",
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
