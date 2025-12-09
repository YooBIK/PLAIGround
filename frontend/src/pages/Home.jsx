import React from 'react'
import MeetingRecorder from '../components/MeetingRecorder'
import MeetingHistory from '../components/MeetingHistory'
import './Home.css'

const Home = () => {
  return (
    <div className="home-page">
      <section className="home-section">
        <MeetingRecorder />
      </section>
      <section id="archive" className="home-section archive-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">지난 회의 한눈에</p>
            <h2>회의 아카이브</h2>
          </div>
          <small className="hint">녹음/업로드 후 결과가 여기에서 바로 보여요.</small>
        </div>
        <MeetingHistory showTitle={false} />
      </section>
    </div>
  )
}

export default Home

