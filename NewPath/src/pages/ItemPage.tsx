import { useState, useEffect } from 'react'
import { Footer } from '../components/Footer.tsx'
import { Header } from '../components/Header.tsx'
import { ProductImages } from '../components/ItemPage/ProductImages.tsx'
import { useParams } from 'react-router'
import axios from "axios";
import { useCart } from '../components/Cart/CartContext.tsx'


export function ItemPage() {

  const { addToCart, setIsOpen } = useCart() as {
    addToCart: (item: CartItem) => void;
    setIsOpen: (open: boolean) => void;
  };
  const { id } = useParams();
  
  const [item, setItem] = useState<Item | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selecterdSize, setSelectedSize] = useState<string | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('/api/items/' + id);
        const data = response.data;
        setItem(data);

        const firstColor = [...new Set(data.variants.map((v: ProductVariant) => v.color))][0] as string;
        const firstSize = [...new Set(data.variants.map((v: ProductVariant) => v.size))][0] as string;
        setSelectedColor(firstColor);
        setSelectedSize(firstSize);
      } catch (error) {
        console.error('Error fetching item:', error);
      }
    };
    fetchItems();
  }, []);

  if (!item) return <p>Loading...</p>;

  const colors = [...new Set(item.variants.map((v: ProductVariant) => v.color))]
    .map(color => ({
      name: color,
      available: item.variants.filter((v: ProductVariant) => v.color === color)
        .some((v: ProductVariant) => v.quantity > 0)
    }));


  const sizeOrder: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const sizes = [...new Set(item.variants.map((v: ProductVariant) => v.size))]
    .sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b))
    .map(size => ({
      size: size,
      available: item.variants.filter((v: ProductVariant) => v.size === size)
        .some((v: ProductVariant) => v.quantity > 0)
    }));

  const sizesAvailable = sizes.map(s => ({
    ...s,
    available: item.variants.some(
      (v: ProductVariant) => v.size === s.size && v.color === selectedColor && v.quantity > 0
    )
  }));

  const quantityAvailable = () => {
    const variant = item.variants.find(
      (v: ProductVariant) => v.color === selectedColor && v.size === selecterdSize
    );
    return Array.from({ length: variant?.quantity || 0 }, (_, i) => i + 1);
  };

  const handleAddToCart = () => {
    const variant = item.variants.find(
      (v: ProductVariant) => v.color === selectedColor && v.size === selecterdSize
    )

    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.frontImage,
      color: selectedColor,
      size: selecterdSize,
      quantity: selectedQuantity,
      stockQuantity: variant?.quantity ?? 0
    });
  };

  return (
    <>
      <Header />
      <main className="itemPageMain">
        <div className="itemPage">
          <ProductImages images={item.images} />
          <div className="itemDetails">
            <h1 className="nameItemPage">{item.name}</h1>
            <span className="priceItemPage">€{item.price},00</span>

            <div className="itemSection">
              <span className="sectionLabel">COLOR</span>
              <div className="colorOptions">
                {colors.map(color => (
                  <button
                    key={color.name}
                    className={`colorBtn 
                        ${selectedColor === color.name ? 'active' : ''}
                        ${!color.available ? 'disabled' : ''}`}
                    onClick={() => {
                      if (color.available) {
                        setSelectedColor(color.name)
                        const firstSize = item.variants
                          .find(v => v.color === color.name && v.quantity > 0)?.size

                        setSelectedSize(firstSize || null)
                      }
                    }}
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
                {sizesAvailable.map(size => (
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
                onChange={(e) => setSelectedQuantity(Number(e.target.value))}>
                {quantityAvailable().map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <button className="addToCartBtn" onClick={handleAddToCart}>ADD TO CART · €{item.price}</button>

            <div className="itemSection">
              <span className="sectionLabel">DESCRIPTION</span>
              <p className="itemDescription">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}