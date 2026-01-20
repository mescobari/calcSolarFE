import React from 'react';
import SolarCalculator from './pages/SolarCalculator';
import { Container, CssBaseline } from '@mui/material';

function App() {
  return (
    <Container maxWidth="md">
      <CssBaseline />
      <SolarCalculator />
    </Container>
  );
}

export default App;
