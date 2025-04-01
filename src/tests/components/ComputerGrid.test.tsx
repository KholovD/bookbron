import { screen, fireEvent, waitFor } from '@testing-library/react';
import { ComputerGrid } from '@/components/Dashboard/ComputerGrid';
import { renderWithProviders } from '../utils/TestUtils';
import { mockApi } from '../utils/TestUtils';

describe('ComputerGrid Component', () => {
  const mockComputers = [
    { id: '1', name: 'PC-1', status: 'active', hourlyRate: 10 },
    { id: '2', name: 'PC-2', status: 'maintenance', hourlyRate: 12 }
  ];

  beforeEach(() => {
    mockApi.get.mockResolvedValue({ data: mockComputers });
  });

  it('renders computers correctly', async () => {
    renderWithProviders(<ComputerGrid />);

    await waitFor(() => {
      expect(screen.getByText('PC-1')).toBeInTheDocument();
      expect(screen.getByText('PC-2')).toBeInTheDocument();
    });
  });

  it('handles computer control actions', async () => {
    mockApi.post.mockResolvedValue({ data: { success: true } });

    renderWithProviders(<ComputerGrid />);

    await waitFor(() => {
      const controlButton = screen.getByTestId('control-button-1');
      fireEvent.click(controlButton);
    });

    expect(mockApi.post).toHaveBeenCalledWith(
      '/computers/1/control',
      expect.any(Object)
    );
  });

  it('shows loading state', () => {
    mockApi.get.mockImplementation(() => new Promise(() => {}));

    renderWithProviders(<ComputerGrid />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('shows error state', async () => {
    mockApi.get.mockRejectedValue(new Error('Failed to fetch'));

    renderWithProviders(<ComputerGrid />);

    await waitFor(() => {
      expect(screen.getByText(/xatolik yuz berdi/i)).toBeInTheDocument();
    });
  });
}); 