import React, { useState, useEffect } from "react";
import "./ShoppingCss/PaymentScreen.css";
import creditCardIcon from "../Shopping/images/credit_card.png"; // 아이콘 경로
import cashIcon from "../Shopping/images/cash.png"; // 아이콘 경로

function Payment({ totalPrice, onCheckout, onClose }) {
  const [selectedMethod, setSelectedMethod] = useState(""); // 선택된 결제 방식
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const [username, setUsername] = useState(null); // 사용자 이름

  useEffect(() => {
    // 로그인된 사용자 정보를 sessionStorage에서 가져오기
    const storedUsername = sessionStorage.getItem("username");
    const loggedIn = sessionStorage.getItem("isLoggedIn");

    if (loggedIn && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const addMileage = async (username) => {
    try {
      const response = await fetch("/add_mileage", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, mileage: 100 }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data.message); // 마일리지 적립이 정상적으로 처리되었을 때 콘솔에 출력
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("마일리지 적립 중 에러 발생:", error);
    }
  };

  const handlePaymentSubmit = async () => {
    try {
      if (selectedMethod === "CREDITCARD") {
        console.log("카드 결제 처리");
        alert("결제가 완료되었습니다.");
        window.location.reload(); // 페이지 새로고침
      } else if (selectedMethod === "MOBILE") {
        console.log("모바일 결제 처리");
        if (isLoggedIn) {
          await addMileage(username); // 100원 마일리지 적립
        }
        onCheckout(totalPrice); // onCheckout 함수 호출
        onClose(); // 모달 닫기
      } else {
        console.log("결제 방식을 선택해주세요.");
      }
    } catch (error) {
      console.error("결제 처리 중 에러 발생:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await handlePaymentSubmit(); // handlePaymentSubmit 함수를 async로 호출하여 마일리지 적립 완료까지 기다림
  };

  return (
    <div className="Modal-Content">
      <div className="Modal-Header">
        <h2>결제 방식 선택</h2>
        <span className="Close" onClick={onClose}>
          &times;
        </span>
      </div>
      <div className="payment-options">
        <div
          className={`payment-box ${
            selectedMethod === "MOBILE" ? "selected" : ""
          }`}
          onClick={() => setSelectedMethod("MOBILE")}
        >
          <img src={cashIcon} alt="모바일결제" />
          모바일결제
        </div>
        <div
          className={`payment-box ${
            selectedMethod === "CREDITCARD" ? "selected" : ""
          }`}
          onClick={() => setSelectedMethod("CREDITCARD")}
        >
          <img src={creditCardIcon} alt="카드결제" />
          카드결제
        </div>
      </div>
      <div className="total-amount">
        총 결제금액 <span>{totalPrice}원</span>
      </div>
      <form onSubmit={handleSubmit}>
        <button type="submit">결제하기</button>
      </form>
    </div>
  );
}

export default Payment;