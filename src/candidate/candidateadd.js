import React from 'react'
import Default from '../images/defaultimg.jpg';
import {predict} from '../models/scoring';
import { classify } from '../models/screening';
import supabase from '../supabaseClient';

function CandidateAdd({data,jobid,refresh,count,reload,jobDegree}) {
  
  
    const totalExperienceYears = data.experience.reduce((total, exp) => {
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
    const degreeScore = getDegreeScore(data.degree);
    
    const gap = calculateGaps(data.experience); // Replace with actual value
    
    
    const techTotal = data.technology.length;
    // Get the final score
    const X_new = [totalExperienceYears, degreeScore, gap, techTotal];
    
    let score = predict(X_new);
  
    // Round to two decimal places and ensure it does not exceed 10
    score = parseFloat(score.toFixed(2)); // Round to two decimals
    score = Math.min(score, 10);


    const compareDegree = (jobDegree, candidateDegrees) => {
      // Check if jobDegree exists in candidateDegrees' degree key
      return candidateDegrees.some(degreeObj => degreeObj.degree === jobDegree.degree) ? 1 : 0;
    };

    const DegreeEval = compareDegree(jobDegree.degree,data.degree);

    const compareDiscipline = (jobDiscipline, candidateDisciplines) => {
      return candidateDisciplines.some(disiplineObj => disiplineObj.discipline === jobDiscipline.discipline) ? 1:0;
    };

    const DisciplineEval = compareDiscipline(jobDegree.discipline, data.degree);

    const compareTechnologies = (jobTechnologies, candidateTechnologies) => {
      // Parse the jobTechnologies string to get the actual array of technologies
      const jobTechArray = JSON.parse(jobTechnologies); 
    
      // Count how many matches there are between jobTechArray and candidateTechnologies
      const matches = candidateTechnologies.filter(candidateTech => 
        jobTechArray.includes(candidateTech.technology)
      );
      
      return matches.length;
    };
    
    // Assuming jobDegree has a technology key and it's an array of technologies
    const TechnologyEval = compareTechnologies(jobDegree.technology, data.technology);

    const screening = classify([DegreeEval,score,DisciplineEval,TechnologyEval]);   
   

    const addToJob = async () => {
        try {
          const { data: insertedData, error } = await supabase
            .from('application')
            .insert([
              {
                job_id: jobid, // Foreign key for job
                candidate_id: data.id, // Foreign key for candidate
                score:score, // AI Score
                status:screening,
              },
            ]);
    
          if (error) throw error;
          console.log('Row added successfully:', insertedData);
          refresh();
          count();
          reload();

        } catch (err) {
          console.error('Error adding candidate to job:', err.message);
        }
      };

      

  return (
    <div className="CandidateAdd col-span-12 lg:col-span-6 xl:col-span-3">

        <div>
            <img src={Default} className="round-image" alt="Default Candidate"/>
            <div>
                <h4>{data.title}</h4>
                <h2>{data.name}</h2>
            </div>
        </div>

        <div className="CandAddFoot">

            <button className="CandidateButton" onClick={addToJob}>Add To Job</button>
            <div>
                <h4>AI Score:</h4>
                <h2><span>{score}</span>/10</h2>
            </div>
        </div>

    </div>
  )
}

export default CandidateAdd