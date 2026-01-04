import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: String,
    sku: String,
    category: String,
    stockLevel: Number,
    minStock: Number,
    salePrice: Number,
});

export default mongoose.model("Product", productSchema);
