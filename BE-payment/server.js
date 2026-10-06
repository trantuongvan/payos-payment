require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { PayOS } = require("@payos/node");

const app = express();

app.use(cors());
app.use(express.json());

const payos = new PayOS({
  clientId: process.env.PAYOS_CLIENT_ID,
  apiKey: process.env.PAYOS_API_KEY,
  checksumKey: process.env.PAYOS_CHECKSUM_KEY,
});
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

    const paymentLink = await payos.paymentRequests.create(order);

    res.json({ checkoutUrl: paymentLink.checkoutUrl });
  } catch (error) {
    console.error("Lỗi tạo link thanh toán:", error.message);
    res.status(500).json({ error: "Không thể tạo mã thanh toán" });
  }
});

app.post("/api/payos-webhook", (req, res) => {
  try {
    const webhookData = req.body;
    console.log("🔔 Nhận được Webhook từ PayOS:", webhookData);

    res.json({
      success: true,
      message: "Đã nhận webhook thành công",
    });
  } catch (error) {
    console.error("Lỗi xử lý webhook:", error.message);
    res.status(500).json({ error: "Lỗi server nội bộ" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🔥 Backend Server đang chạy ngon lành trên cổng ${PORT}`);
});
