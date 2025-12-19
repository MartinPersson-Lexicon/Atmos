import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ activeNav, setActiveNav }) {
  const navItems = [
    { id: "home", icon: "⊞", path: "/" },
    { id: "about", icon: "📖", path: "/about" },
    { id: "api-test", icon: "📅", path: "/api-test" },
    { id: "settings", icon: "⚙️", path: "/settings" },
  ];

  return (
    <aside className="sidebar">
      {/* <button className="menu-btn">☰</button> */}

      <nav className="nav-icons">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`nav-icon ${activeNav === item.id ? "active" : ""}`}
            onClick={() => setActiveNav && setActiveNav(item.id)}
          >
            {item.icon}
          </Link>
        ))}
      </nav>

      {/* <button className="nav-icon help-icon">❓</button> */}
    </aside>
  );
}

export default Sidebar;
