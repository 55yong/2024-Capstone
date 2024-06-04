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
    sessionStorage.removeItem("username");
    setIsLoggedIn(false);
    alert("성공적으로 로그아웃 되었습니다!");
    window.location.reload(); // 페이지 새로고침 추가
  };

  const handleDeleteAccountClick = () => {
    const username = sessionStorage.getItem("username"); // 저장된 사용자 이름 가져오기
    const password = prompt("비밀번호를 입력하세요:"); // 비밀번호 입력 받기

    fetch("/delete_account", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "회원 탈퇴가 완료되었습니다.") {
          sessionStorage.clear();
          alert("회원 탈퇴가 완료되었습니다.");
          window.location.reload(); // 페이지 새로고침 추가
        } else {
          alert("회원 탈퇴에 실패하였습니다: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleUpdateProfileClick = () => {
    navigate("/update-profile");
  };

  return (
    <div>
      {isLoggedIn ? (
        <>
          <button className="button" onClick={handleLogoutClick}>
            로그아웃
          </button>
          <button className="button" onClick={handleUpdateProfileClick}>
            회원수정
          </button>
          <button className="button" onClick={handleDeleteAccountClick}>
            회원탈퇴
          </button>
        </>
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