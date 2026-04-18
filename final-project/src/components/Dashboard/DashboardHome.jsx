import React from 'react';
import nsdlWatermark from '../../assets/nsdl_watermark.png';
import './DashboardHome.css';

const DashboardHome = () => {
    return (
        <div className="dashboard-home">
            <img src={nsdlWatermark} alt="NSDL Watermark" className="watermark-bg-image" />
            <div className="welcome-text-overlay">
                <h2>Welcome to NSDL</h2>
                <p>Banking made easy - Just in a jiffy</p>
            </div>
        </div>
    );
};

export default DashboardHome;
