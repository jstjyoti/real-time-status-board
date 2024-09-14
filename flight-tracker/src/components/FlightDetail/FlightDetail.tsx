import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './FlightDetail.css'; // Import the CSS file

interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  status: string;
}

const FlightDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlight = async () => {
      if (!id) {
        setError('Invalid flight ID');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get<Flight>(`https://flight-status-mock.core.travelopia.cloud/flights/${id}`);
        setFlight(response.data);
      } catch (err) {
        setError('Error fetching flight details');
      } finally {
        setLoading(false);
      }
    };

    fetchFlight();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!flight) return <div>No flight details available</div>;

  const formattedDepartureTime = new Date(flight.departureTime).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flight-detail">
      <h2>Flight Details</h2>
      <table>
        <tbody>
          <tr>
            <th>Flight Number</th>
            <td>{flight.flightNumber}</td>
          </tr>
          <tr>
            <th>Airline</th>
            <td>{flight.airline}</td>
          </tr>
          <tr>
            <th>Origin</th>
            <td>{flight.origin}</td>
          </tr>
          <tr>
            <th>Destination</th>
            <td>{flight.destination}</td>
          </tr>
          <tr>
            <th>Departure Time</th>
            <td>{formattedDepartureTime}</td>
          </tr>
          <tr>
            <th>Status</th>
            <td>{flight.status}</td>
          </tr>
        </tbody>
      </table>
      <Link to="/" className="back-link">Back to Flight List</Link>
    </div>
  );
};

export default FlightDetail;
