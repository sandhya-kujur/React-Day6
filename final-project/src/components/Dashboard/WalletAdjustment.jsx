import React, { useState } from 'react';
import './WalletAdjustment.css';

const WalletAdjustment = () => {
    const [userName, setUserName] = useState('');
    const [error, setError] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!userName.trim()) {
            setError(true);
        } else {
            setError(false);
            console.log('Searching for user:', userName);
        }
    };

    const handleChange = (e) => {
        setUserName(e.target.value);
        if (e.target.value.trim()) {
            setError(false);
        }
    };

    return (
        <div className="wallet-adjustment-page">
            <h1 className="page-title">Wallet Adjustment</h1>
            <div className="search-card">
                <form className="search-form" onSubmit={handleSearch}>
                    <div className="search-input-group">
                        <input
                            type="text"
                            className={`search-input ${error ? 'error' : ''}`}
                            id="userName"
                            placeholder="Enter User Name"
                            value={userName}
                            onChange={handleChange}
                        />
                        <label htmlFor="userName" className="floating-label">User Name*</label>
                        {error && <span className="error-message">Username is required</span>}
                    </div>
                    <button type="submit" className="search-button">
                        Search
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WalletAdjustment;
