
import express from "express";
import bcrypt from "bcryptjs";

const router = express.Router();

router.get("/list", async (req, res) => {
  const db = req.app.locals.db;
  try {
    const users = await db.collection("users").find({}).toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});


router.post("/add", async (req, res) => {
  const db = req.app.locals.db;
  const {
    name,
    email,
    password,
    role,
    permissions
  } = req.body;

  try {

    const exists = await db.collection("users").findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "User already exists" });
    }
 
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      name,
      email,
      password: hashedPassword,
      role,
      permissions,
      status: "active",
      lastLogin: "Never",
      createdAt: new Date().toISOString().split('T')[0]
    };
    await db.collection("users").insertOne(user);
    res.json({ message: "User added successfully", user });
  } catch (err) {
    res.status(500).json({ error: "Failed to add user" });
  }
});

export default router;
