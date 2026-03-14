import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard.jsx'
import Tasks from './pages/Tasks.jsx'
import Grades from './pages/Grades.jsx'
import Schedule from './pages/Schedule.jsx'
import Pomodoro from './pages/Pomodoro.jsx'
import Materials from './pages/Materials.jsx'
import AI from './pages/AI.jsx'
import Login from './pages/Login.jsx'

function AppContent() {
  const { user } = useAuth()
  const [activePage, setActivePage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!user) return <Login />

  const renderPage = () => {
    if (activePage === 'dashboard') return <Dashboard />
    if (activePage === 'tasks') return <Tasks />
    if (activePage === 'grades') return <Grades />
    if (activePage === 'schedule') return <Schedule />
    if (activePage === 'pomodoro') return <Pomodoro />
    if (activePage === 'materials') return <Materials />
    if (activePage === 'ai') return <AI />
  }

  const handleNavClick = (page) => {
    setActivePage(page)
    setSidebarOpen(false)
  }

  return (
    <div className="app-layout">
      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
        <span className="mobile-logo">SideQuest</span>
      </div>

      {/* Overlay when sidebar is open on mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar
        activePage={activePage}
        setActivePage={handleNavClick}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App