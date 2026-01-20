import React from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface ResultsTabProps {
  result: any;
  loading: boolean;
  error: string | null;
}


const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

function formatNumber(num: any, decimals = 2) {
  const n = Number(num);
  return isNaN(n) ? '-' : n.toFixed(decimals);
}

const ResultsTab: React.FC<ResultsTabProps> = ({ result, loading, error }) => {
  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }
  if (!result || !result.outputs) {
    return <Alert severity="info">No hay resultados para mostrar.</Alert>;
  }

  const { outputs, inputs } = result;

  // 1. SECCIÓN RESUMEN
  const resumenItems = [
    {
      label: 'Producción anual (AC)',
      value: formatNumber(outputs.ac_annual),
      unit: 'kWh',
    },
    {
      label: 'Irradiación anual',
      value: formatNumber(outputs.solrad_annual),
      unit: 'kWh/m²/día',
    },
    {
      label: 'Factor de capacidad',
      value: formatNumber(outputs.capacity_factor),
      unit: '%',
    },
  ];

  // 3. SECCIÓN DATOS DEL SISTEMA
  const systemFields = [
    { label: 'Latitud', value: formatNumber(inputs.lat) },
    { label: 'Longitud', value: formatNumber(inputs.lon) },
    { label: 'Capacidad del sistema', value: formatNumber(inputs.system_capacity), unit: 'kW' },
    { label: 'Inclinación', value: formatNumber(inputs.tilt), unit: '°' },
    { label: 'Azimuth', value: formatNumber(inputs.azimuth), unit: '°' },
    { label: 'Pérdidas', value: formatNumber(inputs.losses), unit: '%' },
    { label: 'DC/AC Ratio', value: formatNumber(inputs.dc_ac_ratio) },
    { label: 'Eficiencia inversor', value: formatNumber(inputs.inv_eff), unit: '%' },
  ];

  // 5.1 TABLA MENSUAL
  const tableRows = monthNames.map((month, idx) => ({
    month,
    ac_monthly: formatNumber(outputs.ac_monthly?.[idx]),
    poa_monthly: formatNumber(outputs.poa_monthly?.[idx]),
    solrad_monthly: formatNumber(outputs.solrad_monthly?.[idx]),
    dc_monthly: formatNumber(outputs.dc_monthly?.[idx]),
  }));

  // 6. GRÁFICO COMPARATIVO MENSUAL
  const chartData = monthNames.map((month, idx) => ({
    month,
    AC: Number(outputs.ac_monthly?.[idx] ?? 0),
    DC: Number(outputs.dc_monthly?.[idx] ?? 0),
  }));

  return (
    <Box sx={{ p: { xs: 1, md: 2 } }}>
      {/* 1. SECCIÓN RESUMEN */}
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          {resumenItems.map((item, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Card sx={{ background: '#e3f2fd', boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>{item.label}</Typography>
                  <Typography variant="h5" color="primary">
                    {item.value} {item.unit}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 2. DIVISOR */}
      <Divider sx={{ my: 3, borderBottomWidth: 4, background: '#1976d2' }} />

      {/* 3. SECCIÓN DATOS DEL SISTEMA */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>Datos del sistema</Typography>
        <Grid container spacing={2}>
          {systemFields.map((field, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Box sx={{ p: 2, background: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="body2" color="textSecondary">{field.label}</Typography>
                <Typography variant="subtitle1">
                  {field.value} {field.unit || ''}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 4. DIVISOR */}
      <Divider sx={{ my: 3, borderBottomWidth: 4, background: '#1976d2' }} />

      {/* 5. SECCIÓN OUTPUTS */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>Outputs</Typography>
        <TableContainer component={Paper} sx={{ mb: 2, maxWidth: '100%', overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Mes</TableCell>
                <TableCell align="right">AC mensual (kWh)</TableCell>
                <TableCell align="right">POA mensual (kWh/m²)</TableCell>
                <TableCell align="right">Solrad mensual (kWh/m²/día)</TableCell>
                <TableCell align="right">DC mensual (kWh)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.month}</TableCell>
                  <TableCell align="right">{row.ac_monthly}</TableCell>
                  <TableCell align="right">{row.poa_monthly}</TableCell>
                  <TableCell align="right">{row.solrad_monthly}</TableCell>
                  <TableCell align="right">{row.dc_monthly}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* 6. DIVISOR antes del gráfico */}
      <Divider sx={{ my: 3, borderBottomWidth: 4, background: '#1976d2' }} />

      {/* 6. GRÁFICO COMPARATIVO MENSUAL */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>Gráfico comparativo mensual AC vs DC</Typography>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" label={{ value: 'Mes', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Potencia (kWh)', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value: any, name: string, props: any) => [`${formatNumber(value)} kWh`, name]} />
            <Legend verticalAlign="top" height={36} />
            <Line type="monotone" dataKey="AC" stroke="#1976d2" strokeWidth={3} name="AC mensual" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="DC" stroke="#ff9800" strokeWidth={3} name="DC mensual" />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* 7. JSON COMPLETO */}
      <Divider sx={{ my: 3, borderBottomWidth: 4, background: '#1976d2' }} />
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>JSON completo de la respuesta</Typography>
        <Paper sx={{ p: 2, background: '#212121', color: '#fff', borderRadius: 2, fontSize: 13, overflowX: 'auto' }}>
          <pre style={{ margin: 0, background: 'none', color: 'inherit', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </Paper>
      </Box>
    </Box>
  );
};

export default ResultsTab;
