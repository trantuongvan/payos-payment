// Đọc các biến bảo mật từ file .env lên
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { PayOS } = require("@payos/node");

const app = express();

// Cho phép Frontend React gọi API vào đây
app.use(cors());
app.use(express.json());

const payos = new PayOS({
  clientId: process.env.PAYOS_CLIENT_ID,
  apiKey: process.env.PAYOS_API_KEY,
  checksumKey: process.env.PAYOS_CHECKSUM_KEY,
});
// console.log(payos);
// console.log(
//   "Các hàm có sẵn của payos:",
//   Object.getOwnPropertyNames(Object.getPrototypeOf(payos)),
// );
app.post("/api/create-payment-link", async (req, res) => {
  try {
    const amountFromClient = req.body.amount || 50000;

    const order = {
      orderCode: Number(String(new Date().getTime()).slice(-6)),
      amount: amountFromClient,
      description: "VE SU KIEN",
      returnUrl: "http://192.168.10.19:5173/?status=success",
      cancelUrl: "http://192.168.10.19:5173/?status=cancel",
    };

    // Gọi sang hệ thống PayOS để tạo đường dẫn thanh toán chứa mã QR
    const paymentLink = await payos.paymentRequests.create(order);

    // Trả cái link đó ngược về cho giao diện React
    res.json({ checkoutUrl: paymentLink.checkoutUrl });
  } catch (error) {
    console.error("Lỗi tạo link thanh toán:", error.message);
    res.status(500).json({ error: "Không thể tạo mã thanh toán" });
  }
});

// Chạy server trên cổng 8080
app.listen(8080, () => {
  console.log(
    "🔥 Backend Server đang chạy ngon lành tại http://localhost:8080",
  );
});
