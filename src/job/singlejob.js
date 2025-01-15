import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../supabaseClient';
import BackBtn from '../images/back.png';
import { Link } from 'react-router-dom';
import Degree from '../images/degree.png';
import Exp from '../images/experience.png';
import Tech from '../images/tech.png';
import DateIcon from '../images/date.png';
import Clock from '../images/clock.png';
import Location from '../images/location.png';
import JobTab from './jobtab';

function SingleJob() {
    const { id } = useParams(); // This gets the dynamic id from the URL
    const [jobData, setJobData] = useState(null);
  
    useEffect(() => {
      // Fetch job data from Supabase
      const fetchJob = async () => {
        try {
          const { data, error } = await supabase
            .from('jobs') // Your table name
            .select('*')
            .eq('id', id) // Match the ID with the dynamic route param
            .single(); // Get a single row based on the ID
  
          if (error) {
            throw error;
          }
  
          setJobData(data); // Set job data state
        } catch (error) {
          console.error('Error fetching job data:', error);
        }
      };
  
      fetchJob();
    }, [id]); // Re-fetch data if the ID changes
  
    if (!jobData) {
      return <div>Loading job data...</div>;
    }
  
    // Format the created_at date
    const formattedDate = new Date(jobData.created_at).toLocaleString();
  
    // Get current date and deadline
    const currentDate = new Date();
    const deadline = new Date(jobData.deadline); // Ensure deadline is a Date object
  
    // Calculate remaining days
    const currentTimestamp = currentDate.getTime();
    const deadlineTimestamp = deadline.getTime();
    const diffInMs = deadlineTimestamp - currentTimestamp;
    const remaining = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    const formattedRemaining = remaining >= 1000 
        ? `${(remaining / 1000).toFixed(1)}k` 
        : `${remaining}`;
  
    // Edit Job State
    const updateJobDeadline = async (jobId, newState) => {
      try {
        // Update the state for the specific job in the 'jobs' table
        const { data, error } = await supabase
          .from('jobs') // Specify the table you're working with
          .update({ state: newState }) // Specify the column and the new value
          .eq('id', jobId); // Use the job ID to find the correct row to update
  
        // Check for errors and handle accordingly
        if (error) {
          throw new Error(error.message);
        }
  
        // Log success and return the updated data
        console.log('Job updated successfully:', data);
  
        // Re-fetch job data after the state update
        const { data: updatedData, error: fetchError } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', jobId)
          .single();
  
        if (fetchError) {
          throw new Error(fetchError.message);
        }
  
        setJobData(updatedData); // Update jobData state with the latest data
  
      } catch (error) {
        console.error('Error updating job:', error);
        // Optionally show an error notification or alert
      }
    };
  
  

  return (
    <div className="grid grid-cols-12 gap-4">
       <div className="col-span-12 lg:col-span-8">
          <div className="displayblock">
             <div className="info">
                <span className="enabled">{jobData.state}</span>
                <span className="disabled">{jobData.discipline}</span>
             </div>
             <div className="displayheader">
                <h1>{jobData.name}</h1>
                <div>
                        <>
                        {jobData.state === 'Open' && (
                        <>
                            <button onClick={() => updateJobDeadline(id, "On Hold")} className="secondary">Put on Hold</button>
                            <button onClick={() => updateJobDeadline(id, "Closed")} className="primary">Close Job</button>
                        </>
                        )}
                        {jobData.state === 'On Hold' && (
                        <>
                            <button onClick={() => updateJobDeadline(id, "Closed")} className="secondary">Close</button>
                            <button onClick={() => updateJobDeadline(id, "Open")} className="primary">Open</button>
                        </>
                        )}
                        {jobData.state !== 'Open' && jobData.state !== 'On Hold' && (
                        <>
                            <button onClick={() => updateJobDeadline(id, "On Hold")} className="secondary">Put on Hold</button>
                            <button onClick={() => updateJobDeadline(id, "Open")} className="primary">Open</button>
                        </>
                        )}
                    </>
                    <Link to="/core">
                        <img src={BackBtn} alt="Back Button" />
                    </Link>
                </div>
             </div>
             <div className="displayElement">
                <h4>About Us:</h4>
                <p>
                    {jobData.company}
                </p>
             </div>
             <div className="displayElement">
                <h4>Job Summary:</h4>
                <p>
                    {jobData.summary}
                </p>
             </div>
             <div className="displayElement">
                <h4>Required Qualifications:</h4>
                <div className="subElement">
                   <img src={Degree} alt="Degree Icon"/>
                   {jobData.degree} in {jobData.discipline}
                </div>
                <div className="subElement">
                   <img src={Exp} alt="Degree Icon"/>
                   {jobData.experience} years of experience
                </div>
                <div className="subElement">
                   <img src={Tech} alt="Degree Icon"/>
                    {/* Check if jobData.technology is already an array, if not, parse it */}
                    <span>
                    {Array.isArray(jobData.technology)
                        ? jobData.technology.join(', ')  // If it's an array, join the items
                        : JSON.parse(jobData.technology).join(', ')}  {/* If it's a string, parse it into an array and join */}
                    </span>
                </div>
             </div>

             <div className="displayFooter">
                <div>
                   <img src={DateIcon} alt="Date Icon"/>
                   Posted by <span>{jobData.recruiter}</span> on {formattedDate}
                </div>

                <div>
                    <div>
                        <img src={Clock} alt="Clock Icon"/>
                        {jobData.jobtype}
                    </div>
                    <div>
                        <img src={Location} alt="Location Icon"/>
                        {jobData.location}
                    </div>
                </div>
             </div>
             
          </div>
       </div>
       <div className="col-span-12 lg:col-span-4">
          <JobTab id={jobData.id} remDays={formattedRemaining} jobTitle={jobData.name} jobDegree={jobData}/>
       </div>
    </div>
  );
}

export default SingleJob;
