import { ObjectId } from "mongodb";

// Get all products from the database and return as JSON response.
export async function getAllProducts(req, res) {
  try {
    const db = req.app.locals.db;
    const products = await db.collection("products").find().toArray();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
}

// Create a new product in the database and return its ID.
export async function createProduct(req, res) {
  try {
    const db = req.app.locals.db;
    const newProduct = req.body;

    const result = await db.collection("products").insertOne(newProduct);
    res.status(201).json({
      message: "Product created successfully",
      productId: result.insertedId,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to add product" });
  }
}

// Update an existing product in the database and handle non-existing product case.
export async function updateProduct(req, res) {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    const updatedData = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const result = await db
      .collection("products")
      .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
}

// Delete a product from the database.  
export async function deleteProduct(req, res) {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const result = await db.collection("products").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
}

// Adjust stock level for a product and update last restocked date , also do the necessary validations
export async function adjustStock(req, res) {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    const { amount, type } = req.body; // type: "add" یا "remove"

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await db.collection("products").findOne({ _id: new ObjectId(id) });
    if (!product) return res.status(404).json({ error: "Product not found" });

    let newStock = product.stockLevel || 0;
    if (type === "add") newStock += Number(amount);
    else if (type === "remove") newStock -= Number(amount);

    await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $set: { stockLevel: newStock, lastRestocked: new Date().toISOString() } }
    );

    res.json({ message: "Stock adjusted successfully", newStock });
  } catch (err) {
    res.status(500).json({ error: "Failed to adjust stock" });
  }
}
// GET /inventory/value
export async function getInventoryValue(req, res) {
  try {
    const db = req.app.locals.db;
    const agg = await db.collection("products").aggregate([
      {
        $project: {
          stockLevel: { $ifNull: ["$stockLevel", 0] },
          purchasePrice: { $ifNull: ["$purchasePrice", 0] },
          value: { $multiply: [{ $toDouble: "$stockLevel" }, { $toDouble: "$purchasePrice" }] }
        }
      },
      {
        $group: {
          _id: null,
          totalInventoryValue: { $sum: "$value" }
        }
      }
    ]).toArray();

    const total = agg[0]?.totalInventoryValue || 0;
    res.json({ totalInventoryValue: total });
  } catch (err) {
    console.error("getInventoryValue error:", err);
    res.status(500).json({ error: "Failed to compute inventory value" });
  }
}


