import { useEffect } from "react";

export function CartErrorBanner({ error, onClose, setIsOpen }) {
  useEffect(() => {
    if (error) {
      setIsOpen(true);
    }
  }, [error, setIsOpen]);
  return (
    <div className="cartErrorBanner">
      <div className="cartErrorText">
        <span className="cartErrorTitle">
          Sorry, looks like we don't have enough of this product.
        </span>
        {error.item && (
          <span className="cartErrorSub">
            {error.item.name} — {error.item.color} / {error.item.size}
          </span>
        )}
      </div>
      <button className="cartErrorClose" onClick={onClose}>✕</button>
    </div>
  );
}