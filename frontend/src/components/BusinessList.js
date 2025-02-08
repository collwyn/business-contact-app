import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
  Box,
  CircularProgress
} from '@mui/material';
import { Download } from '@mui/icons-material';
import { businesses } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BusinessList = () => {
  const { user } = useAuth();  // Get user from auth context
  const [businessData, setBusinessData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBusinesses();
  }, [user]); // Add user as dependency

  const fetchBusinesses = async () => {
    if (!user) return; // Don't fetch if no user

    try {
      const response = await (user.role === 'admin' 
        ? businesses.getAll() 
        : businesses.getMyEntries());
      setBusinessData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch businesses');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await businesses.export();
      
      // Create blob from response data
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      
      // Create temporary link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'businesses.csv';
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to export data');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Business List
        </Typography>
        {user?.role === 'admin' && (
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleExport}
          >
            Export CSV
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Business Name</TableCell>
              <TableCell>Contact Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              {user?.role === 'admin' && <TableCell>Created By</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {businessData.map((business) => (
              <TableRow key={business._id}>
                <TableCell>{business.businessName}</TableCell>
                <TableCell>{business.contactName}</TableCell>
                <TableCell>{business.emailAddress}</TableCell>
                <TableCell>{business.phoneNumber}</TableCell>
                <TableCell>
                  {`${business.physicalAddress.street}, ${business.physicalAddress.city}, 
                    ${business.physicalAddress.state} ${business.physicalAddress.zipCode}`}
                </TableCell>
                {user?.role === 'admin' && (
                  <TableCell>{business.createdBy?.username}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default BusinessList;