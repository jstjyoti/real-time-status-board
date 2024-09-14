import React from 'react';
import { Route, Routes } from 'react-router-dom';
import FlightTable from './components/FlightTable/FlightTable';
import FlightDetail from './components/FlightDetail/FlightDetail';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<FlightTable />} />
      <Route path="/flight/:id" element={<FlightDetail />} />
    </Routes>
  );
};

export default App;
