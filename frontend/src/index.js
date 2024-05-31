import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.js";
import CheckoutPage from "./MainMenu/Payment/Checkout.js";
import { SuccessPage } from "./MainMenu/Payment/Success.js";
import FailPage from "./MainMenu/Payment/Fail.js";
import reportWebVitals from "./reportWebVitals.js";
import LoginScreen from "./MainMenu/Login/Loginscreen.js"; // 대소문자 수정
import RegisterScreen from "./MainMenu/Regeister/RegisterScreen.js"; // 회원가입 페이지 import

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="/sandbox/success" element={<SuccessPage />} />
        <Route path="/sandobx/fail" element={<FailPage />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />{" "}
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
