import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Header } from './Header';
import ReactPaginate from 'react-paginate';
import { FaEdit, FaTrash, FaFileExcel } from 'react-icons/fa';

// MUI Components
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Tooltip,
    IconButton,
    Badge,
    Select,
    MenuItem,
    TextField,
    Box,
    Button
} from '@mui/material';

// XLSX for exporting
import * as XLSX from 'xlsx';

const AllTimeSheetManager = () => {
    const [timesheets, setTimesheets] = useState([]);
    const [filteredTimesheets, setFilteredTimesheets] = useState([]);
    const [search, setSearch] = useState('');
    const [etatFilter, setEtatFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10; // Number of timesheets per page
    const navigate = useNavigate();

    // Fetch timesheets on mount
    useEffect(() => {
        const fetchTimesheets = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/timesheets', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTimesheets(response.data);
                setFilteredTimesheets(response.data);
            } catch (error) {
                console.error('Error fetching timesheets:', error);
                toast.error('Failed to load timesheets. Please try again.');
            }
        };

        fetchTimesheets();
    }, []);

    // Filter timesheets based on search and state
    useEffect(() => {
        const filterData = () => {
            const searchLower = search.toLowerCase();
            const filtered = timesheets.filter(
                (ts) =>
                    (!etatFilter || ts.etat === etatFilter) &&
                    (ts.description.toLowerCase().includes(searchLower) ||
                        ts.idEmployee?.username.toLowerCase().includes(searchLower))
            );
            setFilteredTimesheets(filtered);
        };

        filterData();
    }, [search, etatFilter, timesheets]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this timesheet?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/timesheets/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                toast.success('Timesheet deleted successfully!');
                setTimesheets(timesheets.filter((ts) => ts._id !== id));
            } catch (error) {
                console.error('Error deleting timesheet:', error);
                toast.error('Failed to delete the timesheet.');
            }
        }
    };

    const handleEdit = (timesheetId) => {
        navigate(`/EditTimeSheetManage/${timesheetId}`);
    };

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    // Get current page items
    const displayedTimesheets = filteredTimesheets.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    // Export to Excel function
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredTimesheets.map((timesheet) => ({
            'Employee': timesheet.idEmployee?.username || 'Unknown',
            'Status': timesheet.etat,
            'Description': timesheet.description || 'N/A',
            'Days & Availability': timesheet.jours.map(jour => {
                return `${jour.jour}: ${jour.periodes.matin ? 'Morning' : ''} ${jour.periodes.soir ? 'Evening' : ''}`;
            }).join(', '),
        })));

        const workbook = XLSX.utils.book_new();
        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}-${date.getSeconds().toString().padStart(2, '0')}`;
        const fileName = `${formattedDate}_timesheets.xlsx`;

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Timesheets');
        XLSX.writeFile(workbook, fileName);
    };

    return (
        <div className="timesheets-container">
            <Header />
            <br /><br />
            <Box sx={{ maxWidth: '1200px', margin: '20px auto', padding: '20px', background: '#f9f9f9', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <h2>All Timesheets</h2>

                {/* Filters */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <TextField
                        label="Search"
                        variant="outlined"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ width: '40%' }}
                    />
                    <Select
                        value={etatFilter}
                        onChange={(e) => setEtatFilter(e.target.value)}
                        displayEmpty
                        sx={{ width: '30%' }}
                    >
                        <MenuItem value="">All States</MenuItem>
                        <MenuItem value="attend">Attend</MenuItem>
                        <MenuItem value="accepter">Approved</MenuItem>
                        <MenuItem value="refuser">Rejected</MenuItem>
                    </Select>
                    {/* Export Button */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={exportToExcel}
                        startIcon={<FaFileExcel />}
                        sx={{ width: '20%' }}
                    >
                        Export to Excel
                    </Button>
                </Box>

                {/* Timesheet Table */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Employee</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Days & Availability</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedTimesheets.map((timesheet) => (
                                <TableRow key={timesheet._id}>
                                    <TableCell>{timesheet.idEmployee?.username || 'Unknown'}</TableCell>
                                    <TableCell>
                                        <Badge
                                            badgeContent={timesheet.etat}
                                            color={timesheet.etat === 'accepter' ? 'success' : timesheet.etat === 'refuser' ? 'error' : 'warning'}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {timesheet.jours.map((jour, index) => (
                                            <div key={index}>
                                                <strong>{jour.jour}:</strong>{' '}
                                                {jour.periodes.matin ? 'Morning ' : ''}
                                                {jour.periodes.soir ? 'Evening' : ''}
                                            </div>
                                        ))}
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title="Edit">
                                            <IconButton onClick={() => handleEdit(timesheet._id)}>
                                                <FaEdit />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton onClick={() => handleDelete(timesheet._id)}>
                                                <FaTrash />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination */}
                <Box sx={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                    <ReactPaginate
                        previousLabel={'Previous'}
                        nextLabel={'Next'}
                        pageCount={Math.ceil(filteredTimesheets.length / itemsPerPage)}
                        onPageChange={handlePageChange}
                        containerClassName={'pagination'}
                        activeClassName={'active'}
                    />
                </Box>
            </Box>
        </div>
    );
};

export default AllTimeSheetManager;
