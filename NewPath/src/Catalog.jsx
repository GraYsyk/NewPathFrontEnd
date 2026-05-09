import { Footer } from "./components/Footer"
import { Header } from "./components/Header"
import '../styles/catalog.css'
import { Link } from "react-router"

export function Catalog() {
  return (
    <>
      <Header />
      <main className="catalogMain">
        <div className="collection-name">
          <p className="collection-lable">DEFAULT COLLECTION</p>
          <p className="collection-desc">Our first collection is here. The items below may not be restocked in the near future!</p>
        </div>

        <div className="items-container">
          <div className="itemCard">
            <Link to={"/item/1"}>
            <div className="itemImageWrapper">
              <img className="itemImage" src="/NewPathTshirt.png" alt={name} />
              {/* {!inStock && <span className="soldOut">SOLD OUT</span>} */}
              <span className="soldOut">SOLD OUT</span>
            </div>
            <div className="itemInfo">
              <p className="itemName">Newpath classic t-shirt</p>
              <div className="itemPrice">
                {/* {discount
                ? <>
                  <span className="priceNew">€{discountedPrice}</span>
                  <span className="priceOld">€{price}</span>
                </>
                :  */}
                <span>€110</span>
                {/* } */}
              </div>
            </div>
            </Link>
          </div>
        </div>
      </main>
      <Footer />    
      </>
  )
}

export default Catalog
