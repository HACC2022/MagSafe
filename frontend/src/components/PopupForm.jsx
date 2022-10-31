import React from 'react';
import { useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const PopupForm = ({username, password, setUserUrls, setSelected}) => {

  const [original, setOriginal] = useState();
  const [compressedID, setCompressedID] = useState();
  const API_URL = "https://msf.vercel.app";

  const createUrl = async () => {
    const response = await fetch(`${API_URL}/create/url/${username}/${password}/${compressedID}/url=${original.replace('//', '/')}`);
    const data = await response.json();
    if (data.results) {
      setUserUrls(oldState => {
        oldState.push({'original': original, 'compressed_id': compressedID});
        return oldState
      });
      console.log(setSelected)
      setSelected({'original': original, 'compressed_id': compressedID});
    }
  }

  const clearForm = () => {
    setOriginal('');
    setCompressedID('');
  }

  return (
    <Popup trigger={<button className='new-url-button'>Create New URL</button>} modal nested>

    {close => (
      <div className="modal">
        <div className="modal-header"> Create New URL </div>
        <div className="content">
          <div className='modal-label'>
            <div className='modal-label-text'>Enter Long URL (Including HTTPS Prefix)</div>
            <input className='new-url-original' value={original} onChange={(e) => setOriginal(e.target.value)}/>
          </div>
          <div className='modal-label'>
            <div className='modal-label-text'>Customize Back-Half</div>
            <input className='new-url-compressed' value={compressedID} onChange={(e) => setCompressedID(e.target.value)}/>
          </div>
        </div>



        <div className="modal-button-group">
          <button className="modal-button" onClick = {async() =>{await createUrl(); clearForm(); close()}} > Create </button>
          <button className="modal-button" onClick={() => {clearForm(); close()}}> Cancel </button>
        </div>
      </div>
    )}
    </Popup>
  )
}

export default PopupForm;