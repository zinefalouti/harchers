import React from 'react'
import Logo from '../images/logo.png'

function footer() {

  const currentYear = new Date().getFullYear();
    
  return (
    <div className="landing-footer">
        <img src={Logo} alt="H.aRchers Logo"/>
        <p>H.aRchers by Zine. E. Falouti © All Rights Reserved {currentYear}</p>
    </div>
  )
}

export default footer