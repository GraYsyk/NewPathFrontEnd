import { useCart } from "./CartContext.tsx";
import { CartItem } from "./CartItem.tsx";
import { useState } from "react";
//@ts-ignore
import { CartErrorBanner } from "./CartErrorBanner";
import axios from "axios";
//@ts-ignore
import "../../../styles/Components/cart/cartModal.css";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) return {};
  return { headers: { Authorization: `Bearer ${token}` } };
};

export function CartModal() {
  const { cart, isOpen, setIsOpen, removeFromCart, updateQuantity, totalPrice, cartError, setCartError, clearError } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const discountedPrice = discount > 0
    ? (totalPrice * (1 - discount / 100)).toFixed(2)
    : null;

  const itemsLabel = cart.length === 1 ? "Item" : "Items";

  const handleApplyPromo = async () => {
    try {
      const res = await axios.get(`/api/settings/check/${promoCode}`);
      setDiscount(res.data.discount);
      setPromoApplied(true);
      setPromoError('');
    } catch (err) {
      setPromoError('Invalid or expired code');
      setDiscount(0);
      setPromoApplied(false);
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const response = await axios.post('/api/checkout/create-session', {
        promocode: promoApplied ? promoCode : null
      }, getAuthHeader());
      window.location.href = response.data.url;
    } catch (err) {
      console.error("Checkout failed:", err);
      setCartError({ msg: "Checkout failed, please try again later or contact support!", item: null });
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      {isOpen && <div className="cartOverlay" onClick={() => setIsOpen(false)} />}

      <div className={`cartModal ${isOpen ? "cartOpen" : ""}`}>
        <div className="cartHeader">
          <span className="cartTitle">CART</span>
          <span className="cartItemsCount">({cart.length} {itemsLabel})</span>
          <button className="cartClose" onClick={() => setIsOpen(false)}>✕</button>
        </div>

        {cartError && <CartErrorBanner error={cartError} onClose={clearError} setIsOpen={setIsOpen} />}

        <div className="cartItems">
          {cart.length === 0 ? (
            <p className="cartEmpty">Your cart is currently empty</p>
          ) : (
            cart.map((item: CartItem) => (
              <CartItem
                key={item.cartItemId || `${item.id}-${item.color}-${item.size}`}
                item={item}
                onUpdate={updateQuantity}
                onRemove={removeFromCart}
              />
            ))
          )}
        </div>

        <div className="cartFooter">
          <div className="promoSection">
            <div className="promoInputRow">
              <input
                className="promoInput"
                type="text"
                placeholder="PROMO CODE"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                disabled={promoApplied}
              />
              <button
                className="promoApplyBtn"
                onClick={handleApplyPromo}
                disabled={promoApplied || !promoCode}
              >
                {promoApplied ? '✓' : 'APPLY'}
              </button>
            </div>
            {promoError && <span className="promoError">{promoError}</span>}
            {promoApplied && <span className="promoSuccess">-{discount}% applied!</span>}
          </div>

          <div className="cartTotal">
            <span>TOTAL</span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              {discountedPrice && <span style={{ fontWeight: 700 }}>€{discountedPrice}</span>}
              <span style={{
                fontWeight: discountedPrice ? 400 : 700,
                textDecoration: discountedPrice ? 'line-through' : 'none',
                color: discountedPrice ? '#888' : 'black',
                fontSize: discountedPrice ? '11px' : '13px'
              }}>€{totalPrice}</span>
            </div>
          </div>
          <p className="cartTotalInfo">Shipping and taxes calculated at checkout</p>
          <button
            className={`cartCheckoutBtn ${isCheckingOut ? 'checkingOut' : ''}`}
            onClick={handleCheckout}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? <span className="checkoutShimmer" /> : 'CHECKOUT NOW'}
          </button>
        </div>
      </div>
    </>
  );
}