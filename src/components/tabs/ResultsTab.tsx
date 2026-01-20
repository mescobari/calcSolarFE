import React from 'react';
import { Box, Typography, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface ResultsTabProps {
  result: any;
  loading: boolean;
  error: string | null;
}

const ResultsTab: React.FC<ResultsTabProps> = ({ result, loading, error }) => {
  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }
  if (!result) {
    return <Alert severity="info">No hay resultados para mostrar.</Alert>;
  }

  // Ejemplo de campos esperados: result.summary, result.ac_annual, result.ac_monthly
  return (
    <Box>
      <Typography variant="h5" gutterBottom>Resumen del sistema</Typography>
      <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 6, overflowX: 'auto' }}>{JSON.stringify(result.summary || result, null, 2)}</pre>

      {result.ac_annual && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Producción anual estimada</Typography>
          <Typography variant="body1">{result.ac_annual} kWh</Typography>
        </Box>
      )}

      {result.ac_monthly && Array.isArray(result.ac_monthly) && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Producción mensual (kWh)</Typography>
          <TableContainer component={Paper} sx={{ maxWidth: 500 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Mes</TableCell>
                  <TableCell align="right">kWh</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {result.ac_monthly.map((kwh: number, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell align="right">{kwh}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default ResultsTab;
