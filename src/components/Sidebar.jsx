import { useAuth } from '../context/AuthContext'
import sqlogo from '../assets/sqlogo.png'

function Sidebar({ activePage, setActivePage, isOpen, onClose }) {
  const { user, logout } = useAuth()

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'pomodoro', label: 'Pomodoro' },
    { id: 'materials', label: 'Materials' },
    { id: 'grades', label: 'Grades' },
    { id: 'ai', label: 'AI Assistant' },
  ]

  return (
    <nav className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2>SideQuest</h2>
        </div>
      </div>

      {navItems.map(item => (
        <div
          key={item.id}
          className={`nav-item ${activePage === item.id ? 'active' : ''}`}
          onClick={() => setActivePage(item.id)}
        >
          <span>{item.label}</span>
          {activePage === item.id && <span>▶</span>}
        </div>
      ))}

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-name">{user?.displayName || 'Student'}</div>
          <div className="user-email">{user?.email}</div>
        </div>
        <button className="signout-btn" onClick={logout}>Sign Out</button>
      </div>
    </nav>
  )
}

export default Sidebar