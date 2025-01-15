import React, { useState } from 'react';
import Logo from '../images/logo.png';
import { Link } from 'react-router-dom';
import Candidate from '../images/candidate.png';
import Plus from '../images/plus.png';
import Hamburger from '../images/hamburger.png';
import Close from '../images/close.png';
import { useLocation } from 'react-router-dom';


function Header() {

    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

  return (
    <>
    <div className="grid grid-cols-12 gap-4 header content-center">
        <div className="col-span-6 lg:col-span-3 xl:col-span-2">
            <img src={Logo} alt="H.aRchers Logo" className="logo"/>
        </div>
        <div className="hidden lg:grid lg:col-span-4 xl:col-span-3">
            <div className="toggle-wrapper">
                <Link
                    to="/core"
                    className={`Link ${location.pathname.startsWith('/core') && !location.pathname.startsWith('/core/candidates') ? 'activelink' : ''}`}
                >
                    Job Openings
                </Link>
                <Link
                    to="/core/candidates"
                    className={`Link ${location.pathname.startsWith('/core/candidates') ? 'activelink' : ''}`}
                >
                    Candidates
                </Link>
            </div>
        </div>
        <div className="hidden lg:grid lg:col-span-3 xl:col-span-2 xl:col-start-9">
            <Link to="/core/candidates/addcandidate" className="candlink">
               Add Candidate
               <img src={Candidate} alt="Candidate Icon"/>
            </Link>
        </div>
        <div className="hidden lg:grid col-span-6 md:col-span-4 lg:col-span-2">
            <Link to="/core/addjob" className="joblink">
                Add Job
                <img src={Plus} alt="Plus Icon"/>
            </Link>
        </div>
        <div className="col-span-6 lg:hidden justify-self-end">
            <button onClick={() => setIsOpen(true)}><img src={Hamburger} alt="Hamburger Button"/></button>
        </div>
    </div>

    <div className="menuwrapper" style={{ visibility: isOpen ? 'visible' : 'hidden' }}>
        <button onClick={() => setIsOpen(false)}><img src={Close} alt="Close Button"/></button>
        <div className="openmenu">
            <Link to="/core">Job Openings</Link>
            <Link to="/core/candidates">Candidates</Link>
            <Link to="/core/addcandidate">Add Candidate</Link>
            <Link to="/core/addjob">Add Job</Link>
        </div>
    </div>

    </>
  )
}

export default Header