import { Link } from "react-router-dom";
import "../App.css";

export default function Header() {
  return (
    <header className="app-header">
      <nav>
        <Link to="/">Home</Link>
        {" | "}
        <Link to="/about">About</Link>
        {" | "}
        <Link to="/weather">Weather</Link>
      </nav>
    </header>
  );
}
