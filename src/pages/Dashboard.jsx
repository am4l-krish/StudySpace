function Dashboard() {
  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Welcome back, Amal! 👋</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Tasks Pending</div>
          <div className="stat-value">0</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pomodoros</div>
          <div className="stat-value">0</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">GPA</div>
          <div className="stat-value">—</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Study Streak</div>
          <div className="stat-value">0🔥</div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard