import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './FlightTable.css'; // Import the CSS file

interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  status: string;
}

const FlightTable: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchFlights = async () => {
    try {
      const response = await axios.get<Flight[]>('https://flight-status-mock.core.travelopia.cloud/flights');
      setFlights(response.data);
      setError(null);
    } catch (err) {
      setError('Error fetching flights. Please try again later.');
    }
  };

  useEffect(() => {
    fetchFlights();
    const interval = setInterval(fetchFlights, 10000); // Fetch every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const formatDepartureTime = (departureTime: string) => {
    const date = new Date(departureTime);
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    });
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return { formattedDate, formattedTime };
  };

  return (
    <div className="flight-table-container">
      <h1 className="flight-table-title">Flight Status Board</h1>
      {error && <p className="error-message">{error}</p>}
      {flights.length === 0 && !error && <p className="no-flights-message">No flights available.</p>}
      <table className="flight-table">
        <thead>
          <tr>
            <th>Flight Number</th>
            <th>Airline</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {flights.map(flight => {
            const { formattedDate, formattedTime } = formatDepartureTime(flight.departureTime);

            return (
              <tr key={flight.id}>
                <td>{flight.flightNumber}</td>
                <td>{flight.airline}</td>
                <td>{flight.origin}</td>
                <td>{flight.destination}</td>
                <td>{formattedDate}</td>
                <td>{formattedTime}</td>
                <td className={`status-${flight.status.toLowerCase().replace(' ', '-')}`}>
                  {flight.status}
                </td>
                <td>
                  <Link to={`/flight/${flight.id}`}>View Details</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FlightTable;
