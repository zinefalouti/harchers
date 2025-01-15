import React from 'react'
import Clock from '../images/clock.png';
import Loc from '../images/location.png';
import Arrow from '../images/arrow.png';
import { Link } from 'react-router-dom';
import supabase from '../supabaseClient';
import { useState, useEffect } from 'react';

function JobBlock({data}) {

    // Get current date and deadline
    const currentDate = new Date();
    const deadline = new Date(data.deadline); // Ensure deadline is a Date object
  
    // Calculate remaining days
    const currentTimestamp = currentDate.getTime();
    const deadlineTimestamp = deadline.getTime();
    const diffInMs = deadlineTimestamp - currentTimestamp;
    const remaining = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    const formattedRemaining = remaining >= 1000 
        ? `${(remaining / 1000).toFixed(1)}k` 
        : `${remaining}`;

        const [applicationCount, setApplicationCount] = useState(0);
        const { id } = data; // Assuming data is the job object and contains an id
        
        useEffect(() => {
          const fetchApplicationCount = async () => {
            try {
              const { data: appData, error } = await supabase
                .from('application')
                .select('job_id')
                .eq('job_id', id);
        
              if (error) throw error;
        
              // Set the count of applications for this job
              setApplicationCount(appData.length); // appData will contain all entries for this job_id
            } catch (err) {
              console.error("Error fetching application count:", err.message);
            }
          };
        
          fetchApplicationCount();
        }, [id]); // Re-run effect when job id changes

  return (
    <div className="col-span-12 lg:col-span-6 xl:col-span-3 jobblock">
        <div className="jobhead">
            <span>{data.state}</span>
            <span>{data.discipline}</span>
        </div>
        <h1>{data.name}</h1>
        <div className="jobinfo">
            <div>
                <img src={Clock} alt="Job Type"/>
                {data.jobtype}
            </div>
            <div>
                <img src={Loc} alt="Location"/>
                {data.location}
            </div>
        </div>
        <div className="jobstat">
            <div>
                <span>{applicationCount} </span> Applications
            </div>
            <div>
                <span>{formattedRemaining}</span> Days Remaining
            </div>
        </div>
        <Link to={`/core/job/${data.id}`}  className="job-link">
            View Details
            <img src={Arrow} alt="Arrow"/> 
        </Link>
    </div>
  )
}

export default JobBlock