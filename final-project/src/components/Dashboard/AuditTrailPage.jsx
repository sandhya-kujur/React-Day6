import React, { useMemo, useState } from 'react';
import { MdDownload, MdSearch } from 'react-icons/md';
import CustomDatePicker from './CustomDatePicker';

const PAGE_SIZE = 10;
const TOTAL = 50;

const MOCK_ROWS = [
    {
        sno: 1, fieldName: 'kitchen', userName: 'Maker', userId: 'rYd306', adminName: 'Jonathan Velasque', adminId: 'sarah.chen@bank.com',
        createdDate: '2026-04-20', updatedDate: '2026-04-20', operationPerformed: 'Update', operationRequestedBy: 'Admin',
        city: 'Mumbai', device: 'Desktop', canada: 'No', latitude: '19.0760', longitude: '72.8777', continent: 'Asia',
        ipAddress: '192.168.1.1', fullAddress: '123 Street, Mumbai, India', sessionId: 'SES-001', vehicle: 'N/A', bencode: 'B1', userType: 'CBC Maker'
    },
    {
        sno: 2, fieldName: 'financial', userName: 'Checker', userId: 'Vap282', adminName: 'Michael Nelson', adminId: 'm.nelson@bank.com',
        createdDate: '2026-04-20', updatedDate: '2026-04-20', operationPerformed: 'Status Change', operationRequestedBy: 'System',
        city: 'Delhi', device: 'Mobile', canada: 'No', latitude: '28.6139', longitude: '77.2090', continent: 'Asia',
        ipAddress: '192.168.1.2', fullAddress: '456 Avenue, Delhi, India', sessionId: 'SES-002', vehicle: 'N/A', bencode: 'B2', userType: 'CBC Checker'
    },
    {
        sno: 3, fieldName: 'until', userName: 'Maker', userId: 'AXE124', adminName: 'Christopher Ramirez', adminId: 'c.ramirez@bank.com',
        createdDate: '2026-04-20', updatedDate: '2026-04-20', operationPerformed: 'Access Grant', operationRequestedBy: 'Admin',
        city: 'Bangalore', device: 'Tablet', canada: 'No', latitude: '12.9716', longitude: '77.5946', continent: 'Asia',
        ipAddress: '192.168.1.3', fullAddress: '789 Road, Bangalore, India', sessionId: 'SES-003', vehicle: 'N/A', bencode: 'B3', userType: 'CBC Maker'
    },
    {
        sno: 4, fieldName: 'worry', userName: 'Maker', userId: 'sYF129', adminName: 'Sara Reed', adminId: 's.reed@bank.com',
        createdDate: '2026-04-20', updatedDate: '2026-04-20', operationPerformed: 'Risk Assessment', operationRequestedBy: 'Security',
        city: 'Chennai', device: 'Desktop', canada: 'No', latitude: '13.0827', longitude: '80.2707', continent: 'Asia',
        ipAddress: '192.168.1.4', fullAddress: '101 Lane, Chennai, India', sessionId: 'SES-004', vehicle: 'N/A', bencode: 'B4', userType: 'Retailer'
    },
    {
        sno: 5, fieldName: 'happen', userName: 'Checker', userId: 'kdX624', adminName: 'Joseph Oconnor', adminId: 'j.oconnor@bank.com',
        createdDate: '2026-04-20', updatedDate: '2026-04-20', operationPerformed: 'Validation', operationRequestedBy: 'System',
        city: 'Hyderabad', device: 'Mobile', canada: 'No', latitude: '17.3850', longitude: '78.4867', continent: 'Asia',
        ipAddress: '192.168.1.5', fullAddress: '202 Blvd, Hyderabad, India', sessionId: 'SES-005', vehicle: 'N/A', bencode: 'B5', userType: 'Distributor'
    },
    {
        sno: 6, fieldName: 'raise', userName: 'Checker', userId: 'kHy216', adminName: 'Robert Dunn', adminId: 'r.dunn@bank.com',
        createdDate: '2026-04-20', updatedDate: '2026-04-20', operationPerformed: 'Limit Check', operationRequestedBy: 'System',
        city: 'Pune', device: 'Desktop', canada: 'No', latitude: '18.5204', longitude: '73.8567', continent: 'Asia',
        ipAddress: '192.168.1.6', fullAddress: '303 Street, Pune, India', sessionId: 'SES-006', vehicle: 'N/A', bencode: 'B6', userType: 'CBC Checker'
    },
    {
        sno: 7, fieldName: 'administration', userName: 'Maker', userId: 'nlL226', adminName: 'Michael Mann', adminId: 'm.mann@bank.com',
        createdDate: '2026-04-20', updatedDate: '2026-04-20', operationPerformed: 'Flagging', operationRequestedBy: 'Risk Dept',
        city: 'Kolkata', device: 'Desktop', canada: 'No', latitude: '22.5726', longitude: '88.3639', continent: 'Asia',
        ipAddress: '192.168.1.7', fullAddress: '404 Circle, Kolkata, India', sessionId: 'SES-007', vehicle: 'N/A', bencode: 'B7', userType: 'CBC Maker'
    },
    {
        sno: 8, fieldName: 'be', userName: 'Checker', userId: 'Ywf820', adminName: 'Angela Allen', adminId: 'a.allen@bank.com',
        createdDate: '2026-04-20', updatedDate: '2026-04-20', operationPerformed: 'Payout', operationRequestedBy: 'Admin',
        city: 'Ahmedabad', device: 'Mobile', canada: 'No', latitude: '23.0225', longitude: '72.5714', continent: 'Asia',
        ipAddress: '192.168.1.8', fullAddress: '505 Way, Ahmedabad, India', sessionId: 'SES-008', vehicle: 'N/A', bencode: 'B8', userType: 'Retailer'
    },
    {
        sno: 9, fieldName: 'wind', userName: 'Checker', userId: 'WQm445', adminName: 'Steven Blanchard', adminId: 's.blanchard@bank.com',
        createdDate: '2026-04-20', updatedDate: '2026-04-20', operationPerformed: 'Edit', operationRequestedBy: 'User',
        city: 'Surat', device: 'Desktop', canada: 'No', latitude: '21.1702', longitude: '72.8311', continent: 'Asia',
        ipAddress: '192.168.1.9', fullAddress: '606 Square, Surat, India', sessionId: 'SES-009', vehicle: 'N/A', bencode: 'B9', userType: 'CBC Maker'
    },
    {
        sno: 10, fieldName: 'computer', userName: 'Checker', userId: 'rJa259', adminName: 'Jason Schmitt', adminId: 'j.schmitt@bank.com',
        createdDate: '2026-04-20', updatedDate: '2026-04-20', operationPerformed: 'Verify', operationRequestedBy: 'System',
        city: 'Jaipur', device: 'Tablet', canada: 'No', latitude: '26.9124', longitude: '75.7873', continent: 'Asia',
        ipAddress: '192.168.1.10', fullAddress: '707 Path, Jaipur, India', sessionId: 'SES-010', vehicle: 'N/A', bencode: 'B10', userType: 'CBC Checker'
    },
];

const AuditTrailPage = () => {
    const today = useMemo(() => {
        const d = new Date();
        return d.toISOString().slice(0, 10);
    }, []);

    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(today);
    const [username, setUsername] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const filteredRows = useMemo(() => {
        if (!search.trim()) return MOCK_ROWS;
        const q = search.toLowerCase();
        return MOCK_ROWS.filter(
            (r) =>
                Object.values(r).some((v) =>
                    String(v).toLowerCase().includes(q)
                )
        );
    }, [search]);

    const totalPages = Math.max(1, Math.ceil(TOTAL / PAGE_SIZE));
    const start = (page - 1) * PAGE_SIZE + 1;
    const end = Math.min(page * PAGE_SIZE, TOTAL);

    const handleSubmit = (e) => {
        e.preventDefault();
        setPage(1);
    };

    const columns = [
        { label: 'Sno', key: 'sno' },
        { label: 'Field Name', key: 'fieldName' },
        { label: 'User Name', key: 'userName' },
        { label: 'User ID', key: 'userId' },
        { label: 'Admin Name', key: 'adminName' },
        { label: 'Admin ID', key: 'adminId' },
        { label: 'Created Date', key: 'createdDate' },
        { label: 'Updated Date', key: 'updatedDate' },
        { label: 'Operation Performed', key: 'operationPerformed' },
        { label: 'Operation Requested By', key: 'operationRequestedBy' },
        { label: 'City', key: 'city' },
        { label: 'Device', key: 'device' },
        { label: 'Canada', key: 'canada' },
        { label: 'Latitude', key: 'latitude' },
        { label: 'Longitude', key: 'longitude' },
        { label: 'Continent', key: 'continent' },
        { label: 'IP Address', key: 'ipAddress' },
        { label: 'Full Address', key: 'fullAddress' },
        { label: 'Session ID', key: 'sessionId' },
        { label: 'Vehicle', key: 'vehicle' },
        { label: 'Bencode', key: 'bencode' },
        { label: 'UserType', key: 'userType' }
    ];

    return (
        <div style={pageWrap}>
            <style>
                {`
                .table-scroll-container::-webkit-scrollbar {
                    height: 8px;
                }
                .table-scroll-container::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 4px;
                }
                .table-scroll-container::-webkit-scrollbar-thumb {
                    background: ${maroon};
                    border-radius: 4px;
                }
                .table-scroll-container::-webkit-scrollbar-thumb:hover {
                    background: #6b0000;
                }
                `}
            </style>
            <div style={card}>
                <form style={filterRow} onSubmit={handleSubmit}>
                    <div style={field}>
                        <CustomDatePicker
                            label="From Date"
                            selectedDate={fromDate}
                            onChange={setFromDate}
                        />
                    </div>
                    <div style={field}>
                        <CustomDatePicker
                            label="To Date"
                            selectedDate={toDate}
                            onChange={setToDate}
                        />
                    </div>
                    <label style={{ ...field, flex: '1 1 240px' }}>
                        <span style={label}>Username</span>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={input}
                            placeholder=""
                        />
                    </label>
                    <button type="submit" style={submitBtn}>
                        Submit
                    </button>
                </form>

                <div style={toolbar}>
                    <div style={searchWrap}>
                        <MdSearch size={18} style={searchIcon} aria-hidden />
                        <input
                            type="search"
                            placeholder="Search Here"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={searchInput}
                        />
                    </div>
                    <button type="button" style={downloadBtn}>
                        <MdDownload size={18} />
                        Download Sample File
                    </button>
                </div>

                <div style={tableScroll} className="table-scroll-container">
                    <table style={table}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                {columns.map((col, i) => (
                                    <React.Fragment key={col.label}>
                                        <th style={th}>{col.label}</th>
                                        {i < columns.length - 1 && (
                                            <th style={separator}>|</th>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRows.map((row) => (
                                <tr key={row.sno} style={rowBase}>
                                    {columns.map((col, i) => (
                                        <React.Fragment key={col.key}>
                                            <td style={td}>{row[col.key]}</td>
                                            {i < columns.length - 1 && (
                                                <td style={td}></td>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={paginationWrap}>
                    <div style={pagination}>
                        <span style={pageSummary}>
                            {start} to {end} of {TOTAL}
                        </span>
                        <div style={pageControls}>
                            <button
                                type="button"
                                style={pageBtn}
                                disabled={page <= 1}
                                onClick={() => setPage(1)}
                            >
                                ««
                            </button>
                            <button
                                type="button"
                                style={pageBtn}
                                disabled={page <= 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                            >
                                ‹
                            </button>
                            <span style={pageInfo}>
                                Page {page} of {totalPages}
                            </span>
                            <button
                                type="button"
                                style={pageBtn}
                                disabled={page >= totalPages}
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            >
                                ›
                            </button>
                            <button
                                type="button"
                                style={pageBtn}
                                disabled={page >= totalPages}
                                onClick={() => setPage(totalPages)}
                            >
                                »»
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const maroon = '#8B0000';

const pageWrap = {
    padding: '20px 24px 32px',
    minHeight: '100%',
};

const card = {
    background: '#ffffff',
    borderRadius: '10px',
    boxShadow: 'none',
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
};

const filterRow = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    alignItems: 'flex-end',
    marginBottom: '20px',
};

const field = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: '0 1 160px',
};

const label = {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#4a5568',
};

const input = {
    height: '40px',
    padding: '8px 10px',
    border: '1px solid #cbd5e0',
    borderRadius: '10px',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
};

const submitBtn = {
    background: maroon,
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '0 32px',
    height: '40px',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '0.95rem',
    alignSelf: 'flex-end',
    boxSizing: 'border-box',
};

const toolbar = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
};

const searchWrap = {
    position: 'relative',
    flex: '1 1 220px',
    maxWidth: '320px',
};

const searchIcon = {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#a0aec0',
    pointerEvents: 'none',
};

const searchInput = {
    width: '100%',
    padding: '8px 12px 8px 36px',
    border: '1px solid #cbd5e0',
    borderRadius: '10px',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
};

const downloadBtn = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: '#4a5568',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 16px',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
};

const tableScroll = {
    overflowX: 'auto',
    marginBottom: '16px',
};

const table = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9rem',
};

const th = {
    color: '#000',
    fontWeight: 'bold',
    padding: '15px 10px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    border: 'none',
    fontSize: '0.95rem',
};

const separator = {
    padding: '0 5px',
    color: '#ccc',
    fontWeight: '400',
    fontSize: '1.1rem',
};

const rowBase = {
    borderBottom: '1px solid #eee',
};

const td = {
    padding: '12px 10px',
    textAlign: 'center',
    color: '#2d3748',
    verticalAlign: 'middle',
};

const paginationWrap = {
    marginTop: '20px',
};

const pagination = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    paddingTop: '8px',
    borderTop: '1px solid #edf2f7',
    fontSize: '0.9rem',
    color: '#4a5568',
};

const pageSummary = {
    fontWeight: 500,
};

const pageControls = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
};

const pageBtn = {
    minWidth: '32px',
    height: '32px',
    padding: '0 8px',
    border: '1px solid #cbd5e0',
    background: '#fff',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.85rem',
};

const pageInfo = {
    padding: '0 8px',
    fontWeight: 500,
};

export default AuditTrailPage;
