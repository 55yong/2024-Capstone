import React from "react";
import "./MenuListCss/CoffeeCard.css";

const CoffeeCard = ({ name, image, description, price, onAddToCart }) => {
  const handleAddToCart = () => {
    onAddToCart({ name, price });
  };

  return (
    <div className="coffee-card-container">
      <div className="coffee-card-image">
        <img src={image} alt={name} />
      </div>
      <div className="card-detail">
        <h2>{name}</h2>
        <p>{description}</p>
        <h3 className="price">가격: {price}원</h3>
      </div>
      <div className="text-container">
        <p>&nbsp;Sugar</p>
        <p>Ice</p>
      </div>
      <div className="options">
        <button>20%</button>
        <button>40%</button>
        <button>60%</button>
        <button>20%</button>
        <button>40%</button>
        <button>60%</button>
      </div>
      <button className="receive" onClick={handleAddToCart}>
        담기
      </button>
    </div>
  );
};

export default CoffeeCard;
