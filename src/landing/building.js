import React from 'react'
import Img2 from '../images/img2.png'
import { Link } from 'react-router-dom'

function building() {
  return (
  <div className="about">
    <div className="grid grid-cols-12 gap-6">    
        <div className="col-span-12">
            <img src={Img2} alt="About H.aRchers"/>
        </div>
        <div className="col-span-12">
            <h1>About  <span>AI Screening</span></h1>   
            <p>H.aRchers uses Logistic Regression to classify and screen candidates by comparing their qualifications 
                with job requirements. The system analyzes candidate data such as experience, education, and skills, 
                and uses this information to predict whether a candidate is a good fit for the job. Linear Regression, 
                used earlier to score candidates based on factors like experience and education gaps, feeds directly into 
                this classification process as a parameter. This allows the system to not only screen but also assess 
                candidates with greater accuracy and efficiency.</p>

            <Link to="/core" className="Header-link">Back To H.aRchers</Link>
        </div>
    </div>
</div>
  )
}

export default building