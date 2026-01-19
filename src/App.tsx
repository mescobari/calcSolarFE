import Tab1 from './tabs/Tab1';
import Tab2 from './tabs/Tab2';

import React from 'react';
import { Tabs, Tab, Box, Container, Typography } from '@mui/material';

function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [tab, setTab] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Calculadora Modular
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={handleChange} aria-label="tabs example">
          <Tab label="Tab 1" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Tab 2" id="tab-1" aria-controls="tabpanel-1" />
        </Tabs>
      </Box>
      <TabPanel value={tab} index={0}>
        <Tab1 />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <Tab2 />
      </TabPanel>
    </Container>
  );
}

export default App;
