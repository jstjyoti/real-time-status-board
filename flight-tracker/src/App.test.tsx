// import React from 'react';
// import { render, screen, waitFor, fireEvent } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import App from './App';
// import FlightTable from './components/FlightTable/FlightTable';
// import FlightDetail from './components/FlightDetail/FlightDetail';
// import axios from 'axios';
// import MockAdapter from 'axios-mock-adapter';
// const mock = new MockAdapter(axios);

// describe('App Component', () => {
//   beforeEach(() => {
//     mock.reset();
//   });

//   test('renders FlightTable component on the root path', async () => {
//     mock.onGet('https://flight-status-mock.core.travelopia.cloud/flights').reply(200, [
//       {
//         id: '1',
//         flightNumber: 'AA123',
//         airline: 'American Airlines',
//         origin: 'JFK',
//         destination: 'LAX',
//         departureTime: '2024-09-13T15:00:00Z',
//         status: 'On Time',
//       },
//     ]);

//     render(
//       <Router>
//         <App />
//       </Router>
//     );

//     expect(screen.getByText(/Flight Status Board/i)).toBeInTheDocument();
//     await waitFor(() => {
//       expect(screen.getByText(/AA123/i)).toBeInTheDocument();
//     });
//   });

//   test('handles empty flight list gracefully', async () => {
//     mock.onGet('https://flight-status-mock.core.travelopia.cloud/flights').reply(200, []);

//     render(
//       <Router>
//         <App />
//       </Router>
//     );

//     await waitFor(() => {
//       expect(screen.getByText(/No flights available./i)).toBeInTheDocument();
//     });
//   });

//   test('handles API error in FlightTable', async () => {
//     mock.onGet('https://flight-status-mock.core.travelopia.cloud/flights').reply(500);

//     render(
//       <Router>
//         <App />
//       </Router>
//     );

//     await waitFor(() => {
//       expect(screen.getByText(/Error fetching flights. Please try again later./i)).toBeInTheDocument();
//     });
//   });

//   test('renders FlightDetail component on flight detail path', async () => {
//     mock.onGet('https://flight-status-mock.core.travelopia.cloud/flights/1').reply(200, {
//       id: '1',
//       flightNumber: 'AA123',
//       airline: 'American Airlines',
//       origin: 'JFK',
//       destination: 'LAX',
//       departureTime: '2024-09-13T15:00:00Z',
//       status: 'On Time',
//     });

//     render(
//       <Router>
//         <Routes>
//           <Route path="/" element={<FlightTable />} />
//           <Route path="/flight/:id" element={<FlightDetail />} />
//         </Routes>
//       </Router>
//     );
//     window.history.pushState({}, 'Flight Detail Page', '/flight/1');

//     expect(screen.getByText(/Flight Details/i)).toBeInTheDocument();
//     await waitFor(() => {
//       expect(screen.getByText(/AA123/i)).toBeInTheDocument();
//       expect(screen.getByText(/13 09 2024/i)).toBeInTheDocument(); // Expect formatted date
//       expect(screen.getByText(/15:00:00/i)).toBeInTheDocument(); // Expect formatted time
//     });
//   });

//   test('handles error in FlightDetail component', async () => {
//     mock.onGet('https://flight-status-mock.core.travelopia.cloud/flights/1').reply(500);

//     render(
//       <Router>
//         <Routes>
//           <Route path="/" element={<FlightTable />} />
//           <Route path="/flight/:id" element={<FlightDetail />} />
//         </Routes>
//       </Router>
//     );

//     window.history.pushState({}, 'Flight Detail Page', '/flight/1');
//     await waitFor(() => {
//       expect(screen.getByText(/Error fetching flight details/i)).toBeInTheDocument();
//     });
//   });

//   test('navigates back to FlightTable from FlightDetail', async () => {
//     mock.onGet('https://flight-status-mock.core.travelopia.cloud/flights').reply(200, [
//       {
//         id: '1',
//         flightNumber: 'AA123',
//         airline: 'American Airlines',
//         origin: 'JFK',
//         destination: 'LAX',
//         departureTime: '2024-09-13T15:00:00Z',
//         status: 'On Time',
//       },
//     ]);
//     mock.onGet('https://flight-status-mock.core.travelopia.cloud/flights/1').reply(200, {
//       id: '1',
//       flightNumber: 'AA123',
//       airline: 'American Airlines',
//       origin: 'JFK',
//       destination: 'LAX',
//       departureTime: '2024-09-13T15:00:00Z',
//       status: 'On Time',
//     });
//     render(
//       <Router>
//         <Routes>
//           <Route path="/" element={<FlightTable />} />
//           <Route path="/flight/:id" element={<FlightDetail />} />
//         </Routes>
//       </Router>
//     );
//     window.history.pushState({}, 'Flight Detail Page', '/flight/1');

//     expect(screen.getByText(/Flight Details/i)).toBeInTheDocument();
//     await waitFor(() => {
//       expect(screen.getByText(/AA123/i)).toBeInTheDocument();
//     });

//     // Navigate back to the flight list
//     fireEvent.click(screen.getByText(/Back to Flight List/i));

//     await waitFor(() => {
//       expect(screen.getByText(/Flight Status Board/i)).toBeInTheDocument();
//     });
//   });

//   test('handles non-existent flight detail route gracefully', async () => {
//     mock.onGet('https://flight-status-mock.core.travelopia.cloud/flights/999').reply(404);

//     render(
//       <Router>
//         <Routes>
//           <Route path="/" element={<FlightTable />} />
//           <Route path="/flight/:id" element={<FlightDetail />} />
//         </Routes>
//       </Router>
//     );

//     window.history.pushState({}, 'Flight Detail Page', '/flight/999');

//     await waitFor(() => {
//       expect(screen.getByText(/No flight details available/i)).toBeInTheDocument();
//     });
//   });

//   test('ensures API call on FlightTable mount', async () => {
//     const spy = jest.spyOn(axios, 'get');

//     mock.onGet('https://flight-status-mock.core.travelopia.cloud/flights').reply(200, [
//       {
//         id: '1',
//         flightNumber: 'AA123',
//         airline: 'American Airlines',
//         origin: 'JFK',
//         destination: 'LAX',
//         departureTime: '2024-09-13T15:00:00Z',
//         status: 'On Time',
//       },
//     ]);

//     render(
//       <Router>
//         <App />
//       </Router>
//     );

//     await waitFor(() => {
//       expect(spy).toHaveBeenCalledWith('https://flight-status-mock.core.travelopia.cloud/flights');
//     });
//   });
// });
