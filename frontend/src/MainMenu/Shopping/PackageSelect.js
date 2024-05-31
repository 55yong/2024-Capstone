import React, { useState } from "react";
import "./ShoppingCss/PackageSelect.css";
import Modal from "react-modal";
import Meal from "./images/meal.png";
import Package from "./images/package.png";
import TableSelect from "./TableSelect.js";

const PackageSelect = ({ onClose, totalPrice, onCheckout }) => {
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [showTableSelect, setShowTableSelect] = useState(false);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleMealClick = () => {
    setShowTableSelect(true);
    closeModal(); // 상태 설정 후 모달 닫기
  };

  const handlePackageClick = () => {
    closeModal(); // 상태 설정 후 모달 닫기
  };

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="package-modal"
        overlayClassName="package-overlay"
        ariaHideApp={true}
      >
        <div className="package_title">
          <h1>포장 선택</h1>
        </div>
        <img
          className="Meal"
          src={Meal}
          alt="매장식사"
          onClick={handleMealClick}
          style={{ cursor: "pointer" }}
        />
        <img
          className="Package"
          src={Package}
          alt="테이크아웃"
          onClick={handlePackageClick}
          style={{ cursor: "pointer" }}
        />
      </Modal>
      {showTableSelect && (
        <TableSelect
          onClose={() => setShowTableSelect(false)}
          totalPrice={totalPrice}
          onCheckout={onCheckout}
        />
      )}
    </div>
  );
};

export default PackageSelect;
