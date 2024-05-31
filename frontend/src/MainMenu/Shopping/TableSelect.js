import React, { useState, useEffect, useRef } from "react";
import "./ShoppingCss/TableSelect.css";
import Modal from "react-modal";
import Payment from "./Payment.js";

const TableSelect = ({ onClose, totalPrice, onCheckout }) => {
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tablePrices, setTablePrices] = useState({}); // Store prices for each table
  const [disabledTables, setDisabledTables] = useState([]);
  const intervalRef = useRef({}); // Ref for storing interval IDs

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

  const handleTableClick = (tableNumber) => {
    setSelectedTable(tableNumber);
  };

  const Select_btn = () => {
    if (selectedTable !== null) {
      // Calculate total duration based on totalPrice
      const totalDuration = calculateTotalDuration(totalPrice);

      // Set end time for table's disable period
      const endTime = new Date(new Date().getTime() + totalDuration);

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

  const isTableDisabled = (tableNumber) => {
    return disabledTables.includes(tableNumber);
  };

  const handleUsageEnd = (tableNumber) => {
    clearTimeoutCountdown(tableNumber);
    setSelectedTable(null); // Reset selected table
    alert(`테이블 ${tableNumber}의 사용이 종료되었습니다.`);
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
                {isTableDisabled(2) && (
                  <button
                    className="Usage_end_btn"
                    onClick={() => handleUsageEnd(2)}
                  >
                    사용종료
                  </button>
                )}

                {isTableDisabled(4) && (
                  <button
                    className="Usage_end_btn"
                    onClick={() => handleUsageEnd(4)}
                  >
                    사용종료
                  </button>
                )}

                {isTableDisabled(6) && (
                  <button
                    className="Usage_end_btn"
                    onClick={() => handleUsageEnd(6)}
                  >
                    사용종료
                  </button>
                )}
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
