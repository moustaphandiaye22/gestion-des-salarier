import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CyclesPaie from '../CyclesPaie.jsx';
import { cyclesPaieApi } from '../../utils/api';
import { ToastProvider } from '../../context/ToastContext';
import { AuthProvider } from '../../context/AuthContext';

jest.mock('../../utils/api');

const mockCycles = [
  {
    id: 1,
    nom: 'Cycle Janvier 2024',
    entreprise: { id: 1, nom: 'TechCorp' },
    frequence: 'MENSUELLE',
    dateDebut: '2024-01-01T00:00:00.000Z',
    dateFin: '2024-01-31T00:00:00.000Z',
    statut: 'ACTIF',
    statutValidation: 'VALIDE',
    bulletins: [],
  },
  {
    id: 2,
    nom: 'Cycle Février 2024',
    entreprise: { id: 2, nom: 'OtherCorp' },
    frequence: 'MENSUELLE',
    dateDebut: '2024-02-01T00:00:00.000Z',
    dateFin: '2024-02-29T00:00:00.000Z',
    statut: 'ACTIF',
    statutValidation: 'BROUILLON',
    bulletins: [],
  },
];

describe('CyclesPaie page', () => {
  beforeEach(() => {
    cyclesPaieApi.list.mockResolvedValue(mockCycles);
  });

  test('renders and filters cycles by search term', async () => {
    render(
      <AuthProvider>
        <ToastProvider>
          <CyclesPaie />
        </ToastProvider>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/TechCorp/i)).toBeInTheDocument();
      expect(screen.getByText(/OtherCorp/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Rechercher par nom, entreprise/i);
    fireEvent.change(searchInput, { target: { value: 'TechCorp' } });

    await waitFor(() => {
      expect(screen.getByText(/TechCorp/i)).toBeInTheDocument();
      expect(screen.queryByText(/OtherCorp/i)).not.toBeInTheDocument();
    });
  });

  test('filters cycles by statut', async () => {
    render(
      <AuthProvider>
        <ToastProvider>
          <CyclesPaie />
        </ToastProvider>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/TechCorp/i)).toBeInTheDocument();
      expect(screen.getByText(/OtherCorp/i)).toBeInTheDocument();
    });

    const statutSelect = screen.getByDisplayValue(/Tous statuts/i);
    fireEvent.change(statutSelect, { target: { value: 'ACTIF' } });

    await waitFor(() => {
      expect(screen.getByText(/TechCorp/i)).toBeInTheDocument();
      expect(screen.getByText(/OtherCorp/i)).toBeInTheDocument();
    });
  });

  test('displays error message on cycle close failure', async () => {
    cyclesPaieApi.close.mockRejectedValue({
      response: {
        data: {
          error: 'Tous les paiements doivent être effectués avant de clôturer le cycle'
        }
      }
    });

    render(
      <AuthProvider>
        <ToastProvider>
          <CyclesPaie />
        </ToastProvider>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/TechCorp/i)).toBeInTheDocument();
    });

    // Find and click the close button for the first cycle
    const closeButtons = screen.getAllByTitle('Clôturer');
    fireEvent.click(closeButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Tous les paiements doivent être effectués/i)).toBeInTheDocument();
    });
  });
});
