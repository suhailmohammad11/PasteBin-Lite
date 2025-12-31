import "./HeaderStyles.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <Link to="/">
          <p className="logo">Pastebin-Lite</p>
        </Link>
      </div>
    </header>
  );
};

export default Header;
