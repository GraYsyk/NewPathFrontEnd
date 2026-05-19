//@ts-ignore
import '../../styles/Components/footer.css'

export function Footer() {

  return(
    <>
      <div className="footerContainer">
        <img className="logoFooter" src="/NewPathLogoDark.png" alt="Logo" />
        <div className="linksContainer">
          <span className="companyMention">&copy; 2026, NEWPATH</span>
          <div className="links-footer">
            {/* TODO: ADD CUSTOM LINK REDIRECTION  */}
            <span className="link-footer">Search</span>

            <span className="link-footer">Privacy Policy</span>
            <span className="link-footer">Refund Policy</span>
            <span className="link-footer">Shipping Policy</span>
            <span className="link-footer">Terms of Service</span>
            <span className="link-footer">Contact us</span>
            <span className="link-footer">Stockists</span>
          </div>
        </div>
      </div>
    </>
  );
}