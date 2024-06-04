import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Css/UpdateProfileScreen.css";

const UpdateProfileScreen = () => {
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("/get_user_info");
        if (response.status === 200) {
          setUsername(response.data.username);
          setNickname(response.data.nickname);
          setPhone(response.data.phone);
          setEmail(response.data.email);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

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

  const validatePassword = (password) => {
    const regex = /^[a-zA-Z0-9!@#$%^&*()_+=-]{4,15}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateNickname(nickname)) {
      alert("닉네임은 2자에서 12자 사이로 입력해주세요.");
      return;
    }

    if (!validatePhone(phone)) {
      alert("전화번호는 010-xxxx-xxxx 형식으로 입력해주세요.");
      return;
    }

    if (!validateEmail(email)) {
      alert(
        "이메일은 gmail.com, naver.com, daum.net 도메인만 사용할 수 있습니다."
      );
      return;
    }

    if (newPassword && !validatePassword(newPassword)) {
      alert(
        "비밀번호는 4자에서 15자 사이의 숫자와 문자, 특수문자만 사용할 수 있습니다."
      );
      return;
    }

    try {
      const response = await axios.put("/update_profile", {
        nickname,
        phone,
        email,
        currentPassword,
        newPassword,
      });

      if (response.status === 200) {
        alert("프로필 업데이트가 완료되었습니다.");
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("서버 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="update-profile-container">
      <form className="update-profile-form" onSubmit={handleSubmit}>
        <h2>Update Profile</h2>
        {error && <p className="error-message">{error}</p>}
        <div>
          <input
            type="text"
            placeholder="아이디"
            value={username}
            disabled // 아이디는 수정할 수 없도록 비활성화
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
        <div>
          <input
            type="password"
            placeholder="현재 비밀번호"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="새 비밀번호 (선택 사항)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <button type="submit">프로필 업데이트</button>
        <button type="button" onClick={() => navigate(-1)}>
          돌아가기
        </button>
      </form>
    </div>
  );
};

export default UpdateProfileScreen;