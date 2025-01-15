import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BackBtn from '../images/back.png';
import AddBtn from '../images/addbtn.png';
import JobArt from '../images/job-art.png';
import RemoveBtn from '../images/remove-btn.png';
import supabase from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function Addjob() {

  const [counter, setCounter] = useState(0);
  const [technologies, setTechnologies] = useState([]);

  const handleAddTech = () => {
    setCounter(counter + 1);
    setTechnologies([
      ...technologies,
      {
        id: counter,
        technology: '',
      },
    ]);
  };

  const handleRemoveTech = (id) => {
    setTechnologies(technologies.filter((tech) => tech.id !== id));
  };

  const handleTechChange = (id, value) => {
    setTechnologies(
      technologies.map((tech) =>
        tech.id === id ? { ...tech, technology: value } : tech
      )
    );
  };


  const navigate = useNavigate();
  
  const [notification, setNotification] = useState(null); // State for notification

  // Handle the form submission and post to Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const deadline = document.getElementById('deadline').value;
    const about = document.getElementById('about').value;
    const summary = document.getElementById('summary').value;
    const jobtype = document.getElementById('jobtype').value;
    const location = document.getElementById('location').value;
    const degree = document.getElementById('degree').value;
    const discipline = document.getElementById('discipline').value;
    const experience = document.getElementById('experience').value;
    const company = document.getElementById('company').value;

    // Handle technologies data
    const techSelectValue = document.getElementById('technologies').value;

    // Handle technologies data
    const techs =
        technologies.length === 0
        ? [techSelectValue] // Use the value from the select if array is empty
        : technologies.map((tech) => tech.technology);

    // Prepare the data to submit
    const jobData = {
      name:title,
      deadline:deadline,
      company:about,
      summary:summary,
      jobtype:jobtype,
      location:location,
      degree:degree,
      discipline:discipline,
      experience:experience,
      technology: JSON.stringify(techs),  // Storing the technologies array as a list
      state:'Open',
      recruiter:company,
    };

    // Insert the job data into Supabase
    try {
      const { data, error } = await supabase
        .from('jobs') // 'jobs' is the table name in Supabase
        .insert([jobData])
        .select('id');

      if (error) {
        throw error;
      }
      
      console.log('Job posting created:', data);
      const newJobId = data[0].id;
      // Show success notification
      setNotification({ type: 'success', message: 'Job successfully submitted!' });
      setTimeout(() => {
        setNotification(null); // Hide the notification after 3 seconds
      }, 3000);

      setTimeout(() => {
        navigate(`/core/job/${newJobId}`);
      }, 300); // 3 milliseconds delay

    } catch (error) {
      console.error('Error submitting job:', error);
      // Show error notification
      setNotification({ type: 'error', message: 'Error submitting job. Please try again.' });

      // Hide the notification after 3 seconds
      setTimeout(() => {
        setNotification(null); // Hide the notification after 3 seconds
      }, 3000);
    }
  };

  return (
    <>
     {/* Notification Div */}
     {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-8">
        <div className="inputblock space-y-4">
          <div className="inputblockhead">
            <h1>Add Job Opening</h1>
            <Link to="/core">
              <img src={BackBtn} alt="Back Button" />
            </Link>
          </div>

          <label>Job Title</label>
          <input type="text" id="title" name="title" placeholder="Example: Front-End Engineer" />

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 lg:col-span-1">
              <label>Company Name</label>
              <input type="text" id="company" name="company" placeholder="Example: Amazon" />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <label>Deadline</label>
              <input type="datetime-local" id="deadline" name="deadline" placeholder="26/02/2025" />
            </div>
          </div>
          <div>
            <label>About The Company</label>
            <textarea id="about" name="about" placeholder="Introduce your company"></textarea>
          </div>
          <div>
            <label>Job Summary</label>
            <textarea id="summary" name="summary" placeholder="Describe your job opening"></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 lg:col-span-1">
              <label>Job Type</label>
              <select id="jobtype" name="jobtype">
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <label>Location if Any</label>
              <input type="text" id="location" name="location" placeholder="Example: Austin, TX" />
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-4">
        <div className="inputblock">
          <div className="mb-4">
            <label>Degree requirement</label>
            <select id="degree" name="degree">
              <option value="Associate Degree">Associate Degree</option>
              <option value="Bachelor's Degree">Bachelor's Degree</option>
              <option value="Master's Degree">Master's Degree</option>
              <option value="Doctorate">Doctorate</option>
              <option value="Certificate">Certificate</option>
              <option value="None">None</option>
            </select>
          </div>

          <label>Discipline</label>
          <select id="discipline" name="discipline">
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

          <div className="mt-4 mb-4">
            <label>Years of Experience</label>
            <input type="number" min="0" id="experience" name="experience" placeholder="1" />
          </div>

          <label>Technologies or specifics</label>
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-5">
              <select id="technologies" name="technologies">
                <option value="Java">Java</option>
                <option value="Python">Python</option>
                <option value="C++">C++</option>
                <option value="JavaScript">JavaScript</option>
                <option value="PHP">PHP</option>
                <option value="HTML/CSS">HTML/CSS</option>
                <option value="SQL">SQL</option>
                <option value="Excel">Excel</option>
                <option value="Power BI">Power BI</option>
                <option value="Tableau">Tableau</option>
                <option value="AWS">AWS</option>
                <option value="Azure">Azure</option>
                <option value="Google Cloud">Google Cloud</option>
                <option value="Linux">Linux</option>
                <option value="Docker">Docker</option>
                <option value="Kubernetes">Kubernetes</option>
                <option value="React">React</option>
                <option value="Angular">Angular</option>
                <option value="Node.js">Node.js</option>
                <option value="Ruby">Ruby</option>
                <option value="Swift">Swift</option>
                <option value="Kotlin">Kotlin</option>
                <option value="TensorFlow">TensorFlow</option>
                <option value="Pandas">Pandas</option>
                <option value="NumPy">NumPy</option>
                <option value="MATLAB">MATLAB</option>
                <option value="SAS">SAS</option>
                <option value="R">R</option>
                <option value="Git">Git</option>
                <option value="Salesforce">Salesforce</option>
                <option value="Other">Other</option> 
              </select>
            </div>
            <div className="col-span-1">
              <button type="button" onClick={handleAddTech}>
                <img src={AddBtn} alt="Add Button" />
              </button>
            </div>
          </div>

          <div id="poptech">
            {technologies.map((tech) => (
              <div key={tech.id} className="grid grid-cols-6 gap-4" id={`poptech${tech.id}`}>
                <div className="col-span-5">
                  <select
                    value={tech.technology}
                    onChange={(e) => handleTechChange(tech.id, e.target.value)}
                  >
                    <option value="Java">Java</option>
                    <option value="Python">Python</option>
                    <option value="C++">C++</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="PHP">PHP</option>
                    <option value="HTML/CSS">HTML/CSS</option>
                    <option value="SQL">SQL</option>
                    <option value="Excel">Excel</option>
                    <option value="Power BI">Power BI</option>
                    <option value="Tableau">Tableau</option>
                    <option value="AWS">AWS</option>
                    <option value="Azure">Azure</option>
                    <option value="Google Cloud">Google Cloud</option>
                    <option value="Linux">Linux</option>
                    <option value="Docker">Docker</option>
                    <option value="Kubernetes">Kubernetes</option>
                    <option value="React">React</option>
                    <option value="Angular">Angular</option>
                    <option value="Node.js">Node.js</option>
                    <option value="Ruby">Ruby</option>
                    <option value="Swift">Swift</option>
                    <option value="Kotlin">Kotlin</option>
                    <option value="TensorFlow">TensorFlow</option>
                    <option value="Pandas">Pandas</option>
                    <option value="NumPy">NumPy</option>
                    <option value="MATLAB">MATLAB</option>
                    <option value="SAS">SAS</option>
                    <option value="R">R</option>
                    <option value="Git">Git</option>
                    <option value="Salesforce">Salesforce</option>
                    <option value="Other">Other</option>                      
                  </select>
                </div>
                <div className="col-span-1">
                  <button type="button" onClick={() => handleRemoveTech(tech.id)}>
                    <img src={RemoveBtn} alt="Remove Button" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="actionblock">
          <div>
            <h2>Ready To Launch?</h2>
            <button onClick={handleSubmit}>Post Job Opening</button>
          </div>
          <div>
            <img src={JobArt} alt="Launch Job" />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Addjob;
