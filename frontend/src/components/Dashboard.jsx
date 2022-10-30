import React from "react";

const Dashboard = ({dashboard}) => {
    return (
        <>
            <div className="dashboard-original-url">{dashboard.original}</div>
            <div className="dashboard-redirect-from">
                <span>Compressed URL: </span> 
                <a href={dashboard.compressed}>
                    <span className="bolded">{"msf.vercel.app/" + dashboard.compressed_id}</span> 
                </a>
            </div>
            <div className="dashboard-change-input">
                <span>msf.vercel.app/{' '}</span>
                <input></input>
            </div>
        </>
    )
}

export default Dashboard;