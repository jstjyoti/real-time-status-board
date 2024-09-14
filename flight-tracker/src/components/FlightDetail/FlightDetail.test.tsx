import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import FlightDetail from './FlightDetail';
import { BrowserRouter as Router, MemoryRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('FlightDetail', () => {
  test('renders FlightDetail component with flight data', async () => {
    const flight = {
      id: '1',
      flightNumber: 'AA123',
      airline: 'American Airlines',
      origin: 'JFK',
      destination: 'LAX',
      departureTime: '2024-09-13T15:00:00Z',
      status: 'On Time',
    };
    mockedAxios.get.mockResolvedValue({ data: flight });
    render(
      <MemoryRouter initialEntries={['/flight/1']}>
        <Routes>
          <Route path="/flight/:id" element={<FlightDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Flight Details')).toBeInTheDocument();
      expect(screen.getByText('AA123')).toBeInTheDocument();
      expect(screen.getByText('American Airlines')).toBeInTheDocument();
      expect(screen.getByText('JFK')).toBeInTheDocument();
      expect(screen.getByText('LAX')).toBeInTheDocument();
      expect(screen.getByText('September 13, 2024, 3:00 PM')).toBeInTheDocument();
      expect(screen.getByText('On Time')).toBeInTheDocument();
    });
  });

  test('handles error when fetching flight details', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Error fetching flight details'));
    render(
      <MemoryRouter initialEntries={['/flight/1']}>
        <Routes>
          <Route path="/flight/:id" element={<FlightDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Error fetching flight details. Please try again later.')).toBeInTheDocument();
    });
  });

  test('displays no flight message when no flight data is returned', async () => {
    mockedAxios.get.mockResolvedValue({ data: null });

    render(
      <MemoryRouter initialEntries={['/flight/1']}>
        <Routes>
          <Route path="/flight/:id" element={<FlightDetail />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('No flight details available.')).toBeInTheDocument();
    });
  });
});
