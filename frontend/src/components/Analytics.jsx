const API = 'http://localhost:8000'

export default function Analytics() {
  return (
    <div className="analytics">
      <h2>Model Performance</h2>

      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-value">62.65%</span>
          <span className="metric-label">Test Accuracy</span>
        </div>
        <div className="metric-card">
          <span className="metric-value">Neural Network</span>
          <span className="metric-label">Model Type (MLP)</span>
        </div>
        <div className="metric-card">
          <span className="metric-value">2,620</span>
          <span className="metric-label">Training Samples</span>
        </div>
        <div className="metric-card">
          <span className="metric-value">9</span>
          <span className="metric-label">Input Features</span>
        </div>
      </div>

      <div className="confusion-matrix-section">
        <h3>Confusion Matrix</h3>
        <img
          src={`${API}/static/confusion_matrix.png`}
          alt="Confusion Matrix"
          className="confusion-img"
        />
      </div>

      <div className="threshold-section">
        <h3>Safety Thresholds</h3>
        <div className="threshold-grid">
          <div className="threshold-card green">
            <span className="threshold-range">90 – 100</span>
            <span className="threshold-label">Safe to Drink</span>
          </div>
          <div className="threshold-card yellow">
            <span className="threshold-range">70 – 89</span>
            <span className="threshold-label">Safe but Needs Filtering</span>
          </div>
          <div className="threshold-card red">
            <span className="threshold-range">0 – 69</span>
            <span className="threshold-label">Unsafe</span>
          </div>
        </div>
      </div>
    </div>
  )
}
