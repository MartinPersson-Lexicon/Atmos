import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import testIcon from "../../assets/load-test.png";
import aboutIcon from "../../assets/employee.png";
import homeIcon from "../../assets/sun.png";
import settingsIcon from "../../assets/setting.png";

function Sidebar({ activeNav, setActiveNav }) {
  const location = useLocation();

  const navItems = [
    { id: "home", icon: <img src={homeIcon} alt="Home" />, path: "/" },
    { id: "about", icon: <img src={aboutIcon} alt="About" />, path: "/about" },
    {
      id: "api-test",
      icon: <img src={testIcon} alt="Test" />,
      path: "/api-test",
    },
    {
      id: "settings",
      icon: <img src={settingsIcon} alt="Settings" />,
      path: "/settings",
    },
  ];

  // Determine active id from prop or from current location pathname
  const pathname = location?.pathname ?? "/";
  const inferredActive =
    navItems.find((n) => n.path === pathname)?.id ||
    navItems.find((n) => pathname.startsWith(n.path) && n.path !== "/")?.id ||
    "home";

  const currentActive = activeNav ?? inferredActive;

  return (
    <aside className="sidebar">
      <nav className="nav-icons">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`nav-icon ${currentActive === item.id ? "active" : ""}`}
            onClick={() => setActiveNav && setActiveNav(item.id)}
          >
            {item.icon}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
