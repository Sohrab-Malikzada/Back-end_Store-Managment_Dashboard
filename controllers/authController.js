import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Login a user and return a JWT token
export async function login(req, res) {
  const { email, password } = req.body;
  const db = req.app.locals.db;

  try {
    // Find user by email
    const user = await db.collection("users").findOne({ email });
    console.log("User from DB:", user);
    console.log("Password from request:", password);
    if (!user) {
      console.log("User not found!");
      return res.status(401).json({ error: "Invalid email or password" });
    }
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    // If password does not match
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    // Return token and user info , excluding password from response.
    res.json({ token, user: { email: user.email, role: user.role } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
}