import React from 'react'
import Iconblock from './iconblock'
import Icon1 from '../images/why-icon1.png'
import Icon2 from '../images/why-icon2.png'
import Icon3 from '../images/why-icon3.png'
import Icon4 from '../images/why-icon4.png'

function why() {
  return (
    <>
    
        <div className="why-title">
            <h1>Why <span>H.aRchers?</span></h1>
            <p>
            H.aRchers is designed to simplify recruitment tasks and empower HR experts with AI-driven tools 
            for smarter decision-making. From screening resumes to matching candidates with job roles, our platform 
            offers practical solutions to help you save time and focus on what matters most—finding the right talent.
            </p>
        </div>

        <div className="grid grid-cols-4 gap-4">
            <Iconblock 
            icon={Icon1} 
            title="Smart Candidate Screening"
            text="Filter and evaluate candidates instantly using AI-driven 
            screening tools that highlight key qualifications 
            and skills."
            />
            <Iconblock 
            icon={Icon2} 
            title="Automated Job Matching"
            text="Quickly match candidates to job roles with machine learning algorithms designed to simplify decision-making."
            />
            <Iconblock 
            icon={Icon3} 
            title="Fast Resume Parsing"
            text="Extract and organize candidate details automatically, saving time and ensuring accurate data processing."
            />
            <Iconblock 
            icon={Icon4} 
            title="Unified Management Panel"
            text="Control jobs, applications, and candidate profiles all in one place, with a clean and responsive interface."
            />
        </div>

    </>
  )
}

export default why