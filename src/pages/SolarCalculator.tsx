import React, { useState } from 'react';
import { Tabs, Tab, Box, Button, CircularProgress, Alert } from '@mui/material';
import LocationTab from '../components/tabs/LocationTab';
import SystemTab from '../components/tabs/SystemTab';
import ParametersTab from '../components/tabs/ParametersTab';
import ResultsTab from '../components/tabs/ResultsTab';
import { solarService } from '../services/solarService';

const tabLabels = ['Ubicación', 'Sistema Solar', 'Parámetros', 'Resultados'];

const SolarCalculator: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [locationData, setLocationData] = useState<any>(null);
  const [systemData, setSystemData] = useState<any>(null);
  const [parametersData, setParametersData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  // Handlers para recibir datos de los tabs
  const handleLocation = (data: any) => setLocationData(data);
  const handleSystem = (data: any) => setSystemData(data);
  const handleParameters = (data: any) => setParametersData(data);

  // Submit global
  const handleCalculate = async () => {
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      // Construir payload según backend
      const payload = {
        ...locationData,
        ...systemData,
        ...parametersData,
      };
      const response = await solarService.calculate(payload);
      setResult(response);
      setTab(3); // Ir a resultados
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al calcular');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      <Tabs value={tab} onChange={handleChange} variant="scrollable" scrollButtons="auto">
        {tabLabels.map((label, idx) => (
          <Tab label={label} key={label} />
        ))}
      </Tabs>
      <Box sx={{ mt: 2 }}>
        {tab === 0 && <LocationTab onChange={handleLocation} />}
        {tab === 1 && <SystemTab onChange={handleSystem} />}
        {tab === 2 && <ParametersTab onChange={handleParameters} />}
        {tab === 3 && <ResultsTab result={result} loading={loading} error={error} />}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleCalculate}
          disabled={loading || !locationData || !systemData || !parametersData}
        >
          {loading ? <CircularProgress size={24} /> : 'Calcular'}
        </Button>
      </Box>
      {error && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
    </Box>
  );
};

export default SolarCalculator;
