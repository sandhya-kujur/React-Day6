import React, { useState, useRef, useEffect } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import './CustomDatePicker.css';

const CustomDatePicker = ({ selectedDate, onChange, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date(selectedDate));
    const containerRef = useRef(null);

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const handlePrevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const handleDateSelect = (day) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        onChange(newDate.toISOString().split('T')[0]);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const renderDays = () => {
        const days = [];
        const totalDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth());
        const firstDay = firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Days of current month
        for (let d = 1; d <= totalDays; d++) {
            const isSelected = new Date(selectedDate).getDate() === d && 
                               new Date(selectedDate).getMonth() === viewDate.getMonth() &&
                               new Date(selectedDate).getFullYear() === viewDate.getFullYear();
            
            days.push(
                <div 
                    key={d} 
                    className={`calendar-day ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleDateSelect(d)}
                >
                    {d}
                </div>
            );
        }
        return days;
    };

    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    return (
        <div className="custom-datepicker" ref={containerRef}>
            <div className="datepicker-input-wrapper" onClick={() => setIsOpen(!isOpen)}>
                <label className="datepicker-label">{label}</label>
                <div className="datepicker-display">
                    {selectedDate.split('-').reverse().join('/')}
                    <svg className="calendar-svg-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#3F51B5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 2V6" stroke="#3F51B5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 2V6" stroke="#3F51B5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 10H21" stroke="#3F51B5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>

            {isOpen && (
                <div className="calendar-dropdown">
                    <div className="calendar-header">
                        <div className="month-year">
                            {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                            <span className="dropdown-arrow">▼</span>
                        </div>
                        <div className="header-nav">
                            <MdChevronLeft className="nav-arrow" onClick={handlePrevMonth} />
                            <MdChevronRight className="nav-arrow" onClick={handleNextMonth} />
                        </div>
                    </div>
                    
                    <div className="calendar-weekdays">
                        <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                    </div>
                    
                    <div className="calendar-days-grid">
                        {renderDays()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomDatePicker;
