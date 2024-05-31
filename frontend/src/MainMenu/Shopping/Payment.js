import React, { useState } from "react";
import "./ShoppingCss/PaymentScreen.css";

function Payment({ totalPrice, onCheckout, onClose }) {
  const [selectedMethod, setSelectedMethod] = useState(""); // 선택된 결제 방식

  const handlePaymentSubmit = async () => {
    try {
      // 선택된 결제 방식에 따라 해당 결제 함수 호출
      if (selectedMethod === "CREDITCARD") {
        // 카카오페이 결제 처리
        console.log("카드 결제처리");
      } else if (selectedMethod === "MOBILE") {
        // 토스페이먼츠 결제 처리
        console.log("모바일 결제 처리");
        onCheckout(totalPrice); // onCheckout 함수 호출
        onClose(); // 모달 닫기
      } else {
        console.log("결제 방식을 선택해주세요.");
      }
    } catch (error) {
      console.error("결제 처리 중 에러 발생:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handlePaymentSubmit();
  };

  return (
    <div className="Modal-Content">
      <span className="Close" onClick={onClose}>
        &times;
      </span>
      <h2>결제 방식 선택</h2>
      <form onSubmit={handleSubmit}>
        <label>
          결제 방식:
          <select
            value={selectedMethod}
            onChange={(event) => setSelectedMethod(event.target.value)}
            required
          >
            <option value="">결제 방식을 선택하세요</option>
            <option value="MOBILE">모바일결제</option>
            <option value="CREDITCARD">카드결제</option>
          </select>
        </label>
        <button type="submit">결제하기 ({totalPrice}원)</button>
      </form>
    </div>
  );
}

export default Payment;
