import React from 'react'
import { Link } from 'react-router-dom'

function banner() {
  return (
    <div className="Banner">
        <div>
            <h1>Try H.aRchers <span>AI/ML in Action</span></h1>
            <p>Experience the power of AI-driven hiring—simplify screening, match candidates, and manage workflows with ease.</p>
        </div>
        <Link to="/core" className="Header-link">Back To H.aRchers</Link>
    </div>
  )
}

export default banner