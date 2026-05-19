import { Link } from "react-router";
// @ts-ignore
import '../../styles/Components/header.css'

// @ts-ignore
import { useCart } from "./Cart/CartContext";
import { CartModal } from "./Cart/CartModal";

export function Header() {

  const { setIsOpen, cart } = useCart();

  return (
    <>
      <nav className="header">

          <Link to={'/account'}>
            <svg className="accountBtn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
              <path d="M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2ZM10,26.39a6,6,0,0,1,11.94,0,11.87,11.87,0,0,1-11.94,0Zm13.74-1.26a8,8,0,0,0-15.54,0,12,12,0,1,1,15.54,0ZM16,8a5,5,0,1,0,5,5A5,5,0,0,0,16,8Zm0,8a3,3,0,1,1,3-3A3,3,0,0,1,16,16Z"></path>
            </svg>
          </Link>

          <Link to={'/'}>
            <img className="logoHeader" src='/NPLnoBG.png' alt="Logo" />
          </Link>

          <div className="cartBtnWrapper" onClick={() => setIsOpen(true)}>
            <svg className="cartHeaderBtn" fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="704.081 796 200 200" enable-background="new 704.081 796 200 200" xmlSpace="preserve">
              <path d="M891.876,977.909l-6.938-125.811h-34.661v-10.157c0-25.333-20.608-45.941-45.94-45.941s-45.94,20.609-45.94,45.941v10.157
	              h-36.161l-5.969,126.355l-0.006,0.219c-0.049,4.547,1.758,9.01,4.955,12.239c3.198,3.233,7.641,5.089,12.19,5.089h141.351
	              c4.688,0,9.228-1.953,12.453-5.36C890.434,987.233,892.135,982.593,891.876,977.909z M770.379,841.941
	              c0-18.725,15.233-33.959,33.958-33.959c18.724,0,33.958,15.234,33.958,33.959v10.157h-67.917V841.941z M878.507,982.402
	              c-0.973,1.026-2.339,1.615-3.751,1.615H733.405c-1.37,0-2.707-0.558-3.672-1.534c-0.942-0.95-1.483-2.257-1.492-3.597l5.423-114.806
	              h24.731v15.173c0,3.309,2.682,5.991,5.991,5.991c3.309,0,5.991-2.682,5.991-5.991v-15.173h67.917v15.173
	              c0,3.309,2.682,5.991,5.991,5.991c3.309,0,5.99-2.682,5.99-5.991v-15.173h23.321l6.313,114.49
	              C879.99,979.98,879.478,981.377,878.507,982.402z"/>
            </svg>
            {cart.length > 0 &&
              <div className="cartHeaderCount">{cart.length > 10 ? '10+' : cart.length}</div>}

          </div>
        
      </nav>
      <CartModal />
    </>
  );
}