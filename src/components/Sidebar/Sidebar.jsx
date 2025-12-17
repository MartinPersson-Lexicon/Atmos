import './Sidebar.css'

function Sidebar({ activeNav, setActiveNav }) {
  const navItems = [
    { id: 'dashboard', icon: '⊞' },
    { id: 'book', icon: '📖' },
    { id: 'calendar', icon: '📅' },
    { id: 'notifications', icon: '🔔' },
    { id: 'settings', icon: '⚙️' },
  ]

  return (
    <aside className="sidebar">
      <button className="menu-btn">☰</button>
      
      <nav className="nav-icons">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-icon ${activeNav === item.id ? 'active' : ''}`}
            onClick={() => setActiveNav(item.id)}
          >
            {item.icon}
          </button>
        ))}
      </nav>
      
      <button className="nav-icon help-icon">❓</button>
    </aside>
  )
}

export default Sidebar
