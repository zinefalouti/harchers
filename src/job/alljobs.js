import React from 'react'
import supabase from '../supabaseClient';
import JobBlock from './jobblock';
import { useEffect, useState } from 'react';
import Next from '../images/next.png';
import Prev from '../images/prev.png';
import Def from '../core/default';

function AllJobs() {

    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [order, setOrder] = useState('latest'); // Default order
    const [status, setStatus] = useState('all'); // Default status
    const [category, setCategory] = useState('all'); // Default category
    const jobsPerPage = 8;

      
    const [closedCount, setClosedCount] = useState(0);
    const [onHoldCount, setOnHoldCount] = useState(0);
    const [openCount, setOpenCount] = useState(0);

    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    

    // Fetch jobs from the database
    useEffect(() => {
      const fetchJobs = async () => {
        try {
          const query = supabase.from('jobs').select('*');
          
          // Apply filters dynamically
          if (status !== 'all') {
            query.eq('state', status); // Filter by status
          }
          if (category !== 'all') {
            query.eq('discipline', category); // Filter by category
          }
          
          // Apply sorting based on selected order
          if (order === 'latest') {
            query.order('created_at', { ascending: false }); // Sort by latest
          } else {
            query.order('created_at', { ascending: true }); // Sort by oldest
          }

          const { data, error } = await query;
          if (error) throw error;
          setJobs(data);
          setCurrentPage(1); // Reset to the first page on new filter
        } catch (err) {
          setError(err.message);
        }
      };

      fetchJobs();
    }, [order, status, category]); // Re-run whenever filters change

    const currentJobs = jobs.slice(startIndex, endIndex); // Slice jobs for the current page

    const totalPages = Math.ceil(jobs.length / jobsPerPage); // Calculate total pages

    // Handlers for pagination
    const handleNext = () => {
      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrev = () => {
      if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleFilterChange = (e) => {
      const { id, value } = e.target;
      if (id === 'order') {
        setOrder(value);
      } else if (id === 'status') {
        setStatus(value);
      } else if (id === 'category') {
        setCategory(value);
      }
    };

    useEffect(() => {
      const fetchJobCountsByState = async () => {
        try {
          // Fetch Closed jobs count
          const { data: closedJobs, error: closedError } = await supabase
            .from('jobs')
            .select('*', { count: 'exact' })
            .eq('state', 'Closed');
          if (closedError) throw closedError;
          setClosedCount(closedJobs.length);
  
          // Fetch On Hold jobs count
          const { data: onHoldJobs, error: onHoldError } = await supabase
            .from('jobs')
            .select('*', { count: 'exact' })
            .eq('state', 'On Hold');
          if (onHoldError) throw onHoldError;
          setOnHoldCount(onHoldJobs.length);
  
          // Fetch Open jobs count
          const { data: openJobs, error: openError } = await supabase
            .from('jobs')
            .select('*', { count: 'exact' })
            .eq('state', 'Open');
          if (openError) throw openError;
          setOpenCount(openJobs.length);
        } catch (err) {
          setError(err.message);
        }
      };
  
      fetchJobCountsByState();
    }, []);

    if (error) {
      return <p>Error: {error}</p>;
    }

  return (
    <>
    <div className="grid grid-cols-12 gap-4 flex content-center">
        {/* Filter Head */}
        <div className="col-span-12 xl:col-span-4 flex">
           <div className="filterblock">
              <h4>Open Jobs <span>{openCount}</span></h4>
              <h4>Closed Jobs <span>{closedCount}</span></h4>
              <h4>On Hold Jobs <span>{onHoldCount}</span></h4>
           </div>
        </div>
        <div className="col-span-12 xl:col-span-2 xl:col-start-7 flex publicSelect">
           <select id="order" value={order} onChange={handleFilterChange}>
              <option value="latest">By Latest</option>
              <option value="oldest">By Oldest</option>
           </select>
        </div>
        <div className="col-span-12 xl:col-span-2 flex publicSelect">
            <select id="status" value={status} onChange={handleFilterChange}>
              <option value="all">All Status</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="On Hold">On Hold</option>
            </select>
        </div>
        <div className="col-span-12 xl:col-span-2 flex publicSelect">
             <select id="category" value={category} onChange={handleFilterChange}>
                <option value="all">All Categories</option>
                <option value="Accounting">Accounting</option>
                <option value="Architecture">Architecture</option>
                <option value="Art and Design">Art and Design</option>
                <option value="Business Administration">Business Administration</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Economics">Economics</option>
                <option value="Education">Education</option>
                <option value="Engineering">Engineering</option>
                <option value="Environmental Science">Environmental Science</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Humanities">Humanities</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Law">Law</option>
                <option value="Liberal Arts">Liberal Arts</option>
                <option value="Management">Management</option>
                <option value="Marketing">Marketing</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Medicine">Medicine</option>
                <option value="Nursing">Nursing</option>
                <option value="Performing Arts">Performing Arts</option>
                <option value="Philosophy">Philosophy</option>
                <option value="Physics">Physics</option>
                <option value="Political Science">Political Science</option>
                <option value="Psychology">Psychology</option>
                <option value="Public Health">Public Health</option>
                <option value="Social Work">Social Work</option>
                <option value="Sociology">Sociology</option>
                <option value="Sports Management">Sports Management</option>
                <option value="Statistics">Statistics</option>
                <option value="Other">Other</option>
             </select>
        </div>
        
    </div>
    <div className="grid grid-cols-12 gap-4">

        { currentJobs.length === 0 ? (
            <div className="col-span-12"><Def message="No jobs available at the moment!"/></div>
        ):(
          currentJobs.map((job)=>(
            <JobBlock data={job}/>
         ))
        )
        }
 
    </div>
    <div className="pagination-controls">
        {currentPage > 1 && (
          <button onClick={handlePrev}>
            <img src={Prev} alt="Previous" />
          </button>
        )}
        {currentPage < totalPages && (
          <button onClick={handleNext}>
            <img src={Next} alt="Next" />
          </button>
        )}
      </div>

    </>
  )
}

export default AllJobs