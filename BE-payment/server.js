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
      returnUrl: "https://payos-payment.vercel.app/?status=success",
      cancelUrl: "https://payos-payment.vercel.app/?status=cancel",
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

// API để đón Webhook từ PayOS gọi về
app.post("/api/payos-webhook", (req, res) => {
  try {
    // Lấy dữ liệu PayOS gửi sang
    const webhookData = req.body;
    console.log("🔔 Nhận được Webhook từ PayOS:", webhookData);

    // Bắt buộc phải trả về mã 200 JSON để hệ thống PayOS ghi nhận là cấu hình thành công
    res.json({
      success: true,
      message: "Đã nhận webhook thành công",
    });

    // (Sau này khi có Database, bạn sẽ lấy webhookData.data.orderCode ra để update trạng thái vé thành 'Đã thanh toán' tại đây)
  } catch (error) {
    console.error("Lỗi xử lý webhook:", error.message);
    res.status(500).json({ error: "Lỗi server nội bộ" });
  }
});

// Chạy server trên cổng 8080
app.listen(8080, () => {
  console.log(
    "🔥 Backend Server đang chạy ngon lành tại https://payos-payment.onrender.com",
  );
});
