interface CartItemProps {
  item: CartItem;
  onUpdate: (cartItemId: number | null, id: number, color: string, size: string, quantity: number) => void;
  onRemove: (cartItemId: number | null, id: number, color: string, size: string) => void;
}

export function CartItem({ item, onUpdate, onRemove }: CartItemProps) {
  const itemId = item.cartItemId || item.id;
  const isMaxQty = item.quantity >= item.stockQuantity;

  return (
    <div className="cartItem">
      <img
        src={item.frontImage || item.image}
        alt={item.name}
        className="cartItemImage"
      />
      <div className="cartItemInfo">
        <div className="cartItemTop">
          <p className="cartItemName">{item.name}</p>
          <p className="cartItemPrice">€{item.price}</p>
        </div>
        <p className="cartItemDetails">Color: {item.color}</p>
        <p className="cartItemDetails">Size: {item.size}</p>
        <div className="cartItemBottom">
          <div className="cartItemQtyControl">
            <button
              className="qtyBtn"
              onClick={() => onUpdate(item.cartItemId ?? null, itemId, item.color ?? '', item.size ?? '', item.quantity - 1)}
            >−</button>
            <span className="qtyValue">{item.quantity}</span>
            <button
              className="qtyBtn"
              onClick={() => onUpdate(item.cartItemId ?? null, itemId, item.color ?? '', item.size ?? '', item.quantity + 1)}
              disabled={isMaxQty}
            >+</button>
          </div>
          <button
            className="cartItemRemove"
            onClick={() => onRemove(item.cartItemId ?? null, itemId, item.color ?? '', item.size ?? '')}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}