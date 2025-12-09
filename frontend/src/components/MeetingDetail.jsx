import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import './MeetingDetail.css'

const MeetingDetail = () => {
  const { id } = useParams()
  const [meeting, setMeeting] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMeeting()
  }, [id])

  const fetchMeeting = async () => {
    try {
      const response = await axios.get(`http://43.203.161.30:8000/api/meetings/${id}`)
      setMeeting(response.data)
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
      <div className="meeting-detail">
        <div className="detail-container">
          <p>로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!meeting) {
    return (
      <div className="meeting-detail">
        <div className="detail-container">
          <p>회의록을 찾을 수 없습니다.</p>
          <Link to="/history" className="btn btn-primary">
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="meeting-detail">
      <div className="detail-container">
        <div className="detail-header">
          <Link to="/history" className="back-link">← 목록으로</Link>
          <h1>{meeting.title}</h1>
          <span className="detail-date">{formatDate(meeting.created_at)}</span>
        </div>

        {meeting.summary && (
          <div className="detail-section">
            <h2>요약</h2>
            <div className="detail-card">
              <p>{meeting.summary}</p>
            </div>
          </div>
        )}

        {meeting.key_points && meeting.key_points.length > 0 && (
          <div className="detail-section">
            <h2>주요 논의 사항</h2>
            <div className="detail-card">
              <ul>
                {meeting.key_points.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {meeting.decisions && meeting.decisions.length > 0 && (
          <div className="detail-section">
            <h2>결정 사항</h2>
            <div className="detail-card">
              <ul>
                {meeting.decisions.map((decision, idx) => (
                  <li key={idx}>{decision}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {meeting.action_items && meeting.action_items.length > 0 && (
          <div className="detail-section">
            <h2>액션 아이템</h2>
            <div className="action-items">
              {meeting.action_items.map((item, idx) => (
                <div key={idx} className="action-item">
                  {typeof item === 'object' ? (
                    <>
                      <strong>{item.task}</strong>
                      <div className="action-details">
                        {item.assignee && <span>담당자: {item.assignee}</span>}
                        {item.deadline && <span>마감일: {item.deadline}</span>}
                      </div>
                    </>
                  ) : (
                    <span>{item}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {meeting.transcript && (
          <div className="detail-section">
            <h2>전체 전사본</h2>
            <div className="transcript-box">
              {meeting.transcript}
            </div>
          </div>
        )}

        <div className="export-buttons">
          <a
            href={`http://43.203.161.30:8000/api/meetings/${id}/export/pdf`}
            className="btn btn-secondary"
            download
          >
              📄 PDF 다운로드
          </a>
          <a
            href={`http://43.203.161.30:8000/api/meetings/${id}/export/docx`}
            className="btn btn-secondary"
            download
          >
              📝 Word 다운로드
          </a>
        </div>
      </div>
    </div>
  )
}

export default MeetingDetail
