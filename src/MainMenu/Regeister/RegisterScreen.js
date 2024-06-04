import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Css/RegisterScreen.css"; // CSS 파일 import

const RegisterScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const validateUsername = (username) => {
    const regex = /^[a-zA-Z0-9!@#$%^&*()_+=-]{4,15}$/;
    return regex.test(username);
  };

  const validatePassword = (password) => {
    const regex = /^[a-zA-Z0-9!@#$%^&*()_+=-]{4,15}$/;
    return regex.test(password);
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|naver\.com|daum\.net)$/;
    return regex.test(email);
  };

  const validateNickname = (nickname) => {
    return nickname.length >= 2 && nickname.length <= 12;
  };

  const validatePhone = (phone) => {
    const regex = /^010-\d{4}-\d{4}$/;
    return regex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateUsername(username)) {
      alert(
        "아이디는 4자에서 15자 사이의 숫자와 문자, 특수문자만 사용할 수 있습니다."
      );
      return;
    }

    if (!validatePassword(password)) {
      alert(
        "비밀번호는 4자에서 15자 사이의 숫자와 문자, 특수문자만 사용할 수 있습니다."
      );
      return;
    }

    if (!validateEmail(email)) {
      alert(
        "이메일은 gmail.com, naver.com, daum.net 도메인만 사용할 수 있습니다."
      );
      return;
    }

    if (!validateNickname(nickname)) {
      alert("닉네임은 2자에서 12자 사이로 입력해주세요.");
      return;
    }

    if (!validatePhone(phone)) {
      alert("전화번호는 010-xxxx-xxxx 형식으로 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post("/register", {
        username,
        password,
        nickname,
        phone,
        email,
      });

      // 회원가입 성공 후 다음 페이지로 이동
      navigate("/login");
    } catch (error) {
      if (error.response) {
        // 서버 응답 오류 처리
        setError(error.response.data.message);
      } else {
        // 기타 오류 처리
        setError("서버 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <p className="error-message">{error}</p>}
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
        <div>
          <input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="전화번호"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit">회원가입</button>
        {/* eslint-disable-next-line no-restricted-globals */}
        <button type="button" onClick={() => history.back()}>
          돌아가기
        </button>
      </form>
    </div>
  );
};

export default RegisterScreen;