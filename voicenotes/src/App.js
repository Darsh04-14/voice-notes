import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import Lectures from './Components/Lectures';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Dashboard/>}/>
      <Route path="/lectures" element={<Lectures/>}/>
    </Routes>
  );
}

export default App;