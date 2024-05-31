import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Css/LoginScreen.css"; // CSS 파일 import

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "로그인 성공!") {
          sessionStorage.setItem("isLoggedIn", true);
          sessionStorage.setItem("nickname", data.nickname); // 서버에서 닉네임 받아오기
          alert("로그인 성공!");
          navigate("/"); // 메인 페이지로 리다이렉트
        } else {
          alert("로그인 정보가 잘못되었습니다.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div>
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">로그인</button>
        <a href="/" className="forgot-password">
          비밀번호를 잊으셨나요?
        </a>
        <a href="/register" className="register-link">
          아이디가 없으신가요? 회원가입
        </a>
      </form>
    </div>
  );
};

export default LoginScreen;
