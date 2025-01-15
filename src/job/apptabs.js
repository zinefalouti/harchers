import React, { useState, useEffect } from 'react';
import Candidate from './candidatemin';
import Next from '../images/next.png';
import Prev from '../images/prev.png';
import Bot from '../images/bot.png';
import supabase from '../supabaseClient';
import Def from '../core/default';

function AppTabs({ jobid, count, reload, refresh, tab, jobDegree}) {
  const [candidatesWithJob, setCandidatesWithJob] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 4;

  // Fetch candidates with job_id and status filter
  useEffect(() => {
    const fetchCandidatesWithJob = async () => {
      try {
        const { data: allCandidates, error: candidatesError } = await supabase
          .from('candidate')
          .select('*');
        if (candidatesError) throw candidatesError;
  
        let query = supabase
          .from('application')
          .select('candidate_id, status')
          .eq('job_id', jobid);
  
        // Apply filter based on the tab value
        if (tab === '0') {
          query = query.eq('status', 0);
        } else if (tab === '1') {
          query = query.eq('status', 1);
        }
  
        const { data: candidatesWithJob, error: appError } = await query;
        if (appError) throw appError;
  
        const candidatesWithJobIds = new Set(
          candidatesWithJob.map((app) => app.candidate_id)
        );
        const filteredCandidates = allCandidates.filter((candidate) =>
          candidatesWithJobIds.has(candidate.id)
        );
  
        setCandidatesWithJob(filteredCandidates);
        setTotalPages(Math.ceil(filteredCandidates.length / itemsPerPage));
      } catch (err) {
        console.error('Error fetching candidates:', err.message);
      }
    };
  
    fetchCandidatesWithJob();
  }, [jobid, tab]); // Fetch candidates when jobid or tab changes
  

  const paginatedCandidates = candidatesWithJob.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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


  return (
    <>
      <div className="mt-8 mb-8">

        {paginatedCandidates.length === 0 ? (
          <div className="col-span-12">
            <Def message="No application is available at the moment!" />
          </div>
        ) : (
          paginatedCandidates.map((candidate) => (
            <Candidate
              key={candidate.id}
              data={candidate}
              jobid={jobid}
              count={count}
              reload={reload}
              refresh={refresh}
              jobDegree={jobDegree}
            />
          ))
        )}
      </div>

      <div className="displayFoot">
        <div>
          {currentPage > 1 && (
            <button onClick={handlePrevPage}>
              <img src={Prev} alt="Previous" />
            </button>
          )}
          {currentPage < totalPages && (
            <button onClick={handleNextPage}>
              <img src={Next} alt="Next" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default AppTabs;
