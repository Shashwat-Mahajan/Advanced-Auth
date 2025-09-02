const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const { connectDb } = require("./db/connectDb");
const cors = require("cors");

dotenv.config();

 
const authRoutes = require("./routes/auth.route");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());

app.use(cookieParser());


app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectDb();
  console.log(`Server running on port ${PORT}`);
});
