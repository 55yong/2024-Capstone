import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom"; // Import useNavigate
import "./style.css";

export function SuccessPage() {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [searchParams] = useSearchParams();
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const navigate = useNavigate(); // Initialize useNavigate

  async function confirmPayment() {
    try {
      const response = await fetch("/sandbox-dev/api/v1/payments/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount,
        }),
      });

      if (response.ok) {
        setIsConfirmed(true);
      } else {
        const responseData = await response.json();
        throw new Error(responseData.error || "결제 승인 실패");
      }
    } catch (error) {
      console.error("API 요청 오류:", error);
      // 사용자에게 에러 메시지를 표시하는 등의 작업 수행
    }
  }

  return (
    <div className="wrapper w-100">
      {isConfirmed ? (
        <div
          className="flex-column align-center confirm-success w-100 max-w-540"
          style={{
            display: "flex",
          }}
        >
          <img
            src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
            width="120"
            height="120"
            alt="체크 이미지"
          />
          <h2 className="title">결제를 완료했어요</h2>
          <div className="response-section w-100">
            <div className="flex justify-between">
              <span className="response-label">결제 금액</span>
              <span id="amount" className="response-text">
                {amount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="response-label">주문번호</span>
              <span id="orderId" className="response-text">
                {orderId}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="response-label">paymentKey</span>
              <span id="paymentKey" className="response-text">
                {paymentKey}
              </span>
            </div>
          </div>

          <div className="w-100 button-group">
            <div className="flex" style={{ gap: "16px" }}>
              <button className="btn w-100" onClick={() => navigate("/")}>
                메인으로 가기
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-column align-center confirm-loading w-100 max-w-540">
          <div className="flex-column align-center">
            <img
              src="https://static.toss.im/lotties/loading-spot-apng.png"
              width="120"
              height="120"
              alt="로딩 이미지"
            />
            <h2 className="title text-center">결제 요청까지 성공했어요.</h2>
            <h4 className="text-center description">
              결제 승인하고 완료해보세요.
            </h4>
          </div>
          <div className="w-100">
            <button className="btn primary w-100" onClick={confirmPayment}>
              결제 승인하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuccessPage;
