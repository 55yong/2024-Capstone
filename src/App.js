import React, { useState, useEffect } from "react";
import Standby from "./MainMenu/StandbyScreen/Standby.js";
import Menu from "./MainMenu/MenuList/Menu.js";
import CheckoutPage from "./MainMenu//Payment/Checkout.js";

function App() {
  const [isMainMenuVisible, setIsMainMenuVisible] = useState(false);
  const handleTransitionToMainMenu = () => {
    setIsMainMenuVisible(true);
  };
  const handleTransitionToStandby = () => {
    setIsMainMenuVisible(false);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleTransitionToStandby();
    }, 180000);

    return () => clearTimeout(timeoutId);
  }, [isMainMenuVisible]);

  const [items, setItems] = useState([]);
  const [checkoutPrice, setCheckoutPrice] = useState(0);
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(false);

  const removeFromCart = (item) => {
    setItems(items.filter((i) => i.name !== item.name));
  };

  const handleCheckout = (totalPrice) => {
    setCheckoutPrice(totalPrice);
    setIsCheckoutVisible(true);
  };

  const handleCheckoutClose = () => {
    setIsCheckoutVisible(false);
  };

  return (
    <div className="App">
      {!isMainMenuVisible && (
        <Standby onTransition={handleTransitionToMainMenu} />
      )}
      {isMainMenuVisible && !isCheckoutVisible && (
        <Menu onCheckout={handleCheckout} />
      )}
      {isCheckoutVisible && (
        <CheckoutPage
          totalPrice={checkoutPrice}
          onClose={handleCheckoutClose}
        />
      )}
    </div>
  );
}

export default App;
