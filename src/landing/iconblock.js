import React from 'react'
import { Link } from 'react-router-dom'
import Arrow from '../images/arrow.png'

function iconblock({icon,title,text}) {
  return (
    <div className="col-span-4 md:col-span-2 xl:col-span-1 icon-block">
            <img src={icon} alt={title}/>
            <h2>{title}</h2>
            <p>{text}</p>
            <Link to="/core" className="why-link">Start Now <img src={Arrow} alt="Arrow"/></Link>
    </div>
  )
}

export default iconblock