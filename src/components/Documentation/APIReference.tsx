import React from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Box,
  Chip
} from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export const APIReference: React.FC = () => {
  const [value, setValue] = React.useState(0);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        API Qo'llanmasi
      </Typography>

      <Tabs 
        value={value} 
        onChange={(_, newValue) => setValue(newValue)}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
      >
        <Tab label="Autentifikatsiya" />
        <Tab label="Kompyuterlar" />
        <Tab label="Sessiyalar" />
        <Tab label="To'lovlar" />
      </Tabs>

      <TabPanel value={value} index={0}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Endpoint</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Tavsif</TableCell>
                <TableCell>Parameters</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>/api/auth/login</TableCell>
                <TableCell>
                  <Chip label="POST" color="primary" size="small" />
                </TableCell>
                <TableCell>Tizimga kirish</TableCell>
                <TableCell>
                  <pre>
                    {JSON.stringify({
                      username: "string",
                      password: "string"
                    }, null, 2)}
                  </pre>
                </TableCell>
              </TableRow>
              {/* Boshqa endpointlar... */}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Boshqa tablar... */}
    </Paper>
  );
}; 