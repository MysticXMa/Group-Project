import React from "react";
import "../styles/footer.css";

const Footer = () => {
  if (localStorage.getItem("signed-in") !== true) {
    return (
      <div className="footer">
        <p className="footer-copy">© Skills Finland 2025</p>
      </div>
    );
  } else if (localStorage.getItem("admin") === true) {
    return (
      <div className="footer">
        <p className="footer-copy">© Skills Finland 2025</p>
        <a href="kirjautuminen" className="footer-sign-in-out">
          Kirjaudu ulos
        </a>
      </div>
    );
  } else {
    return (
      <div className="footer">
        <p className="footer-copy">© Skills Finland 2025</p>
        <a href="kirjautuminen" className="footer-sign-in-out">
          Kirjaudu ulos
        </a>
      </div>
    );
  }
};

export default Footer;
