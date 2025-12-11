import React from 'react';
import { Tab, Tabs } from '@mui/material';

interface Props {
  tabValue: number;
  handleTabChange: (e: React.SyntheticEvent, v: number) => void;
}

const TabsWrapper: React.FC<Props> = ({ tabValue, handleTabChange }) => {
  return (
    <Tabs
      value={tabValue}
      onChange={handleTabChange}
      variant="scrollable"
      scrollButtons="auto"
      sx={{ borderBottom: '1px solid #e0e0e0', '& .MuiTab-root': { minWidth: 120, fontSize: '0.875rem', padding: '12px 16px' } }}
    >
      <Tab
        label={<div style={{ display: 'flex', alignItems: 'center' }}>
          Usuários
        </div>}
      />
      <Tab label={<div style={{ display: 'flex', alignItems: 'center' }}>Permissões</div>} />
      <Tab label={<div style={{ display: 'flex', alignItems: 'center' }}>Dashboard Documentos</div>} />
    </Tabs>
  );
};

export default TabsWrapper;
