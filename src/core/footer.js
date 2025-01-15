import React from 'react'
import { Link } from 'react-router-dom';
import Robot from '../images/Layer_1.png';

function Footer() {

    const currentYear = new Date().getFullYear();

  return (
    <div className="footer">
        <div>{currentYear} © H.aRchers - All Rights Reserved - By Zine. E. Falouti</div>
        <div className="footer-r">
            <Link to="/" className="Header-link">About H.aRchers AI</Link>
            <img src={Robot} alt="H.aRchers AI" className="Robot"/>
        </div>
    </div>
)
}

export default Footer