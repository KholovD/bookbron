import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styled from '@emotion/styled';

const EndpointChip = styled(Chip)`
  font-family: monospace;
`;

const CodeBlock = styled(Box)`
  margin: 1rem 0;
  border-radius: 4px;
  overflow: hidden;
`;

interface APIEndpoint {
  method: string;
  path: string;
  description: string;
  request?: string;
  response?: string;
  headers?: Record<string, string>;
}

const endpoints: Record<string, APIEndpoint[]> = {
  'Authentication': [
    {
      method: 'POST',
      path: '/api/auth/login',
      description: 'User authentication',
      request: JSON.stringify({
        username: 'string',
        password: 'string'
      }, null, 2),
      response: JSON.stringify({
        token: 'string',
        user: {
          id: 'string',
          username: 'string',
          role: 'string'
        }
      }, null, 2)
    }
  ],
  'Computers': [
    {
      method: 'GET',
      path: '/api/computers',
      description: 'Get all computers',
      headers: {
        'Authorization': 'Bearer {token}'
      },
      response: JSON.stringify({
        computers: [
          {
            id: 'string',
            name: 'string',
            status: 'string',
            hourlyRate: 'number'
          }
        ]
      }, null, 2)
    }
  ]
};

export const APIReference: React.FC = () => {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const categories = Object.keys(endpoints);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        API Reference
      </Typography>

      <Tabs
        value={selectedTab}
        onChange={(_, newValue) => setSelectedTab(newValue)}
        sx={{ mb: 3 }}
      >
        {categories.map((category) => (
          <Tab key={category} label={category} />
        ))}
      </Tabs>

      {categories.map((category, index) => (
        <Box
          key={category}
          role="tabpanel"
          hidden={selectedTab !== index}
        >
          {selectedTab === index && (
            <Box>
              {endpoints[category].map((endpoint) => (
                <Box key={endpoint.path} sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <EndpointChip
                      label={endpoint.method}
                      color={endpoint.method === 'GET' ? 'success' : 'primary'}
                    />
                    <Typography variant="subtitle1" component="code">
                      {endpoint.path}
                    </Typography>
                  </Box>

                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {endpoint.description}
                  </Typography>

                  {endpoint.headers && (
                    <>
                      <Typography variant="subtitle2">Headers:</Typography>
                      <CodeBlock>
                        <SyntaxHighlighter
                          language="json"
                          style={materialDark}
                        >
                          {JSON.stringify(endpoint.headers, null, 2)}
                        </SyntaxHighlighter>
                      </CodeBlock>
                    </>
                  )}

                  {endpoint.request && (
                    <>
                      <Typography variant="subtitle2">Request:</Typography>
                      <CodeBlock>
                        <SyntaxHighlighter
                          language="json"
                          style={materialDark}
                        >
                          {endpoint.request}
                        </SyntaxHighlighter>
                      </CodeBlock>
                    </>
                  )}

                  {endpoint.response && (
                    <>
                      <Typography variant="subtitle2">Response:</Typography>
                      <CodeBlock>
                        <SyntaxHighlighter
                          language="json"
                          style={materialDark}
                        >
                          {endpoint.response}
                        </SyntaxHighlighter>
                      </CodeBlock>
                    </>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      ))}
    </Paper>
  );
}; 