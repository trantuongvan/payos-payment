import { useState } from 'react'
import "./Card.css";
const Card = ({price}) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
        setIsProcessing(true);

        try {
            const numericAmount = parseInt(price);
            const response = await fetch('https://payos-payment.onrender.com/api/create-payment-link', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount: numericAmount })
            });

            const data = await response.json();

            if (data.checkoutUrl) {
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