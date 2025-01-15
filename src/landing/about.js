import React from 'react'
import { Link } from 'react-router-dom'
import Img1 from '../images/img1.png'

function about() {
  return (
    <div className="about">
        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
                <img src={Img1} alt="About H.aRchers"/>
            </div>
            <div className="col-span-12">
                <h1>About <span>AI Scoring</span></h1>   
                <p>H.aRchers uses Linear Regression to score candidates by evaluating key factors such as experience, 
                    education, and employment gaps. By analyzing these attributes, the model generates a score that 
                    helps determine the best-fit candidates for a job, offering an efficient and data-driven approach 
                    to candidate selection.</p>

                <Link to="/core" className="Header-link">Back To H.aRchers</Link>
            </div>
        </div>
    </div>
  )
}

export default about