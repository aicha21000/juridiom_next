import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import Home from './Home';

// Mock des composants externes
jest.mock('./GoogleReviews', () => {
  return function MockGoogleReviews() {
    return <div data-testid="google-reviews">Google Reviews</div>;
  };
});

// Mock des images
jest.mock('../assets/CNI_France.webp', () => 'mocked-cni-image');
jest.mock('../assets/jugement_divorce.webp', () => 'mocked-jugement-image');
jest.mock('../assets/casier.webp', () => 'mocked-casier-image');
jest.mock('../assets/certificat_travail.webp', () => 'mocked-certificat-image');
jest.mock('../assets/diplome_tunisie.webp', () => 'mocked-diplome-image');
jest.mock('../assets/passeport_francais.webp', () => 'mocked-passeport-image');
jest.mock('../assets/decompte.webp', () => 'mocked-decompte-image');
jest.mock('../assets/ordonnance.webp', () => 'mocked-ordonnance-image');
jest.mock('../assets/acte_naissance_maroc.webp', () => 'mocked-acte-image');
jest.mock('../assets/attestation_assurance.webp', () => 'mocked-assurance-image');
jest.mock('../assets/permis_conduire.webp', () => 'mocked-permis-image');
jest.mock('../assets/acte_naissance_liban.webp', () => 'mocked-acte-liban-image');

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Home Component', () => {
  test('renders without crashing', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText('Aicha Salhi')).toBeInTheDocument();
  });

  test('displays all 12 document examples', () => {
    renderWithProviders(<Home />);
    
    // Vérifier que tous les exemples de documents sont présents
    expect(screen.getByText('Carte d\'identité')).toBeInTheDocument();
    expect(screen.getByText('Jugement de divorce')).toBeInTheDocument();
    expect(screen.getByText('Document Administratif')).toBeInTheDocument();
    expect(screen.getByText('Certificat de Travail')).toBeInTheDocument();
    expect(screen.getByText('Diplôme Universitaire')).toBeInTheDocument();
    expect(screen.getByText('Passeport')).toBeInTheDocument();
    expect(screen.getByText('Facture')).toBeInTheDocument();
    expect(screen.getByText('Document Médical')).toBeInTheDocument();
    expect(screen.getByText('Certificat de Naissance')).toBeInTheDocument();
    expect(screen.getByText('Document d\'assurance')).toBeInTheDocument();
    expect(screen.getByText('Permis de conduire')).toBeInTheDocument();
    expect(screen.getByText('Certificat de Naissance Liban')).toBeInTheDocument();
  });

  test('has correct grid layout classes', () => {
    renderWithProviders(<Home />);
    
    const gridContainer = screen.getByText('Exemples de Documents Traduits').closest('div')?.nextElementSibling;
    expect(gridContainer).toHaveClass('grid', 'grid-cols-2', 'sm:grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4');
  });

  test('displays Google Reviews section', () => {
    renderWithProviders(<Home />);
    expect(screen.getByTestId('google-reviews')).toBeInTheDocument();
  });
});

