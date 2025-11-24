import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import ratingRouter from "./routes/ratingRoute.js";
import * as dotenv from 'dotenv'; 

// Load environment variables
dotenv.config();

// app config
const app = express();
const port = process.env.PORT || 4000;

// --- SỬA ĐOẠN NÀY ĐỂ FIX LỖI UPLOAD ẢNH (QUAN TRỌNG) ---
// Tăng giới hạn payload lên 50mb để nhận được ảnh base64 lớn
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// -------------------------------------------------------

app.use(cors());

// DB connection
connectDB();

// API endpoints
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/rating", ratingRouter);

// Static files (nếu bạn có dùng upload file vào thư mục)
app.use("/images", express.static("uploads"));

// Root endpoint
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});