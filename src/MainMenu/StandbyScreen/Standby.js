import React, { useState } from "react";
import './Standby.css'

function Standby({ onTransition }) {
  const [isTransitioned, setIsTransitioned] = useState(false);

  const handleTransition = () => {
    setIsTransitioned(true);
    onTransition(); // 메인 화면으로 전환하는 함수 호출
  };

  return (        
    <div className="Standby-Container" onClick={handleTransition}>
      <img src="/CaffeIcon/Standby.png" alt = "Standby"/>
    </div>
  );
}

export default Standby;

