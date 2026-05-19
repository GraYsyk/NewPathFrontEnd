import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Link } from "react-router-dom";
import '../../styles/successPage.css';

export function SuccessPaymentPage() {
  return (
    <>
      <Header />
      <div className="successPaymentWrapper">
        <div className="pInfo">
          <span className="pTitle">ORDER CONFIRMED</span>
          <p className="successDesc">
            You will receive a confirmation email shortly. You can track your order status in your account.
          </p>
          <p className="successOrderNum">Order ID #12345</p>
          <Link to="/" className="successBtn">
            <span>CONTINUE SHOPPING</span>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}