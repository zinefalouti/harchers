import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BackBtn from '../images/back.png';
import Plus from '../images/addbtn.png';
import Close from '../images/close.png';
import supabase from '../supabaseClient';
import CandArt from '../images/candart.png';
import { useNavigate } from 'react-router-dom';

function AddCandidate() {
  const [educations, setEducations] = useState([
    { id: 0, degree: 'Associate Degree', discipline: 'Accounting', startDate: '', endDate: '' },
  ]);

  const handleAddEducation = () => {
    setEducations([
      ...educations,
      { id: Date.now(), degree: '', discipline: '', startDate: '', endDate: '' },
    ]);
  };

  const handleRemoveEducation = (id) => {
    setEducations(educations.filter((education) => education.id !== id));
  };

  const handleChange = (id, field, value) => {
    setEducations(
      educations.map((education) =>
        education.id === id ? { ...education, [field]: value } : education
      )
    );
  };


  
  const [experiences, setExperiences] = useState([
    { id: 0, company:'', position:'', startDate:'', endDate:''},
  ]);

  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      { id: Date.now(), company: '', position: '', startDate: '', endDate: '' },
    ]);
  };

  const handleRemoveExperience = (id) => {
    setExperiences(experiences.filter((experience) => experience.id !== id));
  };

  const handleExpChange = (id, field, value) => {
    setExperiences((prevExperiences) =>
      prevExperiences.map((experience) =>
        experience.id === id
          ? { ...experience, [field]: value }
          : experience
      )
    );
  };

  const [technologies,setTechnologies] = useState([
     {id:0, technology:'Java'},
  ])

  const handleAddTech = () => {
    setTechnologies([
      ...technologies,
      { id: Date.now(), technology: '' }, // Corrected key name
    ]);
  };

  // Remove specific technology row
  const handleRemoveTech = (id) => {
    setTechnologies(technologies.filter((tech) => tech.id !== id));
  };

  // Update technology value
  const handleTechChange = (id, value) => {
    setTechnologies(
      technologies.map((tech) =>
        tech.id === id ? { ...tech, technology: value } : tech
      )
    );
  };

  const [candname, setCandname] = useState('');
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('Single');
  const [birthdate, setBirthdate] = useState('');
  const [location, setLocation] = useState('');

  const navigate = useNavigate();
  
  const [notification, setNotification] = useState(null); // State for notification

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form refresh
  
    // Example of how to gather all data
    const candidateData = {
      name: candname,
      title: title,
      birthday: birthdate,
      status: status, // Ensure field names match your database schema
      degree: educations,
      experience: experiences,
      technology: technologies, // Flatten technologies
      state: 'Available',
      location: location,
    };
  
    try {
      // Insert new candidate record
      const { data, error } = await supabase
        .from('candidate') // Table name
        .insert([candidateData])
        .select(); // Use select() to ensure you fetch the inserted record
      
      if (error) {
        console.error('Error inserting candidate:', error.message);
        setNotification({ type: 'error', message: 'There was an error adding the candidate. Please try again.' });
        return; // Early return to prevent further processing
      }
  
      // Check if data was returned and has at least one record
      if (data && data.length > 0) {
        console.log('Candidate added successfully:', data);
        const newCandId = data[0].id; // Now it's safe to access `data[0].id`
  
        // Show success notification
        setNotification({ type: 'success', message: 'Candidate successfully added!' });
        setTimeout(() => {
          setNotification(null); // Hide the notification after 3 seconds
        }, 3000);
  
        // Navigate to the new candidate page
        setTimeout(() => {
          navigate(`/core/candidates/single/${newCandId}`);
        }, 300); // 300ms delay
      } else {
        // If no data returned, show error
        setNotification({ type: 'error', message: 'No data returned. Something went wrong.' });
        setTimeout(() => {
          setNotification(null); // Hide the notification after 3 seconds
        }, 3000);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setNotification({ type: 'error', message: 'Something went wrong. Please try again.' });
  
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
        <div className="col-span-12 xl:col-span-8">
          <div className="inputblock">
            <div className="inputblockhead">
              <h1>Add Candidate</h1>
              <Link to="/core/candidates">
                <img src={BackBtn} alt="Back Button" />
              </Link>
            </div>
            <div>
              <label>Full Name</label>
              <input type="text" id="candname" value={candname}
                onChange={(e) => setCandname(e.target.value)} placeholder="Example: Jane Doe" />
            </div>
            <div className="pt-4">
              <label>Title</label>
              <input type="text" id="title" placeholder="Example: Data-Scientist"  value={title}
                 onChange={(e) => setTitle(e.target.value)}/>
            </div>

            {educations.map((education, index) => (
              <div
                className="grid grid-cols-11 gap-2 pt-4"
                id={`education-${education.id}`}
                key={education.id}
              >
                <div className="col-span-11 xl:col-span-3">
                  <label>Degree</label>
                  <select
                    value={education.degree}
                    onChange={(e) =>
                      handleChange(education.id, 'degree', e.target.value)
                    }
                  >
                    <option value="Associate Degree">Associate Degree</option>
                    <option value="Bachelor's Degree">Bachelor's Degree</option>
                    <option value="Master's Degree">Master's Degree</option>
                    <option value="Doctorate">Doctorate</option>
                    <option value="Certificate">Certificate</option>
                    <option value="None">None</option>
                  </select>
                </div>
                <div className="col-span-11 xl:col-span-3">
                  <label>Discipline</label>
                  <select
                    value={education.discipline}
                    onChange={(e) =>
                      handleChange(education.id, 'discipline', e.target.value)
                    }
                  >
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
                <div className="col-span-11 lg:col-span-5 xl:col-span-2">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={education.startDate}
                    onChange={(e) =>
                      handleChange(education.id, 'startDate', e.target.value)
                    }
                  />
                </div>
                <div className="col-span-11 lg:col-span-5 xl:col-span-2">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={education.endDate}
                    onChange={(e) =>
                      handleChange(education.id, 'endDate', e.target.value)
                    }
                  />
                </div>
                <div className="col-span-11 lg:col-span-1">
                  {/* Show "Plus" button only for the first line */}
                  {index === 0 ? (
                    <button onClick={handleAddEducation}>
                      <img src={Plus} alt="Add Button" className="inputblockadd" />
                    </button>
                  ) : (
                    // Show "Close" button only for additional lines
                    <button onClick={() => handleRemoveEducation(education.id)}>
                      <img src={Close} alt="Close Button" className="inputblockadd" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Experience Map */}
            
            {experiences.map((experience, index) => (
            <div key={experience.id} className="experience-block">
              <div className="grid grid-cols-11 gap-2 pt-4">
                {/* Job Title */}
                <div className="col-span-11 xl:col-span-3">
                  <label>Job Title</label>
                  <input
                    type="text"
                    value={experience.position}
                    onChange={(e) =>
                      handleExpChange(experience.id, 'position', e.target.value)
                    }
                    placeholder="Example: Data Scientist"
                  />
                </div>

                {/* Company Name */}
                <div className="col-span-11 xl:col-span-3">
                  <label>Company Name</label>
                  <input
                    type="text"
                    value={experience.company}
                    onChange={(e) =>
                      handleExpChange(experience.id, 'company', e.target.value)
                    }
                    placeholder="Example: H.aRchers"
                  />
                </div>

                {/* Start Date */}
                <div className="col-span-11 lg:col-span-5 xl:col-span-2">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={experience.startDate}
                    onChange={(e) =>
                      handleExpChange(experience.id, 'startDate', e.target.value)
                    }
                  />
                </div>

                {/* End Date */}
                <div className="col-span-11 lg:col-span-5 xl:col-span-2">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={experience.endDate}
                    onChange={(e) =>
                      handleExpChange(experience.id, 'endDate', e.target.value)
                    }
                  />
                </div>

                {/* Buttons */}
                <div className="col-span-11 lg:col-span-1">
                  {/* Show "Add" button only for the first experience */}
                  {index === 0 ? (
                    <button onClick={handleAddExperience}>
                      <img src={Plus} alt="Add Button" className="inputblockadd" />
                    </button>
                  ) : (
                    // Show "Remove" button for subsequent experiences
                    <button onClick={() => handleRemoveExperience(experience.id)}>
                      <img src={Close} alt="Close Button" className="inputblockadd" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

              <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="col-span-3 xl:col-span-1">
                      <label>Marital Status</label>
                      <select id="status" value={status}
                         onChange={(e) => setStatus(e.target.value)}>
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Widowed">Widowed</option>
                      </select>
                  </div>
                  <div className="col-span-3 xl:col-span-1">
                      <label>Birthday</label>
                      <input type="date" id="birthday" value={birthdate}
                        onChange={(e) => setBirthdate(e.target.value)}/>
                  </div>
                  <div className="col-span-3 xl:col-span-1">
                      <label>Location</label>
                      <input type="text" id="location" placeholder="Example: Boston, MA" value={location}
                       onChange={(e) => setLocation(e.target.value)}/>
                  </div>    
              </div>  
            
          </div>
        </div>
        <div className="col-span-12 xl:col-span-4">
              <div className="inputblock">
                <label>Technologies</label>
              {technologies.map((tech, index) => (
                  <div key={tech.id} className="grid grid-cols-6 gap-4">
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
                    {index === 0 ? (
                      <button onClick={handleAddTech}>
                        <img src={Plus} alt="Add Button"/>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRemoveTech(tech.id)}
                      >
                        <img src={Close} alt="Close Button"/>
                      </button>
                    )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="actionblock">
                <div>
                  <h2>Ready To Add?</h2>
                  <button onClick={handleSubmit}>Add Candidate</button>
                </div>
                <div>
                  <img src={CandArt} alt="Add Candidate" />
                </div>
              </div>
        </div>
      </div>
    </>
  );
}

export default AddCandidate;
