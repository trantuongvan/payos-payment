import { useState } from 'react'
import "./Card.css";
const Card = ({price}) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
        setIsProcessing(true);

        try {
            // Chuyển chuỗi giá tiền (ví dụ: "1000") thành kiểu số nguyên (Number)
            const numericAmount = parseInt(price);

            // Bắn request POST sang Backend Node.js đang chạy ở cổng 8080
            const response = await fetch('http://192.168.10.19:8080/api/create-payment-link', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount: numericAmount }) // Gửi số tiền lên Backend
            });

            const data = await response.json();

            // Nếu Backend trả về đường link checkout của PayOS thành công
            if (data.checkoutUrl) {
                // Lập tức chuyển hướng trình duyệt sang trang quét mã QR của PayOS
                window.location.href = data.checkoutUrl;
            } else {
                alert('Không thể tạo mã thanh toán!');
            }
        } catch (err) {
            console.error("Lỗi kết nối:", err);
            alert('Không thể kết nối tới máy chủ Backend!');
        } finally {
            setIsProcessing(false);
        }
    };
    return (
        <div className="card">
            <div className="container-img">
                <div className="img"></div>
            </div>
            <p className="card__price">{price}</p>
            <button type="button" onClick={handlePayment}>
                {isProcessing ? "Đang xử lý..." : "Mua vé"}
            </button>
        </div>
    )
}

export default Card