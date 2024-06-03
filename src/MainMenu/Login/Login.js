import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Css/LoginButton.css"; // CSS 파일 import

const Login = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("isLoggedIn");
    if (loggedIn) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleLogoutClick = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("nickname");
    setIsLoggedIn(false);
    alert("성공적으로 로그아웃 되었습니다!");
    window.location.reload(); // 페이지 새로고침 추가
  };

  const handleBackClick = () => {
    History.go(-1);
  };

  return (
    <div>
      {isLoggedIn ? (
        <button className="button" onClick={handleLogoutClick}>
          로그아웃
        </button>
      ) : (
        <>
          <button className="button" onClick={handleLoginClick}>
            로그인
          </button>
          <button className="button" onClick={handleRegisterClick}>
            회원가입
          </button>
        </>
      )}
    </div>
  );
};

export default Login;
