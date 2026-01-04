import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey";

router.post("/login", async (req, res) => {
    const db = req.app.locals.db;
    const { email, password } = req.body;

    try {
        const user = await db.collection("users").findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: "1d"
        });

        // آپدیت زمان آخرین ورود
        await db.collection("users").updateOne(
            { _id: user._id },
            { $set: { lastLogin: new Date().toISOString() } }
        );

        res.json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json({ error: "Login failed" });
    }
});

export default router;
