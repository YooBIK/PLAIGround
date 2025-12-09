import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './MeetingHistory.css'

const MeetingHistory = () => {
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMeetings()
  }, [])

  const fetchMeetings = async () => {
    try {
      const response = await axios.get('/api/meetings')
      setMeetings(response.data)
    } catch (error) {
      console.error('회의록 조회 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="meeting-history">
        <div className="history-container">
          <h1>회의 아카이브</h1>
          <p>로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="meeting-history">
      <div className="history-container">
        <h1>회의 아카이브</h1>
        
        {meetings.length === 0 ? (
          <div className="empty-state">
            <p>저장된 회의록이 없습니다.</p>
            <Link to="/" className="btn btn-primary">
              첫 회의 시작하기
            </Link>
          </div>
        ) : (
          <div className="meetings-list">
            {meetings.map((meeting) => (
              <Link
                key={meeting.id}
                to={`/meeting/${meeting.id}`}
                className="meeting-card"
              >
                <div className="meeting-header">
                  <h3>{meeting.title}</h3>
                  <span className="meeting-date">{formatDate(meeting.created_at)}</span>
                </div>
                {meeting.summary && (
                  <p className="meeting-summary">{meeting.summary}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MeetingHistory
