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
          <small className="hint">결과가 보이지 않는다면 새로고침 해주세요.</small>
        </div>
        <MeetingHistory showTitle={false} />
      </section>
    </div>
  )
}

export default Home

