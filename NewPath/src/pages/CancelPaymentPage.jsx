import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Link } from "react-router-dom";
import '../../styles/successPage.css';

export function CancelPaymentPage() {
  return (
    <>
      <Header />
      <div className="successPaymentWrapper">
        <div className="pInfo">
          <span className="pTitle">PAYMENT FAILED</span>
          <p className="successDesc fail">
            Payment failed. Please try again or contact support if the issue persists.
          </p>
          <Link to="/" className="successBtn">
            <span>CONTINUE SHOPPING</span>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}