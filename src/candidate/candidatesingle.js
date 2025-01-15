import React from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import Default from '../images/defaultimg.jpg';
import { Link } from 'react-router-dom';
import Back from '../images/back.png';
import BotGray from '../images/botgray.png';
import LogoGray from '../images/logogray.png';
import { predict } from '../models/scoring';

function CandidateSingle() {
  const { id } = useParams(); 
  const [candData, setcandData] = useState(null);

  useEffect(() => {
    // Fetch job data from Supabase
    const fetchCandidate = async () => {
      try {
        const { data, error } = await supabase
          .from('candidate') // Your table name
          .select('*')
          .eq('id', id) // Match the ID with the dynamic route param
          .single(); // Get a single row based on the ID

        if (error) {
          throw error;
        }

        setcandData(data); // Set job data state
      } catch (error) {
        console.error('Error fetching Candidate data:', error);
      }
    };

    fetchCandidate();
  }, [id]); // Re-fetch data if the ID changes

  if (!candData) {
    return <div>Loading Candidate data...</div>;
  }

  const birthyear = new Date(candData.birthday).getFullYear();
  const now = new Date().getFullYear();
  const age = now - birthyear;



  const totalExperienceYears = candData.experience.reduce((total, exp) => {
    const startYear = new Date(exp.startDate).getFullYear();
    const endYear = new Date(exp.endDate).getFullYear();
    return total + (endYear - startYear);
  }, 0);


  

  // Function to map degree to score (1 to 6)
  const getDegreeScore = (degreeArray) => {
    // Extract the last degree entry from the array
    const lastDegree = degreeArray[degreeArray.length - 1]?.degree; // Assuming 'degree' is the field in each object

    // Degree mapping from string to score (1 to 6)
    const degreeMapping = {
        "None": 1,
        "Associate Degree": 2,
        "Certificate": 3,
        "Bachelor's Degree": 4,
        "Master's Degree": 5,
        "Doctorate": 6,
    };

    // Return the mapped score, defaulting to 1 if no degree or invalid degree
    return degreeMapping[lastDegree] || 1;
};
  
// Function to calculate gap between consecutive experiences
const calculateGaps = (experienceArray) => {
  let totalGap = 0;

  for (let i = 0; i < experienceArray.length - 1; i++) {
      const currentEndDate = new Date(experienceArray[i].endDate);
      const nextStartDate = new Date(experienceArray[i + 1].startDate);

      // Calculate the gap in years between consecutive experiences
      const gapInMilliseconds = nextStartDate - currentEndDate;
      const gapInYears = gapInMilliseconds / (1000 * 60 * 60 * 24 * 365.25); // Convert milliseconds to years

      totalGap += gapInYears;
  }

  return totalGap;
};




  // Get the degree score (no need for an array)
  const degreeScore = getDegreeScore(candData.degree);
  
  const gap = calculateGaps(candData.experience); // Replace with actual value
  
  
  const techTotal = candData.technology.length;
  // Get the final score
  const X_new = [totalExperienceYears, degreeScore, gap, techTotal];
  
  let score = predict(X_new);

  // Round to two decimal places and ensure it does not exceed 10
  score = parseFloat(score.toFixed(2)); // Round to two decimals
  score = Math.min(score, 10);

  const getEvaluationText = (score) => {
    if (score >= 9) {
      return 'This candidate is exceptional, showcasing outstanding abilities and a comprehensive set of skills. Their performance is consistently excellent, and they demonstrate a level of expertise that is hard to match. Their qualifications and experience are top-tier, and they stand out as a leader in their field. They possess a remarkable ability to solve complex problems and think critically, making them a truly exceptional individual with a high level of promise for any future endeavors.';
    } else if (score >= 8) {
      return 'A highly capable individual with great potential. They have a strong set of skills and a solid foundation of experience, showing a high level of competence in their field. Their performance is consistently strong, and they are driven to succeed. There are areas where further refinement could elevate their abilities, but overall, they demonstrate a commendable proficiency and a clear pathway to even greater success.';
    } else if (score >= 7) {
      return 'This individual is well-qualified and displays a solid set of skills and experience. They consistently perform well and have shown the ability to handle a variety of tasks effectively. While there is room for growth and development in certain areas, their overall performance is strong, and they are likely to continue improving with time and support.';
    } else if (score >= 6) {
      return 'This candidate has a solid foundation and possesses a good set of core skills. However, there are noticeable areas for improvement. With some additional guidance and experience, they can further refine their abilities and address the gaps in their performance. While their progress may require time and effort, they have the potential to grow and succeed with continued development.';
    } else if (score >= 5) {
      return 'The individual meets the basic expectations, though there are several areas where improvement is necessary. While they possess some fundamental skills, their overall performance lacks consistency, and there are clear gaps in their experience. With focused training and effort, they could address these areas of weakness and improve significantly over time.';
    } else if (score >= 4) {
      return 'This candidate exhibits a number of significant weaknesses. While they possess some basic skills, they require substantial development in many areas. They would need considerable time, support, and training to reach a level where they could confidently perform at a satisfactory standard. There is much room for growth, but their current performance is far below optimal.';
    } else if (score >= 3) {
      return 'This individual shows multiple areas of concern. They lack the necessary skills and experience to perform at a satisfactory level and would struggle significantly to meet basic expectations. Their current abilities are far from the standard required, and substantial effort would be needed to help them improve. They are not currently in a position to take on significant tasks without significant mentorship and guidance.';
    } else if (score >= 2) {
      return 'This individual demonstrates major deficiencies in essential skills and knowledge. They are currently not equipped to handle the demands of most situations and would need a great deal of intervention and support to make any meaningful progress. Their potential is hard to gauge at this stage, as they lack the foundational abilities required for success.';
    } else if (score >= 1) {
      return 'The score reflects a very limited skill set with numerous deficiencies. This individual is currently not capable of performing basic tasks and would need a complete overhaul of their abilities before they could be considered for more complex roles. They are far from the standard required for most activities, and their progress would require extensive re-skilling.';
    } else {
      return 'No evaluation available. The provided score does not give sufficient information to form a comprehensive assessment of the individual’s qualifications or capabilities.';
    }  
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
         <div className="col-span-12 xl:col-span-8">
            <div className="displayblock">
                 <div className="candheader">
                     <div>
                        <img src={Default} alt="Profile Icon" className="profile-image"/>
                        <div>
                            <span>{candData.state}</span>
                            <h4>{candData.title}</h4>
                            <h1>{candData.name}</h1>
                        </div>
                        
                     </div>
                     <Link to="/core/candidates/">
                            <img src={Back} alt="Back Icon"/>
                     </Link>
                 </div>

                 <div className="displayElement" style={{marginTop:'20px'}}>
                    <h4>Education:</h4>
                    {candData.degree.map((degree)=>(
                        <div className="elementItem">
                            <div>
                                <h1>{degree.degree}</h1>
                                <h2>{degree.discipline}</h2>
                            </div>
                            <div>
                                <h3>{new Date(degree.startDate).getFullYear()} - {new Date(degree.endDate).getFullYear()}</h3>
                            </div>
                        </div>
   
                    ))}
                 </div>

                 <div className="displayElement" style={{marginTop:'20px'}}>
                    <h4>Experience:</h4>
                    {candData.experience.map((exp)=>(
                        <div className="elementItem">
                            <div>
                                <h1>{exp.company}</h1>
                                <h2>{exp.position}</h2>
                            </div>
                            <div>
                                <h3>{new Date(exp.startDate).getFullYear()} - {new Date(exp.endDate).getFullYear()}</h3>
                            </div>
                        </div>
   
                    ))}
                 </div>

                 

            </div>
         </div>
         <div className="col-span-12 xl:col-span-4">
            
            <div className="displayblock" style={{marginBottom:'20px'}}>
                <div className="displayStats">
                    <div>
                        <span>{age} </span> Years Old
                    </div>
                    <div>
                        <span>{totalExperienceYears} </span> Years Of Experience
                    </div>
                </div>
            </div>
        
            
            
            
            <div className="displayblock">

                <div className="displayElement">
                    <h4>Technologies</h4>
                    {candData.technology.map((tech, index)=>(
                        <span>{tech.technology}
                        {index < candData.technology.length - 1 && ', '}
                        </span>
                    ))}
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 xl:col-span-1">
                        <div className="displayElement" style={{marginTop:'20px'}}>
                            <h4>Marital Status</h4>
                            {candData.status}
                        </div>
                    </div>
                    <div className="col-span-2 xl:col-span-1">
                        <div className="displayElement" style={{marginTop:'20px'}}>
                            <h4>Location</h4>
                            {candData.location}
                        </div>
                    </div>
                 </div>

            </div>

            <div className="displayblock" style={{marginTop:'20px'}}>
                 <div className="blockAIeval">
                    <div>
                        <img src={LogoGray} alt="Logo Gray"/>
                        <h2>AI Evaluation Of The Candidate</h2>
                    </div>
                    <img src={BotGray} alt="Bot Gray"/>
                 </div>
                 <div className="displayElement">
                    <h4>Score: <span>{score}/10</span></h4>
                    {getEvaluationText(score)}
                 </div>
            </div>
         </div>
      </div>

    </>
  )
}

export default CandidateSingle