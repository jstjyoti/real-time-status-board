import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import FlightTable from './FlightTable';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('FlightTable', () => {
  test('renders FlightTable component', async () => {
    const flights = [
      {
        id: '1',
        flightNumber: 'AA123',
        airline: 'American Airlines',
        origin: 'JFK',
        destination: 'LAX',
        departureTime: '2024-09-13T15:00:00Z',
        status: 'On Time',
      },
    ];

    mockedAxios.get.mockResolvedValue({ data: flights });

    render(
      <Router>
        <FlightTable />
      </Router>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Flight Status Board')).toBeInTheDocument();
      expect(screen.getByText('AA123')).toBeInTheDocument();
      expect(screen.getByText('American Airlines')).toBeInTheDocument();
      expect(screen.getByText('JFK')).toBeInTheDocument();
      expect(screen.getByText('LAX')).toBeInTheDocument();
      expect(screen.getByText('On Time')).toBeInTheDocument();
    });
  });

  test('handles error when fetching flights', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Error fetching flights'));

    render(
      <Router>
        <FlightTable />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Error fetching flights. Please try again later.')).toBeInTheDocument();
    });
  });

  test('displays no flights message when there are no flights', async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });

    render(
      <Router>
        <FlightTable />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('No flights available.')).toBeInTheDocument();
    });
  });
});
