import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EmployeeList from '../EmployeeList';
import { employesApi } from '../../utils/api';
import { ToastContext } from '../../context/ToastContext';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../../utils/api');

describe('EmployeeList', () => {
  const showSuccess = jest.fn();
  const showError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <ToastContext.Provider value={{ showSuccess, showError }}>
          <EmployeeList />
        </ToastContext.Provider>
      </BrowserRouter>
    );

  it('renders and calls exportTemplate on export button click', async () => {
    employesApi.list.mockResolvedValue([]);
    employesApi.exportTemplate.mockResolvedValue({
      data: new Blob(['test content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    });

    renderComponent();

    // Wait for initial load
    await waitFor(() => expect(employesApi.list).toHaveBeenCalled());

    const exportButton = screen.getByRole('button', { name: /Modèle Excel/i });
    expect(exportButton).toBeInTheDocument();

    // Mock URL.createObjectURL
    const createObjectURLMock = jest.fn(() => 'blob:http://localhost/test');
    global.URL.createObjectURL = createObjectURLMock;

    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(employesApi.exportTemplate).toHaveBeenCalled();
      expect(showSuccess).toHaveBeenCalledWith('Succès', 'Modèle Excel téléchargé avec succès');
      expect(createObjectURLMock).toHaveBeenCalled();
    });
  });

  it('shows error toast on export failure', async () => {
    employesApi.list.mockResolvedValue([]);
    employesApi.exportTemplate.mockRejectedValue(new Error('Export failed'));

    renderComponent();

    // Wait for initial load
    await waitFor(() => expect(employesApi.list).toHaveBeenCalled());

    const exportButton = screen.getByRole('button', { name: /Modèle Excel/i });
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(showError).toHaveBeenCalledWith('Erreur d\'export', 'Export failed');
    });
  });
});
