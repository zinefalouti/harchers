import React from 'react'
import Default from '../images/defaultimg.jpg';
import { Link } from 'react-router-dom';
import Close from '../images/close.png';
import supabase from '../supabaseClient';

function candidatemin({data, jobid, count, reload, refresh, jobDegree}) {

    // Function to remove the application
    const handleRemoveApplication = async () => {
      try {
        // Delete the application from the 'application' table where job_id and candidate_id match
        const { error } = await supabase
          .from('application')
          .delete()
          .eq('job_id', jobid) // Use jobid passed as prop
          .eq('candidate_id', data.id); // Use data.id (candidate_id)
  
        if (error) {
          throw error;
        }
  
        // Optionally, handle UI updates or provide feedback to the user
        console.log("Application removed successfully");
        count();
        reload();
        refresh();
        // You can add code here to notify the user or refresh the UI
      } catch (error) {
        console.error("Error removing application:", error.message);
      }
    };
    
    

  return (
    <div className="CandidateMin">
        <div>
            <img src={Default} className="round-image" alt="Default Candidate"/>
            <div>
                <h4>{data.title}</h4>
                <Link to={`/core/candidates/single/${data.id}`}><h2>{data.name}</h2></Link>
            </div>
            
        </div>
        <button><img src={Close} onClick={handleRemoveApplication} alt="Remove Application"/></button>
    </div>
  )
}

export default candidatemin