import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CreateTrip from './pages/CreateTrip'
import Survey from './pages/Survey'
import Dashboard from './pages/Dashboard'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateTrip />} />
        <Route path="/survey/:token" element={<Survey />} />
        <Route path="/dashboard/:tripId" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)