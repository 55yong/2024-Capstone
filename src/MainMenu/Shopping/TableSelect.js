import React, { useState, useEffect, useRef } from "react";
import "./ShoppingCss/TableSelect.css";
import Modal from "react-modal";
import Payment from "./Payment.js";

const TableSelect = ({ onClose, totalPrice, onCheckout }) => {
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [disabledTables, setDisabledTables] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const [username, setUsername] = useState(null); // 사용자 이름
  const intervalRef = useRef({});

  // Load disabled tables from local storage on component mount
  useEffect(() => {
    const savedDisabledTables =
      JSON.parse(localStorage.getItem("disabledTables")) || [];
    const updatedDisabledTables = savedDisabledTables.filter((table) => {
      const endTime = localStorage.getItem(`table_${table}_endTime`);
      if (endTime && new Date(endTime) > new Date()) {
        return true;
      } else {
        localStorage.removeItem(`table_${table}_endTime`);
        return false;
      }
    });
    setDisabledTables(updatedDisabledTables);
    console.log("Loaded disabled tables:", updatedDisabledTables);
  }, []);

  // Automatically enable tables when their disable time is reached
  useEffect(() => {
    const intervals = disabledTables.map((table) => {
      const endTime = new Date(localStorage.getItem(`table_${table}_endTime`));
      const remainingTime = endTime - new Date();
      return setTimeout(() => {
        setDisabledTables((prev) => prev.filter((t) => t !== table));
        localStorage.removeItem(`table_${table}_endTime`);
      }, remainingTime);
    });

    // Store interval IDs in intervalRef
    intervals.forEach((interval, index) => {
      intervalRef.current[disabledTables[index]] = interval;
    });

    return () => intervals.forEach(clearTimeout);
  }, [disabledTables]);

  useEffect(() => {
    // 로그인된 사용자 정보를 sessionStorage에서 가져오기
    const storedUsername = sessionStorage.getItem("username");
    const loggedIn = sessionStorage.getItem("isLoggedIn");

    if (loggedIn && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleTableClick = (tableNumber) => {
    setSelectedTable(tableNumber);
  };

  const Select_btn = () => {
    if (selectedTable !== null) {
      // Calculate total duration based on totalPrice
      const totalDuration = calculateTotalDuration(totalPrice);

      // Set end time for table's disable period
      const endTime = new Date(new Date().getTime() + totalDuration);
      console.log(`End time for table ${selectedTable}:`, endTime);

      // Update disabled tables
      const updatedDisabledTables = [...disabledTables, selectedTable];
      setDisabledTables(updatedDisabledTables);

      localStorage.setItem(
        "disabledTables",
        JSON.stringify(updatedDisabledTables)
      );
      localStorage.setItem(`table_${selectedTable}_endTime`, endTime);

      // Close modal and show payment modal
      setModalIsOpen(false);
      setShowPayment(true);
    } else {
      alert("테이블을 선택해주세요.");
    }
  };

  const calculateTotalDuration = (price) => {
    let duration = 0;
    const basePrice = 4000;
    const additionalPrice = 500;

    if (price >= basePrice) {
      // Calculate base duration (2 hours)
      duration += 2 * 60 * 60 * 1000; // 2 hours in milliseconds
      // Calculate additional duration
      const additionalAmount = Math.floor(
        (price - basePrice) / additionalPrice
      );
      duration += additionalAmount * 30 * 60 * 1000; // 30 minutes per 500 won in milliseconds
    }

    return duration;
  };

  const addMileage = async (username, mileage) => {
    try {
      const response = await fetch("/add_mileage", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, mileage }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data.message); // Log success message
      } else {
        console.error(data.message); // Log error message from server
      }
    } catch (error) {
      console.error("마일리지 적립 중 에러 발생:", error);
    }
  };

  const isTableDisabled = (tableNumber) => {
    const result = disabledTables.includes(tableNumber);
    console.log(`Is table ${tableNumber} disabled?`, result);
    return result;
  };

  const handleUsageEnd = async (tableNumber) => {
    const remainingTime = calculateRemainingTime(tableNumber); // Get the remaining time
    if (remainingTime > 0) {
      const mileage = Math.floor(remainingTime / 60000) * 10; // 10 won for every minute
      if (isLoggedIn) {
        await addMileage(username, mileage); // Add the calculated mileage
      }
    }
    clearTimeoutCountdown(tableNumber);
    setSelectedTable(null); // Reset selected table
    alert(`테이블 ${tableNumber}의 사용이 종료되었습니다.`);
  };

  const calculateRemainingTime = (tableNumber) => {
    const endTime = new Date(
      localStorage.getItem(`table_${tableNumber}_endTime`)
    );
    const remainingTime = endTime - new Date();
    return remainingTime > 0 ? remainingTime : 0;
  };

  const clearTimeoutCountdown = (tableNumber) => {
    // Clear countdown interval
    const endTimeKey = `table_${tableNumber}_endTime`;
    const remainingTime = localStorage.getItem(endTimeKey);
    if (remainingTime) {
      clearTimeout(intervalRef.current[tableNumber]);
      localStorage.removeItem(endTimeKey);
      // Remove the table from disabledTables state
      setDisabledTables((prev) => prev.filter((t) => t !== tableNumber));
    }
  };

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={onClose}
        className="Table-modal"
        overlayClassName="Table-overlay"
      >
        <div className="Table_title">
          <h1>테이블 선택</h1>
        </div>
        <div className="Table_number">
          <table>
            <tbody>
              <tr>
                <td>
                  <button
                    onClick={() => handleTableClick(1)}
                    className={selectedTable === 1 ? "selected" : ""}
                    disabled={isTableDisabled(1)}
                  >
                    1
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleTableClick(3)}
                    className={selectedTable === 3 ? "selected" : ""}
                    disabled={isTableDisabled(3)}
                  >
                    3
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleTableClick(5)}
                    className={selectedTable === 5 ? "selected" : ""}
                    disabled={isTableDisabled(5)}
                  >
                    5
                  </button>
                </td>
              </tr>

              <tr>
                <td>
                  {isTableDisabled(1) && (
                    <button
                      className="Usage_end_btn"
                      onClick={() => handleUsageEnd(1)}
                    >
                      사용종료
                    </button>
                  )}
                </td>

                <td>
                  {isTableDisabled(3) && (
                    <button
                      className="Usage_end_btn"
                      onClick={() => handleUsageEnd(3)}
                    >
                      사용종료
                    </button>
                  )}
                </td>

                <td>
                  {isTableDisabled(5) && (
                    <button
                      className="Usage_end_btn"
                      onClick={() => handleUsageEnd(5)}
                    >
                      사용종료
                    </button>
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <button
                    onClick={() => handleTableClick(2)}
                    className={selectedTable === 2 ? "selected" : ""}
                    disabled={isTableDisabled(2)}
                  >
                    2
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleTableClick(4)}
                    className={selectedTable === 4 ? "selected" : ""}
                    disabled={isTableDisabled(4)}
                  >
                    4
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleTableClick(6)}
                    className={selectedTable === 6 ? "selected" : ""}
                    disabled={isTableDisabled(6)}
                  >
                    6
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  {isTableDisabled(2) && (
                    <button
                      className="Usage_end_btn"
                      onClick={() => handleUsageEnd(2)}
                    >
                      사용종료
                    </button>
                  )}
                </td>

                <td>
                  {isTableDisabled(4) && (
                    <button
                      className="Usage_end_btn"
                      onClick={() => handleUsageEnd(4)}
                    >
                      사용종료
                    </button>
                  )}
                </td>
                <td>
                  {isTableDisabled(6) && (
                    <button
                      className="Usage_end_btn"
                      onClick={() => handleUsageEnd(6)}
                    >
                      사용종료
                    </button>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button className="Select_btn" onClick={Select_btn}>
          선택완료
        </button>
      </Modal>
      {showPayment && (
        <Modal
          isOpen={showPayment}
          onRequestClose={() => setShowPayment(false)}
          className="Payment-modal"
          overlayClassName="Payment-overlay"
        >
          <Payment
            totalPrice={totalPrice}
            onCheckout={onCheckout}
            onClose={() => setShowPayment(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default TableSelect;