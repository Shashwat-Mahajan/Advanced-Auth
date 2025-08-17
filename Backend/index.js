const express = require("express");
const dotenv = require("dotenv");
const { connectDb } = require("./db/connectDb");

dotenv.config();

const authRoutes = require("./routes/auth.route");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectDb();
  console.log(`Server running on port ${PORT}`);
});
