import React, { useEffect, useRef, useState } from "react";
import { loadPaymentWidget, ANONYMOUS } from "@tosspayments/payment-widget-sdk";
import "./style.css";

const generateRandomString = () => window.btoa(Math.random()).slice(0, 20);

const CheckOut = ({ totalPrice, onClose }) => {
  const paymentWidgetRef = useRef(null);
  const [isPaymentWidgetReady, setIsPaymentWidgetReady] = useState(false);

  const handleClickPaymentButton = async () => {
    try {
      const paymentWidget = paymentWidgetRef.current;
      if (!paymentWidget) {
        throw new Error("결제 위젯이 초기화되지 않았습니다.");
      }
      await paymentWidget.requestPayment({
        orderId: generateRandomString(),
        orderName: "토스 티셔츠 외 2건",
        successUrl: window.location.origin + "/sandbox/success",
        failUrl: window.location.origin + "/sandbox/fail",
      });
    } catch (error) {
      console.error("결제 요청 실패:", error);
      alert("결제 수단을 선택하지 않았습니다. 결제 수단을 선택해 주세요.");
    }
  };

  useEffect(() => {
    const initializePaymentWidget = async () => {
      try {
        const paymentWidget = await loadPaymentWidget(
          "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm",
          ANONYMOUS
        );

        paymentWidgetRef.current = paymentWidget;

        paymentWidget.renderPaymentMethods(
          "#payment-method",
          { value: totalPrice },
          { variantKey: "DEFAULT" }
        );

        paymentWidget.renderAgreement("#agreement", { variantKey: "DEFAULT" });

        setIsPaymentWidgetReady(true); // 결제 위젯이 초기화되었음을 설정합니다.
      } catch (error) {
        console.error("결제 위젯 초기화 실패:", error);
      }
    };

    initializePaymentWidget();
  }, [totalPrice]);

  return (
    <div className="wrapper w-100">
      <div className="max-w-540 w-100">
        <div id="payment-method" className="w-100" />
        <div id="agreement" className="w-100" />
        <div className="btn-wrapper w-100">
          <button className="btn secondary w-100" onClick={onClose}>
            취소
          </button>
          <button
            className="btn primary w-100"
            onClick={handleClickPaymentButton}
            disabled={!isPaymentWidgetReady} // 결제 위젯이 준비되지 않은 경우 버튼 비활성화
          >
            {totalPrice.toLocaleString()}원 결제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
