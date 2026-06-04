import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:8000'

function statusColor(status) {
  if (status === 'Safe to Drink')            return '#22c55e'
  if (status === 'Safe but Needs Filtering') return '#eab308'
  return '#ef4444'
}

function TankCard({ tank, onEvaluate }) {
  const color = statusColor(tank.status)

  return (
    <div className="tank-card">
      <div className="tank-header">
        <h3>{tank.name}</h3>
        <span className="badge" style={{ background: color }}>
          {tank.status || 'Not Evaluated'}
        </span>
      </div>

      <div className="tank-rating">
        <span className="rating-number">{tank.cleanliness_rating ?? '—'}</span>
        <span className="rating-label">/ 100</span>
      </div>

      <div className="tank-stats">
        <div><label>pH</label><span>{tank.ph}</span></div>
        <div><label>Turbidity</label><span>{tank.turbidity}</span></div>
        <div><label>Chloramines</label><span>{tank.chloramines}</span></div>
        <div><label>Users</label><span>{tank.user_count?.toLocaleString()}</span></div>
      </div>

      <button className="eval-btn" onClick={() => onEvaluate(tank.id)}>
        Run Evaluation
      </button>
    </div>
  )
}

export default function Dashboard() {
  const [tanks, setTanks]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [route, setRoute]       = useState(null)
  const [evaluating, setEvaluating] = useState(false)

  const fetchTanks = () =>
    axios.get(`${API}/api/tanks`).then(r => r.data)

  const runEvaluateAll = (tankList) => {
    setEvaluating(true)
    Promise.all(tankList.map(t => axios.post(`${API}/api/tanks/${t.id}/evaluate`)))
      .then(() => fetchTanks().then(setTanks))
      .finally(() => setEvaluating(false))
  }

  useEffect(() => {
    fetchTanks()
      .then(data => { setTanks(data); runEvaluateAll(data) })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const evaluateTank = (id) => {
    axios.post(`${API}/api/tanks/${id}/evaluate`)
      .then(() => fetchTanks().then(setTanks))
  }

  const evaluateAll = () => runEvaluateAll(tanks)

  const findRoute = () => {
    axios.get(`${API}/api/route`, {
      params: { from_tank: 'Tank A - Gulberg', to_tank: 'Tank F - Bahria Town' }
    }).then(r => setRoute(r.data))
  }

  if (loading) return <p className="loading">Loading tanks...</p>
  if (error)   return <p className="loading" style={{color:'#ef4444'}}>API Error: {error} — is the backend running on port 8000?</p>

  return (
    <div className="dashboard">
      <div className="dashboard-actions">
        <button className="eval-all-btn" onClick={evaluateAll} disabled={evaluating}>
          {evaluating ? 'Evaluating...' : 'Evaluate All Tanks'}
        </button>
        <button className="route-btn" onClick={findRoute}>
          A* — Find Safe Route
        </button>
      </div>

      {route && (
        <div className="route-box">
          <strong>Optimal Route (A*):</strong>
          <span>{route.route.join(' → ')}</span>
          <span className="route-distance">{route.total_distance} km</span>
        </div>
      )}

      <div className="tank-grid">
        {tanks.map(tank => (
          <TankCard key={tank.id} tank={tank} onEvaluate={evaluateTank} />
        ))}
      </div>
    </div>
  )
}
