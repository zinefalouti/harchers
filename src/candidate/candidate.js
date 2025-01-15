import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient'; // Adjust the path based on your project structure.
import Loc from '../images/location.png';
import Profile from '../images/defaultimg.jpg';
import Deg from '../images/degree.png';
import Exp from '../images/experience.png';
import Prev from '../images/prev.png';
import Next from '../images/next.png';
import { Link } from 'react-router-dom';
import Arrow from '../images/arrow.png';
import Def from '../core/default';

function Candidate() {
  const [candidates, setCandidates] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    degree: 'all',
    discipline: 'all',
  });
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const itemsPerPage = 8; // Candidates per page

  const [totals, setTotals] = useState({
    hired: 0,
    onLookout: 0,
    available: 0,
  });


  // Fetch data from Supabase on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('candidate')
          .select('*')
          ;

        if (error) {
          console.error('Error fetching candidates:', error);
        } else {
          setCandidates(data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } 
    };

    fetchData();
  }, []);

  // Filter candidates based on dropdown selections
  const filteredCandidates = candidates.filter((candidate) => {
    const { status, degree, discipline } = filters;

    return (
      (status === 'all' || candidate.state === status) &&
      (degree === 'all' || candidate.degree?.some((edu) => edu.degree === degree)) &&
      (discipline === 'all' || candidate.degree?.some((edu) => edu.discipline === discipline))
    );
  });

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [id]: value,
    }));
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedCandidates = filteredCandidates.slice(startIndex, endIndex);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  function getAge(birth) {
    const birthYear = new Date(birth).getFullYear();
    const now = new Date().getFullYear();
    return now - birthYear;
  }

  function getExp(data) {
    const totalExperienceYears = data.reduce((total, exp) => {
      const startYear = new Date(exp.startDate).getFullYear();
      const endYear = new Date(exp.endDate).getFullYear();
      return total + (endYear - startYear);
    }, 0);

    return totalExperienceYears;  // Return the result
  }

  useEffect(() => {
    const calculateTotals = () => {
      const totals = {
        hired: 0,
        onLookout: 0,
        available: 0,
      };

      candidates.forEach((candidate) => {
        if (candidate.state === 'Hired') {
          totals.hired++;
        } else if (candidate.state === 'On Lookout') {
          totals.onLookout++;
        } else if (candidate.state === 'Available') {
          totals.available++;
        }
      });

      setTotals(totals);
    };

    calculateTotals();
  }, [candidates]);

  // Fetch application counts for each candidate and update the candidates state
  useEffect(() => {
    const fetchApplicationCounts = async () => {
      try {
        const updatedCandidates = await Promise.all(
          candidates.map(async (candidate) => {
            const { data: applicationData, error: applicationError } = await supabase
              .from('application')
              .select('*')
              .eq('candidate_id', candidate.id); // Fetch applications by candidate_id

            if (applicationError) {
              console.error('Error fetching applications:', applicationError);
              return candidate; // If there's an error, return the candidate without updating
            }

            // Add the application count to each candidate
            return {
              ...candidate,
              applicationCount: applicationData.length, // Store the number of applications
            };
          })
        );

        setCandidates(updatedCandidates); // Update candidates state with application counts
      } catch (err) {
        console.error('Unexpected error:', err);
      } 
    };

    fetchApplicationCounts();
  }, [candidates]);


  return (
    <>
    <div className="grid grid-cols-12 gap-4 flex content-center">
        {/* Filter Head */}
        <div className="col-span-12 xl:col-span-4 flex">
           <div className="filterblock">
              <h4>Available <span>{totals.available}</span></h4>
              <h4>Hired <span>{totals.hired}</span></h4>
              <h4>On Lookout <span>{totals.onLookout}</span></h4>
           </div>
        </div>
        <div className="col-span-12 xl:col-span-2 xl:col-start-7 flex publicSelect">
           <select id="status" onChange={handleFilterChange}>
              <option value="all">All Status</option>
              <option value="Available">Available</option>
              <option value="Hired">Hired</option>
              <option value="On Lookout">On Lookout</option>
           </select>
        </div>
        <div className="col-span-12 xl:col-span-2 flex publicSelect">
            <select id="degree" onChange={handleFilterChange}>
              <option value="all">All Degrees</option>
              <option value="Associate Degree">Associate Degree</option>
              <option value="Bachelor's Degree">Bachelor's Degree</option>
              <option value="Master's Degree">Master's Degree</option>
              <option value="Doctorate">Doctorate</option>
              <option value="Certificate">Certificate</option>
              <option value="None">None</option>
            </select>
        </div>
        <div className="col-span-12 xl:col-span-2 flex publicSelect">
             <select id="discipline" onChange={handleFilterChange}>
                <option value="all">All Disciplines</option>
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

    {displayedCandidates.length === 0?(
    <div className="col-span-12"><Def message="No candidate is available at the moment!"/></div>
    ):(
    displayedCandidates.map((candidate)=>(
      <div className="col-span-12 lg:col-span-6 xl:col-span-3">
         <div className="candidateblock">
             <div className="candidatehead">
                <span>{candidate.state}</span>
                <h4>{getAge(candidate.birthday)} Yrs Old</h4>
                <div>
                   <img src={Loc} alt="Location Icon"/>
                   <h4>{candidate.location}</h4>
                </div>
             </div>
             <div className="candidatebody">
                 <img src={Profile} alt="Profile Icon"/>
                 <div>
                    <h4>{candidate.title}</h4>
                    <h1>{candidate.name}</h1>
                 </div>
             </div>
             <div className="candidateinfo">
                <div>
                   <img src={Deg} alt="Degree Icon"/>
                   <h4>{candidate.degree?.[candidate.degree.length -1]?.degree}</h4>
                </div>
                <div>
                   <img src={Exp} alt="Experience Icon"/>
                   <h4>{getExp(candidate.experience)} Years</h4>
                </div>
             </div>
             <div className="candidatefooter">
                <div>
                  <Link to={`/core/candidates/single/${candidate.id}`} className="cand-link">
                    View Details
                    <img src={Arrow} alt="Arrow"/>
                  </Link>
                </div>
                <div>
                   <h3><span>{candidate.applicationCount}</span> Applications</h3>
                </div>
             </div>
         </div>
      </div>
    ))
    )}
    </div>
     {/* Pagination controls */}
     <div className="pagination-controls">
        {currentPage > 1 && (
        <button onClick={handlePrev} disabled={currentPage === 1}>
          <img src={Prev} alt="Previous" />
        </button>
        )}
        {currentPage < totalPages && (
        <button onClick={handleNext} disabled={currentPage === totalPages}>
          <img src={Next} alt="Next" />
        </button>
        )}
      </div>
    </>
  )
}

export default Candidate