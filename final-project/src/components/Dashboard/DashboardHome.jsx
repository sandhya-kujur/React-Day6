import React, { useEffect, useState } from 'react';
import nsdlWatermark from '../../assets/nsdl_watermark.png';
import './DashboardHome.css';
import { fetchDashboardData } from '../../actions/dashboardActions';

const DashboardHome = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initDashboard = async () => {
            console.log("Initializing dashboard data...");
            const data = await fetchDashboardData();
            if (data) {
                console.log("Dashboard data received successfully:", data);
            }
            setIsLoading(false);
        };
        initDashboard();
    }, []);

    if (isLoading) {
        return (
            <div className="dashboard-home loading">
                <div className="spinner"></div>
                <p>Loading Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-home">
            <div className="welcome-container">
                <img src={nsdlWatermark} alt="NSDL Watermark" className="watermark-bg-image" />
                <div className="welcome-text-overlay">
                    <h2>Welcome to NSDL</h2>
                    <p>Banking made easy - Just in a jiffy</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
