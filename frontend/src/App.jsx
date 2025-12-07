import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import MeetingRecorder from './components/MeetingRecorder'
import MeetingHistory from './components/MeetingHistory'
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
            <div className="nav-links">
              <Link to="/">회의 시작</Link>
              <Link to="/history">회의 아카이브</Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<MeetingRecorder />} />
            <Route path="/history" element={<MeetingHistory />} />
            <Route path="/meeting/:id" element={<MeetingDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
