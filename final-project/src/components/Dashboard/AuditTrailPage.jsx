import React, { useState, useMemo } from 'react';
import { FiSearch, FiDownload, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { MdCalendarToday } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import { TiArrowUnsorted } from 'react-icons/ti';
import CustomDatePicker from './CustomDatePicker';
import './AuditTrailPage.css';

const TOTAL_RECORDS = 50;

const MOCK_ROWS = [
    {
        id: 1, fieldName: 'Maker', userName: 'Krishna', userId: 'CBC', adminName: 'Carson Darrin', adminId: 'Das',
        createdDate: '19/06/2024', updatedDate: '19/06/2024', operationPerformed: '809829919'
    },
    {
        id: 2, fieldName: 'Maker', userName: 'Krishna', userId: 'CBC', adminName: 'Ashy Handgun', adminId: 'Das',
        createdDate: '19/06/2024', updatedDate: '19/06/2024', operationPerformed: '809829919'
    },
    {
        id: 3, fieldName: 'Maker', userName: 'Krishna', userId: 'CBC', adminName: 'Ashy Handgun', adminId: 'Das',
        createdDate: '19/06/2024', updatedDate: '19/06/2024', operationPerformed: '809829919'
    }
];

const AuditTrailPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [currentPage, setCurrentPage] = useState(6);
    const [rowsPerPage, setRowsPerPage] = useState(3);
    const [goToPage, setGoToPage] = useState('9');
    const [selectedRows, setSelectedRows] = useState(new Set([3])); 
    const totalPages = 50;

    const columns = [
        { label: 'Field Name', key: 'fieldName' },
        { label: 'User Name', key: 'userName' },
        { label: 'User ID', key: 'userId' },
        { label: 'Admin Name', key: 'adminName' },
        { label: 'Admin ID', key: 'adminId' },
        { label: 'Created Date', key: 'createdDate' },
        { label: 'Updated Date', key: 'updatedDate' },
        { label: 'Operation Performed', key: 'operationPerformed' }
    ];

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleGoToPage = (e) => {
        if (e.key === 'Enter') {
            const page = parseInt(goToPage);
            if (!isNaN(page)) {
                handlePageChange(page);
            }
        }
    };

    const handleSelectRow = (id) => {
        const newSelected = new Set(selectedRows);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedRows(newSelected);
    };

    const handleSelectAllRows = (e) => {
        if (e.target.checked) {
            const allIds = MOCK_ROWS.map(row => row.id);
            setSelectedRows(new Set(allIds));
        } else {
            setSelectedRows(new Set());
        }
    };

    const handleDownload = () => {
        const headers = columns.map(col => col.label).join(',');
        const rows = MOCK_ROWS.map(row => 
            columns.map(col => row[col.key]).join(',')
        ).join('\n');
        const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "audit_trail_sample.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderPageNumbers = () => {
        const pages = [];
        
        
        pages.push(
            <button 
                key={1} 
                className={`page-number ${currentPage === 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(1)}
            >
                1
            </button>
        );

        if (currentPage > 4) {
            pages.push(<span key="dots1" className="page-dots">...</span>);
        }

        // Show range around current page
        for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
            pages.push(
                <button 
                    key={i} 
                    className={`page-number ${currentPage === i ? 'active' : ''}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }

        if (currentPage < totalPages - 3) {
            pages.push(<span key="dots2" className="page-dots">...</span>);
        }

        //show last page
        if (totalPages > 1) {
            pages.push(
                <button 
                    key={totalPages} 
                    className={`page-number ${currentPage === totalPages ? 'active' : ''}`}
                    onClick={() => handlePageChange(totalPages)}
                >
                    {totalPages}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="audit-trail-page">
            <div className="breadcrumb">
                <span>Bank User Management</span> / <span className="active-breadcrumb">Audit Trail</span>
            </div>

            <h1 className="page-title">Audit Trail</h1>

            <div className="audit-card">
                <div className="audit-toolbar">
                    <div className="username-search-large">
                        <FiSearch className="large-search-icon" />
                        <input 
                            type="text" 
                            placeholder="Search by User Name" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="unified-date-picker">
                        <div className="date-pick-item">
                            <CustomDatePicker 
                                selectedDate={fromDate}
                                onChange={setFromDate}
                                placeholder="Start date"
                            />
                        </div>
                        <span className="date-arrow">→</span>
                        <div className="date-pick-item">
                            <CustomDatePicker 
                                selectedDate={toDate}
                                onChange={setToDate}
                                placeholder="End date"
                            />
                        </div>
                        <MdCalendarToday className="unified-calendar-icon" />
                    </div>

                    <button className="download-sample-btn" onClick={handleDownload}>
                        <FiDownload /> Download Sample File
                    </button>
                </div>

                <div className="table-container">
                    <table className="audit-table">
                        <thead>
                            <tr>
                                <th>
                                    <input 
                                        type="checkbox" 
                                        className="checkbox-custom" 
                                        onChange={handleSelectAllRows}
                                        checked={selectedRows.size === MOCK_ROWS.length}
                                    />
                                </th>
                                {columns.map((col) => (
                                    <th key={col.key}>
                                        {col.label} <TiArrowUnsorted />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_ROWS.map((row) => (
                                <tr key={row.id}>
                                    <td>
                                        <input 
                                            type="checkbox" 
                                            className="checkbox-custom" 
                                            checked={selectedRows.has(row.id)} 
                                            onChange={() => handleSelectRow(row.id)} 
                                        />
                                    </td>
                                    <td>{row.fieldName}</td>
                                    <td>{row.userName}</td>
                                    <td>{row.userId}</td>
                                    <td>
                                        <div className="user-cell">
                                            <FaUserCircle className="admin-avatar" />
                                            {row.adminName}
                                        </div>
                                    </td>
                                    <td>{row.adminId}</td>
                                    <td>{row.createdDate}</td>
                                    <td>{row.updatedDate}</td>
                                    <td>{row.operationPerformed}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination-footer">
                    <div className="pagination-left">
                        <div className="rows-selector">
                            Row per page 
                            <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
                                <option value="3">3</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                            </select>
                        </div>
                        
                        <div className="go-to-page">
                            Go to 
                            <input 
                                type="text" 
                                value={goToPage} 
                                onChange={(e) => setGoToPage(e.target.value)}
                                onKeyDown={handleGoToPage}
                            />
                        </div>
                    </div>

                    <div className="pagination-controls">
                        <button 
                            className="page-arrow" 
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            <FiChevronLeft />
                        </button>
                        
                        {renderPageNumbers()}
                        
                        <button 
                            className="page-arrow" 
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            <FiChevronRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditTrailPage;
