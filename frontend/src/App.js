import React, { useState } from 'react';

import './stylesheets/Login.css'
import './stylesheets/NavBar.css'
import './stylesheets/Dashboard.css'
import './stylesheets/PopupForm.css'

import './components/NavBarButton'
import NavBarButton from './components/NavBarButton';
import Dashboard from './components/Dashboard';
import PopupForm from './components/PopupForm';

import AdminIcon from './icons/AdminIcon.svg';
import UserIcon from './icons/UserIcon.svg';


// npm install react-scripts --save

const sha1 = require('sha1');
const API_URL = "https://msf.vercel.app";


function App() {
    
  // React States
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [loggedUser, setLoggedUser] = useState();
  const [userurls, setUserUrls] = useState([]);
  const [selected, setSelected] = useState();
  const [newID, setNewID] = useState();
  const [admin, setAdmin] = useState();


  const errors = {
    pass: "invalid credentials"
  };

  const getUserUrls = async (username, password) => {
    const response = await fetch(`${API_URL}/get/userurls/${username}/${sha1(password)}`);
    const data = await response.json();
    return data.results;
  }

  const getAdminStatus = async (username, password) => {
    const response = await fetch(`${API_URL}/get/adminstatus/${username}/${password}`);
    const data = await response.json(); 
    return data.results;
  }

  const handleSubmit = async (event) => {
    //Prevent page reload
    event.preventDefault();

    const isCorrectLogin = async (username, password) => {
      const response = await fetch(`${API_URL}/login/${username}/${sha1(password)}`);
      const data = await response.json();
      return data.results;
    }

    const getName = async (username, password) => {
      const response = await fetch(`${API_URL}/get/username/${username}/${sha1(password)}`);
      const data = await response.json();
      return data.results;
    }
    

    const { uname, pass } = document.forms[0];

    // Compare user info
    const correctLogin = await isCorrectLogin(uname.value, pass.value);
    
    if (uname && pass) {
      if (!correctLogin) {
        // Invalid password
        setErrorMessages({ name: "pass", message: errors.pass });
      } else {
        // Correct password
        setUsername(uname.value);
        setPassword(sha1(pass.value));
        const urls = await getUserUrls(uname.value, pass.value)
        setUserUrls(urls);
        if (setUserUrls.length > 0) {
          setSelected(urls[0]);
        }
        setLoggedUser(await getName(uname.value, pass.value));
        setIsSubmitted(true);
        setAdmin(await getAdminStatus(uname.value, sha1(pass.value)));
        console.log(await getAdminStatus(uname.value, sha1(pass.value)));
      }
    } 
  };

  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  // JSX code for login form
  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Username </label>
          <input type="text" name="uname" required />
          {renderErrorMessage("uname")}
        </div>
        <div className="input-container">
          <label>Password </label>
          <input type="password" name="pass" required />
          {renderErrorMessage("pass")}
        </div>
        <div className="button-container">
          <input type="submit" value = "Login"/>
        </div>
      </form>
    </div>
  );
  

  return (
    <div className="app">
        {!isSubmitted ? 
            <>
                <div className="login-form">
                    <div className="title">Sign In</div>
                    {renderForm}
                </div>
            </>
        : 
            <> 
                <div className="main-page">
                    <div className='main-page-top'>
                      <div className="welcome">Welcome {loggedUser}!</div>
                      { admin ? (<img src={AdminIcon} alt="admin-icon"/ >) : ( <img src={UserIcon} alt="user-icon"/>)
                      }
                    </div>
                    {
                      <>
                        <div className='nav-bar-button-container'>
                          { userurls.length > 0 ? (
                            <> 
                              {
                                userurls.map((url) => (
                                <div onClick={() => {setSelected(url); setNewID('')}}>
                                  <NavBarButton compressedURL={url}/>
                                </div>
                                ))
                              } 
                            </>
                          ) : ( <></> )}
                        </div>
                      </>
                    } 
                    <PopupForm username={username} password={password} setUserUrls={setUserUrls} setSelected={setSelected}/>
                    <div className="dashboard-container">
                    
                      { userurls.length > 0 ? (<Dashboard dashboard={selected} setNewID={setNewID} newID={newID} username={username} password={password} setUserUrls={setUserUrls} setSelected={setSelected} admin={admin}/>) : ( <></> ) }
                    </div>
                </div>
            </>
        }
        
    </div>
  );
}

export default App;