import React from "react";
import Popup from 'reactjs-popup';

const Dashboard = ({dashboard, setNewID, newID, username, password, setUserUrls, setSelected, admin}) => {

    const API_URL = "https://msf.vercel.app";

    const edit_url = async () => {
        if (newID!==dashboard.compressed_id && newID ) {
            const response = await fetch(`${API_URL}/edit/url/${username}/${password}/${dashboard.compressed_id}/${newID}/${dashboard.author}`);
            const data = await response.json();
            
            const urls_response = await fetch(`${API_URL}/get/userurls/${username}/${password}`);
            const urls = await urls_response.json();

            if (data.results) {
                setUserUrls(urls.results);
                setSelected(urls.results[0]);
                setNewID('');
            }
        }
    }

    const delete_url = async () => {
        const response = await fetch(`${API_URL}/delete/url/${username}/${password}/${dashboard.compressed_id}/${dashboard.author}`);
        const data = await response.json();

        const urls_response = await fetch(`${API_URL}/get/userurls/${username}/${password}`);
        const urls = await urls_response.json();
        if (data.results) {
            setUserUrls(urls.results);
            setSelected(urls.results[0]);
            setNewID('');
        }
    }

    const approve_url = async () => {
        const response = await fetch(`${API_URL}/approve/url/${username}/${password}/${dashboard.compressed_id}/${dashboard.author}`);
        const data = await response.json();

        const urls_response = await fetch(`${API_URL}/get/userurls/${username}/${password}`);
        const urls = await urls_response.json();
        if (data.results) {
            setUserUrls(urls.results);
            setSelected(urls.results[0]);
        }
    }

    return (
        <div className="dashboard-component-wrapper">
            <div className="dashboard-original-url">Destination: {dashboard.original}</div>
            <div>
                <div className="dashboard-redirect-from">
                    <span>Compressed URL: </span> 
                    <a href={'http://msf.vercel.app/'+dashboard.compressed_id}>
                        <span className="bolded">{"msf.vercel.app/" + dashboard.compressed_id}</span> 
                    </a>
                    
                    {!dashboard.approved && admin ? (
                        <span><button className="dashboard-approve-button" onClick={async()=>{await approve_url()}}>Approve</button></span>
                    ):(<></>)}

                </div>
                <div className="dashboard-author">
                    <span>Created by: {dashboard.author}</span>
                </div>
            </div>
            <div className="dashboard-change-container">
                <div className="dashboard-change-title">Edit link</div>
                <div className="dashboard-change-input">
                    <span>msf.vercel.app/{' '}</span>
                    <input placeholder={dashboard.compressed_id} value={newID} onChange={(e) => setNewID(e.target.value)}></input>
                    <button onClick={async()=>{await edit_url()}}>Save</button>
                </div>
            </div>

            
            
            <Popup trigger={<div className="dashboard-delete-container">Delete this compressed URL</div>} modal nested>
            {close => (
                <div className="modal">
                    <div className="modal-header"> Delete link </div>
                    <div className="modal-description">This action cannot be undone. Are you sure you want to delete this link?</div>
                    <div className="modal-button-group">
                        <button className="modal-button-red" onClick = {async() =>{await delete_url(); close()}} > Delete </button>
                        <button className="modal-button" onClick={() => {close()}}> Close </button>
                    </div>
                </div>
            )}
            </Popup>
        </div>
    )
}

export default Dashboard;