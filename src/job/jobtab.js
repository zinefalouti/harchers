import React, { useState, useEffect } from 'react';
import AddBtn from '../images/addbtn.png';
import Next from '../images/next.png';
import Prev from '../images/prev.png';
import supabase from '../supabaseClient';
import CandidateAdd from '../candidate/candidateadd';
import Close from '../images/close.png';
import AppTabs from './apptabs';
import Def from '../core/default';
import Bot from '../images/botgray.png';

function JobTab({ id, remDays, jobTitle, jobDegree }) {
  const [applicationCount, setApplicationCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false); // Manage modal visibility
  const [candidatesWithoutJob, setCandidatesWithoutJob] = useState([]); // New state for candidates without job
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 8;

  const [reloadKey, setReloadKey] = useState(0); // Key to trigger re-render

  function ReloadAppTabs(){
    setReloadKey((prevKey) => prevKey + 1); // Increment key to force re-rende
  }

  // Fetch application count when the component mounts
  useEffect(() => {
    const fetchApplicationCount = async () => {
      try {
        const { data: appData, error } = await supabase
          .from('application')
          .select('job_id')
          .eq('job_id', id); // Use the job id passed as a prop

        if (error) throw error;

        setApplicationCount(appData.length); // Set the count of applications for this job
      } catch (err) {
        console.error("Error fetching application count:", err.message);
      }
    };

    fetchApplicationCount();
  }, [id]); // Re-run effect when job id changes

  const fetchApplicationCount = async () => {
    try {
      const { data: appData, error } = await supabase
        .from('application')
        .select('job_id')
        .eq('job_id', id); // Use the job id passed as a prop

      if (error) throw error;

      setApplicationCount(appData.length); // Set the count of applications for this job
    } catch (err) {
      console.error("Error fetching application count:", err.message);
    }
  };


  // Fetch candidates without job_id (those not in the application table)
  useEffect(() => {
    const fetchCandidatesWithoutJob = async () => {
      try {
        const { data: allCandidates, error: candidatesError } = await supabase
          .from('candidate')
          .select('*'); // Get all candidates

        if (candidatesError) throw candidatesError;

        const { data: candidatesWithJob, error: appError } = await supabase
          .from('application')
          .select('candidate_id')
          .eq('job_id', id); // Fetch applications for the given job_id

        if (appError) throw appError;

        const candidatesWithJobIds = new Set(candidatesWithJob.map((app) => app.candidate_id));
        const filteredCandidates = allCandidates.filter(
          (candidate) => !candidatesWithJobIds.has(candidate.id)
        );

        setCandidatesWithoutJob(filteredCandidates);
        setTotalPages(Math.ceil(filteredCandidates.length / itemsPerPage)); // Calculate total pages
      } catch (err) {
        console.error('Error fetching candidates without job:', err.message);
      }
    };

    fetchCandidatesWithoutJob();
  }, [id]);


  const fetchCandidatesWithoutJob = async () => {
    try {
      const { data: allCandidates, error: candidatesError } = await supabase
        .from('candidate')
        .select('*'); // Get all candidates

      if (candidatesError) throw candidatesError;

      const { data: candidatesWithJob, error: appError } = await supabase
        .from('application')
        .select('candidate_id')
        .eq('job_id', id); // Fetch applications for the given job_id

      if (appError) throw appError;

      const candidatesWithJobIds = new Set(candidatesWithJob.map((app) => app.candidate_id));
      const filteredCandidates = allCandidates.filter(
        (candidate) => !candidatesWithJobIds.has(candidate.id)
      );

      setCandidatesWithoutJob(filteredCandidates);
      setTotalPages(Math.ceil(filteredCandidates.length / itemsPerPage)); // Calculate total pages
      
    } catch (err) {
      console.error('Error fetching candidates without job:', err.message);
    }
  };
  

    // Paginated candidates for the current page
    const paginatedCandidates = candidatesWithoutJob.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  
    // Handlers for pagination buttons
    const handleNextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    };
  
    const handlePrevPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };

  // Function to toggle the modal visibility
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };


  const [tab, setTab] = useState('all'); // Default to 'all'

  const handleFilterChange = (filter) => {
    setTab(filter); // Update the tab state with the selected filter
  };
  

  return (
    <>
      <div className="displayblock">
        <div className="displayTabs">
          <button
            onClick={() => handleFilterChange('all')}
            className={tab === 'all' ? 'active' : ''}
          >
            Initial Pool
          </button>
          <button
            onClick={() => handleFilterChange('0')}
            className={tab === '0' ? 'active' : ''}
          >
            Eliminated
          </button>
          <button
            onClick={() => handleFilterChange('1')}
            className={tab === '1' ? 'active' : ''}
          >
            Selected
          </button>
        </div>
      </div>
      
      <div className="displayblock" style={{ marginTop: "15px" }}>
        <div className="displayStats">
          <div>
            <span>{applicationCount}</span> Candidates
          </div>
          <div>
            <span>{remDays}</span> Days Remaining
          </div>
          <button onClick={toggleModal}>
            <img src={AddBtn} alt="Add Button" />
          </button>
        </div>
        <div id="applications">
        <AppTabs 
        key={reloadKey} 
        jobid={id} 
        count={fetchApplicationCount} 
        reload={ReloadAppTabs} 
        refresh={fetchCandidatesWithoutJob} 
        tab={tab} 
        jobDegree={jobDegree}
        />
        </div>
      </div>

      {/* Modal */}
      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal container mx-auto px-4">
            <div className="modal-content">
              <div className="modal-close">
                 <div>
                    <img src={Bot} alt="HaRchers AI"/>
                    <div>
                    <h4>Add Candidates To Job: <span>{jobTitle}</span></h4>
                    <h1>H.aRchers AI will automatically screen and eliminate or select a candidate for this job.</h1>
                    </div>
                 </div>
                 <button onClick={toggleModal}><img src={Close} alt="Close"/></button>
              </div>
              <div className='grid grid-cols-12 gap-4'>
                      {/* Render candidates without a job */}
                      {paginatedCandidates.length === 0?(
                         <div className="col-span-12"><Def message="No candidate is available at the moment!"/></div>
                      ):(
                      paginatedCandidates.map((candidate) => (
                          <CandidateAdd 
                          data={candidate} 
                          jobid={id} 
                          refresh={fetchCandidatesWithoutJob} 
                          count={fetchApplicationCount}
                          reload={ReloadAppTabs}
                          jobDegree={jobDegree}
                          />
                      )))}
                    
              </div>
              <div className="displayFoot">
                  {/* Show Prev button only if applicable */}
                  {currentPage > 1 && (
                    <button onClick={handlePrevPage}>
                      <img src={Prev} alt="Previous" />
                    </button>
                  )}
                  {/* Show Next button only if applicable */}
                  {currentPage < totalPages && (
                    <button onClick={handleNextPage}>
                      <img src={Next} alt="Next" />
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default JobTab;
