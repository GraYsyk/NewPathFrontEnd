import { useState, useEffect } from 'react'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { ProductImages } from '../components/ItemPage/ProductImages'
import { useParams } from 'react-router'
import { useCart } from '../components/Cart/CartContext'

export function ItemPage() {

  const {addToCart, setIsOpen} = useCart();

  const { id } = useParams();

  const images = [
    '/NewPathTshirt.png',
    '/NewPathTshirtBack.png',
  ]

  const colors = [
    { name: 'Cream', available: true },
    { name: 'Black', available: true },
    { name: 'White', available: false },
  ]

  const sizes = [
    { size: 'XS', available: true },
    { size: 'S', available: true },
    { size: 'M', available: false },
    { size: 'L', available: false },
    { size: 'XL', available: false }
  ]

  const [selectedColor, setSelectedColor] = useState(
    colors.find(c => c.available)?.name
  )

  const [selecterdSize, setSelectedSize] = useState(
    sizes.find((s) => s.available)?.size
  );

  const [selectedQuantity, setSelectedQuantity] = useState(1);

  // TODO: ADD PRODUCT INFO DIRECTLY TO DATA

  const handleAddToCart = () => {
    addToCart({
      id: id,
      name: 'Newpath classic tee',
      price: 110,
      image: '/NewPathTshirt.png',
      color: selectedColor,
      size: selecterdSize,
      quantity: selectedQuantity
    });
    setIsOpen(true);
  };

  useEffect(() => {
  }, [selectedColor, selecterdSize, selectedQuantity])

  return (
    <>
      <Header />
      <main className="itemPageMain">
        <div className="itemPage">
          <ProductImages images={images} />
          <div className="itemDetails">
            <h1 className="nameItemPage">NEWPATH CLASSIC T-SHIRT</h1>
            <span className="priceItemPage">€110,00</span>

            <div className="itemSection">
              <span className="sectionLabel">COLOR</span>
              <div className="colorOptions">
                {colors.map(color => (
                  <button
                    key={color.name}
                    className={`colorBtn 
                        ${selectedColor === color.name ? 'active' : ''}
                        ${!color.available ? 'disabled' : ''}`}
                    onClick={() => color.available && setSelectedColor(color.name)}
                    disabled={!color.available}
                  >{color.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="itemSection">
              <div className="sizeHeader">
                <span className="sectionLabel">SIZE</span>
                <span className="sizeGuide">SIZE GUIDE</span>
              </div>
              <div className="sizeOptions">
                {sizes.map(size => (
                  <button key={size.size} className={`sizeBtn
                    ${selecterdSize === size.size ? 'active' : ''}
                    ${!size.available ? 'disabled' : ''}`}
                  onClick={() => size.available && setSelectedSize(size.size)}
                  disabled={!size.available}
                  >{size.size}
                  </button>
                ))}
              </div>
            </div>

            <div className="itemSection">
              <span className="sectionLabel">QUANTITY</span>
              <select className="quantitySelect"
              onChange={(e) => setSelectedQuantity(e.target.value)}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* //TODO: CHECK IF ITEM OUT OF STOCK */}

            <button className="addToCartBtn" onClick={handleAddToCart}>ADD TO CART · €110</button>

            <div className="itemSection">
              <span className="sectionLabel">DESCRIPTION</span>
              <p className="itemDescription">
                Classic fit t-shirt made from 100% heavyweight cotton.
                NEWPATH graphic print on chest and back.
                Please allow 1-2 weeks for shipping.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}