import React from 'react';
import Header from './header';
import Footer from './footer';
import { Routes, Route } from 'react-router-dom';
import Addjob from '../job/addjob';
import SingleJob from '../job/singlejob';
import AllJobs from '../job/alljobs';
import Candidate from '../candidate/candidate';
import AddCandidate from '../candidate/addcandidate';
import CandidateSingle from '../candidate/candidatesingle';

function core() {
  return (
    <>
        <div className="container mx-auto px-4">
        <Header/>
            <Routes> 
               <Route path="addjob" element={<Addjob/>}/>
               <Route path="/job/:id" element={<SingleJob/>}/>
               <Route path="/" element={<AllJobs/>}/>
               <Route path='candidates' element={<Candidate />}/>
               <Route path='/candidates/addcandidate' element={<AddCandidate />}/>
               <Route path='/candidates/single/:id' element={<CandidateSingle/>}/>
            </Routes>
        <Footer/>
        </div>
       

    </>
  )
}

export default core