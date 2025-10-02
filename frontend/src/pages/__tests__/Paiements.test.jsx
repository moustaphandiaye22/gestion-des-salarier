import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Paiements from '../Paiements.jsx';
import { paiementsApi } from '../../utils/api';
import { ToastProvider } from '../../context/ToastContext';
import { AuthProvider } from '../../context/AuthContext';

jest.mock('../../utils/api');

const mockPaiements = [
  {
    id: 1,
    entreprise: { id: 1, nom: 'TechCorp' },
    bulletin: { numeroBulletin: 'BL-TC001-202401' },
    montant: 1000,
    datePaiement: '2024-01-01T00:00:00.000Z',
    modePaiement: 'VIREMENT',
    reference: 'VIR-001',
    statut: 'PAYE',
  },
  {
    id: 2,
    entreprise: { id: 2, nom: 'OtherCorp' },
    bulletin: { numeroBulletin: 'BL-OC001-202401' },
    montant: 2000,
    datePaiement: '2024-01-02T00:00:00.000Z',
    modePaiement: 'CHEQUE',
    reference: 'CHQ-001',
    statut: 'EN_ATTENTE',
  },
];

describe('Paiements page', () => {
  beforeEach(() => {
    paiementsApi.list.mockResolvedValue(mockPaiements);
  });

  test('renders and filters paiements by search term', async () => {
    render(
      <AuthProvider>
        <ToastProvider>
          <Paiements />
        </ToastProvider>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/TechCorp/i)).toBeInTheDocument();
      expect(screen.getByText(/OtherCorp/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Rechercher par entreprise, bulletin/i);
    fireEvent.change(searchInput, { target: { value: 'TechCorp' } });

    await waitFor(() => {
      expect(screen.getByText(/TechCorp/i)).toBeInTheDocument();
      expect(screen.queryByText(/OtherCorp/i)).not.toBeInTheDocument();
    });
  });

  test('filters paiements by statut', async () => {
    render(
      <AuthProvider>
        <ToastProvider>
          <Paiements />
        </ToastProvider>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/TechCorp/i)).toBeInTheDocument();
      expect(screen.getByText(/OtherCorp/i)).toBeInTheDocument();
    });

    const statutSelect = screen.getByDisplayValue(/Tous statuts/i);
    fireEvent.change(statutSelect, { target: { value: 'PAYE' } });

    await waitFor(() => {
      expect(screen.getByText(/TechCorp/i)).toBeInTheDocument();
      expect(screen.queryByText(/OtherCorp/i)).not.toBeInTheDocument();
    });
  });
});
