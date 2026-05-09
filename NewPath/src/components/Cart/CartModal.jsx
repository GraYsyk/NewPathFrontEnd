import { useCart } from "./CartContext";
import '../../../styles/Components/cart/cartModal.css'

export function CartModal() {
  const { cart, isOpen, setIsOpen, removeFromCart, updateQuantity, totalPrice } = useCart();

  const itemsLabel = cart.length === 0
    ? 'Items'
    : cart.length === 1
      ? 'Item'
      : 'Items';

  return (
    <>
      {isOpen && (
        <div className="cartOverlay" onClick={() => setIsOpen(false)} />
      )}

      <div className={`cartModal ${isOpen ? 'cartOpen' : ''}`}>
        <div className="cartHeader">
          <span className="cartTitle">CART</span>
          <span className="cartItemsCount">({cart.length} {itemsLabel})</span>
          <button className="cartClose" onClick={() => setIsOpen(false)}>✕</button>
        </div>

        <div className="cartItems">
          {cart.length === 0
            ? <p className="cartEmpty">Your cart currently is empty</p>
            : cart.map((item, i) => (
              <div key={i} className="cartItem">
                <img src={item.image} alt={item.name} className="cartItemImage" />
                <div className="cartItemInfo">
                  <div className="cartItemTop">
                    <p className="cartItemName">{item.name}</p>
                    <p className="cartItemPrice">€{item.price}</p>
                  </div>
                  <p className="cartItemDetails">Color: {item.color}</p>
                  <p className="cartItemDetails">Size: {item.size}</p>
                  <div className="cartItemBottom">
                    <div className="cartItemQtyControl">
                      <button className="qtyBtn" onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity - 1)}>−</button>
                      <span className="qtyValue">{item.quantity}</span>
                      <button className="qtyBtn" onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity + 1)}>+</button>
                    </div>
                    <button
                      className="cartItemRemove"
                      onClick={() => removeFromCart(item.id, item.color, item.size)}
                    >Remove</button>
                  </div>
                </div>
              </div>
            ))
          }
        </div>

        {cart.length >= 0 && (
          <div className="cartFooter">
            <div className="cartTotal">
              <span>TOTAL</span>
              <span style={{ fontWeight: 700 }}>€{totalPrice}</span>
            </div>
            <div className="cartTotalInfo">
              <span>Shipping and Taxes will be calculated at checkout</span>
            </div>
            <button className="cartCheckoutBtn">CHECKOUT NOW</button>
          </div>
        )}
      </div>
    </>
  );
}