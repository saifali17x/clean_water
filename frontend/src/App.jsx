import { useState } from 'react'
import Dashboard from './components/Dashboard'
import Analytics from './components/Analytics'
import './App.css'

function App() {
  const [tab, setTab] = useState('dashboard')

  return (
    <div className="app">
      <header className="header">
        <h1>Clean Water Index</h1>
        <nav>
          <button
            className={tab === 'dashboard' ? 'active' : ''}
            onClick={() => setTab('dashboard')}
          >
            Tank Network
          </button>
          <button
            className={tab === 'analytics' ? 'active' : ''}
            onClick={() => setTab('analytics')}
          >
            Analytics
          </button>
        </nav>
      </header>
      <main>
        {tab === 'dashboard' ? <Dashboard /> : <Analytics />}
      </main>
    </div>
  )
}

export default App
