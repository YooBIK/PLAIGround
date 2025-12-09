import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import MeetingDetail from './components/MeetingDetail'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="logo">
              🎙️ AI Meeting Note
            </Link>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<Home />} />
            <Route path="/meeting/:id" element={<MeetingDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
