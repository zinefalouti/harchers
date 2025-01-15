import React from 'react'
import HeroArt from '../images/hero-art.png'
import Dashes from '../images/dashs.png'

function hero() {
  return (
    <div className="hero-cont">
        <h1><span>A Full AI/ML</span> Control For <span>HR Experts</span> </h1>
        <p>Empower your hiring process with H.aRchers AI-driven insights and ML-powered decisions tailored for modern HR management.</p>
        <img src={HeroArt} alt="H.aRchers Candidates"/>
        <img src={Dashes} alt="H.aRchers Dashboards" className="dashes"/>
    </div>
  )
}

export default hero