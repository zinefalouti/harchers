import React from 'react'
import Logo from '../images/logo.png'
import { Link } from 'react-router-dom'

function header() {
  return (
    <>

            <div className="Header">
               <img src={Logo} alt="H.aRchers Logo" className="logo"/>
               <Link to="/core" className="Header-link">Back to H.aRchers</Link>
            </div>

    </>
  )
}

export default header