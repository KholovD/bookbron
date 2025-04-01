import React, { Component, ErrorInfo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
} from '@mui/material';
import { Refresh, BugReport } from '@mui/icons-material';
import { logger } from './logger';
import styled from '@emotion/styled';

const ErrorContainer = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
`;

const ErrorPaper = styled(Paper)`
  padding: 2rem;
  text-align: center;
  max-width: 600px;
`;

const ErrorStack = styled(Typography)`
  margin: 1rem 0;
  padding: 1rem;
  background: ${({ theme }) => theme.palette.grey[100]};
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.875rem;
  overflow-x: auto;
  white-space: pre-wrap;
`;

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    logger.error('React Error Boundary caught an error', {
      error,
      errorInfo,
      location: window.location.href
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReportError = async () => {
    try {
      await fetch('/api/errors/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: this.state.error?.toString(),
          errorInfo: this.state.errorInfo?.componentStack,
          url: window.location.href,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      logger.error('Failed to report error', error);
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer>
          <ErrorPaper elevation={3}>
            <Typography variant="h5" color="error" gutterBottom>
              Xatolik yuz berdi
            </Typography>

            <Typography variant="body1" color="textSecondary" paragraph>
              Kechirasiz, kutilmagan xatolik yuz berdi. Iltimos, sahifani qayta yuklang
              yoki administratorga murojaat qiling.
            </Typography>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <ErrorStack component="pre" color="error">
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </ErrorStack>
            )}

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={this.handleReload}
              >
                Qayta yuklash
              </Button>
              <Button
                variant="outlined"
                startIcon={<BugReport />}
                onClick={this.handleReportError}
              >
                Xatolik haqida xabar berish
              </Button>
            </Box>
          </ErrorPaper>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
} 