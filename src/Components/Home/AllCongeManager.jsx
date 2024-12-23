import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Header } from './Header';
import ReactPaginate from 'react-paginate';
import * as XLSX from 'xlsx';

// MUI Components
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Box,
    Typography,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Chip,
} from '@mui/material';

const AllCongeManager = () => {
    const [conges, setConges] = useState([]);
    const [filteredConges, setFilteredConges] = useState([]);
    const [search, setSearch] = useState('');
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');
    const [stateFilter, setStateFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10; // Number of items per page

    // Fetching congés from the backend
    useEffect(() => {
        const fetchConges = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/conge/emp', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setConges(response.data);
                setFilteredConges(response.data);
            } catch (error) {
                console.error('Error fetching congés:', error);
            }
        };

        fetchConges();
    }, []);

    // Filtering logic
    useEffect(() => {
        const filterData = () => {
            const searchLower = search.toLowerCase();
            const filtered = conges.filter((conge) => {
                const employeeName = conge.employee?.username?.toLowerCase() || '';
                const matchName = employeeName.includes(searchLower);
                const matchStartDate =
                    !startDateFilter || new Date(conge.date_debut) >= new Date(startDateFilter);
                const matchEndDate =
                    !endDateFilter || new Date(conge.date_fin) <= new Date(endDateFilter);
                const matchState = !stateFilter || conge.etat === stateFilter;
                return matchName && matchStartDate && matchEndDate && matchState;
            });
            setFilteredConges(filtered);
        };

        filterData();
    }, [search, startDateFilter, endDateFilter, stateFilter, conges]);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    // Get current page items
    const displayedConges = filteredConges.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    // Function to get color based on the status
    const getStatusColor = (status) => {
        switch (status) {
            case 'accepter':
                return 'green';
            case 'attend':
                return 'orange';
            case 'refuser':
                return 'red';
            default:
                return 'gray';
        }
    };

    // Export to Excel function
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredConges.map((conge) => ({
            'Employee': conge.idemployee?.username || 'Unknown',
            'Start Date': new Date(conge.date_debut).toLocaleDateString(),
            'End Date': new Date(conge.date_fin).toLocaleDateString(),
            'Status': conge.etat,
            'Reason': conge.description || 'N/A',
        })));

        const workbook = XLSX.utils.book_new();

    // Generate a more suitable filename format: YYYY-MM-DD_HH-MM-SS
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}-${date.getSeconds().toString().padStart(2, '0')}`;
    const fileName = `${formattedDate}_conges.xlsx`;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Conges');
    XLSX.writeFile(workbook, fileName);
    };

    return (
        <div className="conges-container">
            <Header />
            <br /><br />
            <Box
                sx={{
                    maxWidth: '90%',
                    margin: '20px auto',
                    padding: '20px',
                    background: '#f9f9f9',
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Typography variant="h4" sx={{ marginBottom: '20px' }}>
                    All Congés
                </Typography>

                {/* Filters */}
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        gap: '20px',
                        marginBottom: '20px',
                    }}
                >
                    <TextField
                        label="Search Employee Name"
                        variant="outlined"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ flex: 1 }}
                    />
                    <TextField
                        label="Start Date"
                        type="date"
                        value={startDateFilter}
                        onChange={(e) => setStartDateFilter(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{ flex: 1 }}
                    />
                    <TextField
                        label="End Date"
                        type="date"
                        value={endDateFilter}
                        onChange={(e) => setEndDateFilter(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{ flex: 1 }}
                    />
                    {/* Status Filter */}
                    <FormControl sx={{ flex: 1 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={stateFilter}
                            onChange={(e) => setStateFilter(e.target.value)}
                            label="Status"
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="accepter">Approuvé</MenuItem>
                            <MenuItem value="attend">En attente</MenuItem>
                            <MenuItem value="refuser">Rejeté</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/* Export Button */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={exportToExcel}
                    >
                        Export to Excel
                    </Button>
                </Box>

                {/* Congés Table */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Employee</TableCell>
                                <TableCell>Start Date</TableCell>
                                <TableCell>End Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Reason</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedConges.map((conge) => (
                                <TableRow key={conge._id}>
                                    <TableCell>{conge.idemployee?.username || 'Unknown'}</TableCell>
                                    <TableCell>{new Date(conge.date_debut).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(conge.date_fin).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={conge.etat}
                                            sx={{
                                                backgroundColor: getStatusColor(conge.etat),
                                                color: 'white',
                                                fontWeight: 'bold',
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>{conge.description || 'N/A'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

         
            </Box>
        </div>
    );
};

export default AllCongeManager;
