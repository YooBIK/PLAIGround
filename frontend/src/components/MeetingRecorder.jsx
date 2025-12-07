import React, { useState, useRef } from 'react'
import axios from 'axios'
import './MeetingRecorder.css'

const MeetingRecorder = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [summary, setSummary] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [meetingTitle, setMeetingTitle] = useState('')
  const [micError, setMicError] = useState(null)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const fileInputRef = useRef(null)

  const getErrorMessage = (error) => {
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      return {
        title: '마이크 권한이 거부되었습니다',
        message: '브라우저 설정에서 마이크 권한을 허용해주세요.',
        showFileUpload: true
      }
    } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      return {
        title: '마이크를 찾을 수 없습니다',
        message: '마이크가 연결되어 있는지 확인해주세요. 또는 오디오 파일을 업로드할 수 있습니다.',
        showFileUpload: true
      }
    } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      return {
        title: '마이크에 접근할 수 없습니다',
        message: '다른 프로그램이 마이크를 사용 중일 수 있습니다. 또는 오디오 파일을 업로드할 수 있습니다.',
        showFileUpload: true
      }
    } else {
      return {
        title: '마이크 오류가 발생했습니다',
        message: `오류: ${error.message || '알 수 없는 오류'}. 오디오 파일을 업로드할 수 있습니다.`,
        showFileUpload: true
      }
    }
  }

  const startRecording = async () => {
    try {
      setMicError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        setAudioBlob(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setShowFileUpload(false)
    } catch (error) {
      console.error('녹음 시작 오류:', error)
      const errorInfo = getErrorMessage(error)
      setMicError(errorInfo)
      setShowFileUpload(errorInfo.showFileUpload)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const transcribeAudio = async () => {
    if (!audioBlob) {
      alert('녹음된 오디오가 없습니다.')
      return
    }

    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append('file', audioBlob, 'recording.wav')
      // 전사 결과를 저장하도록 요청
      formData.append('save_transcript', 'true')

      const response = await axios.post('http://localhost:8000/api/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          save_transcript: true  // 전사 결과 저장
        }
      })

      setTranscript(response.data.transcript)
      
      // 전사 결과가 저장되었음을 알림
      if (response.data.meeting_id) {
        console.log('전사 결과가 저장되었습니다. ID:', response.data.meeting_id)
      }
    } catch (error) {
      console.error('전사 오류:', error)
      alert('전사 중 오류가 발생했습니다: ' + (error.response?.data?.detail || error.message))
    } finally {
      setIsProcessing(false)
    }
  }

  const generateSummary = async () => {
    if (!transcript) {
      alert('전사된 텍스트가 없습니다.')
      return
    }

    setIsProcessing(true)
    try {
      const response = await axios.post('http://localhost:8000/api/summarize', {
        transcript: transcript,
        title: meetingTitle || `회의 ${new Date().toLocaleString('ko-KR')}`
      })

      setSummary(response.data)
    } catch (error) {
      console.error('요약 오류:', error)
      alert('요약 생성 중 오류가 발생했습니다.')
    } finally {
      setIsProcessing(false)
    }
  }

  const resetMeeting = () => {
    setTranscript('')
    setSummary(null)
    setAudioBlob(null)
    setMeetingTitle('')
    setIsRecording(false)
    setMicError(null)
    setShowFileUpload(false)
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // 오디오 파일인지 확인
    if (!file.type.startsWith('audio/')) {
      alert('오디오 파일만 업로드할 수 있습니다.')
      return
    }

    setMicError(null)
    setShowFileUpload(false)
    setAudioBlob(file)
    
    // 자동으로 전사 시작
    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post('http://localhost:8000/api/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          save_transcript: true  // 전사 결과 저장
        }
      })

      setTranscript(response.data.transcript)
      
      // 전사 결과가 저장되었음을 알림
      if (response.data.meeting_id) {
        console.log('전사 결과가 저장되었습니다. ID:', response.data.meeting_id)
      }
    } catch (error) {
      console.error('전사 오류:', error)
      alert('전사 중 오류가 발생했습니다.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="meeting-recorder">
      <div className="recorder-container">
        <h1>회의 시작하기</h1>
        
        <div className="meeting-title-input">
          <label>회의 제목 (선택사항)</label>
          <input
            type="text"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            placeholder="예: 프로젝트 기획 회의"
            disabled={isRecording}
          />
        </div>

        <div className="recording-controls">
          {!isRecording ? (
            <button className="btn btn-primary" onClick={startRecording}>
              🎙️ 회의 시작
            </button>
          ) : (
            <button className="btn btn-stop" onClick={stopRecording}>
              ⏹️ 회의 종료
            </button>
          )}
        </div>

        {micError && (
          <div className="error-message">
            <div className="error-title">⚠️ {micError.title}</div>
            <div className="error-text">{micError.message}</div>
            {micError.showFileUpload && (
              <div className="error-solution">
                <p><strong>해결 방법:</strong></p>
                <ol>
                  <li>브라우저 주소창 왼쪽의 자물쇠 아이콘 클릭</li>
                  <li>마이크 권한을 "허용"으로 변경</li>
                  <li>페이지 새로고침 후 다시 시도</li>
                </ol>
                <p className="alternative-text">또는 아래 버튼으로 오디오 파일을 업로드할 수 있습니다.</p>
              </div>
            )}
          </div>
        )}

        {showFileUpload && !audioBlob && (
          <div className="file-upload-section">
            <input
              type="file"
              ref={fileInputRef}
              accept="audio/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <button 
              className="btn btn-secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              📁 오디오 파일 업로드
            </button>
            <p className="upload-hint">지원 형식: WAV, MP3, M4A 등</p>
          </div>
        )}

        {isRecording && (
          <div className="recording-indicator">
            <span className="pulse"></span>
            녹음 중...
          </div>
        )}

        {audioBlob && !transcript && (
          <div className="action-section">
            <button 
              className="btn btn-secondary" 
              onClick={transcribeAudio}
              disabled={isProcessing}
            >
              {isProcessing ? '전사 중...' : '📝 전사하기'}
            </button>
          </div>
        )}

        {transcript && (
          <div className="transcript-section">
            <h2>전사본</h2>
            <div className="transcript-box">
              {transcript}
            </div>
            {!summary && (
              <button 
                className="btn btn-primary" 
                onClick={generateSummary}
                disabled={isProcessing}
              >
                {isProcessing ? '요약 생성 중...' : '✨ 요약 생성'}
              </button>
            )}
          </div>
        )}

        {summary && (
          <div className="summary-section">
            <h2>회의 요약</h2>
            <div className="summary-card">
              <h3>핵심 요약</h3>
              <p>{summary.summary}</p>
            </div>

            {summary.key_points && summary.key_points.length > 0 && (
              <div className="summary-card">
                <h3>주요 논의 사항</h3>
                <ul>
                  {summary.key_points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {summary.decisions && summary.decisions.length > 0 && (
              <div className="summary-card">
                <h3>결정 사항</h3>
                <ul>
                  {summary.decisions.map((decision, idx) => (
                    <li key={idx}>{decision}</li>
                  ))}
                </ul>
              </div>
            )}

            {summary.action_items && summary.action_items.length > 0 && (
              <div className="summary-card">
                <h3>액션 아이템</h3>
                <div className="action-items">
                  {summary.action_items.map((item, idx) => (
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

            <div className="action-buttons">
              <a
                href={`http://localhost:8000/api/meetings/${summary.id}/export/pdf`}
                className="btn btn-secondary"
                download
              >
                📄 PDF 다운로드
              </a>
              <a
                href={`http://localhost:8000/api/meetings/${summary.id}/export/docx`}
                className="btn btn-secondary"
                download
              >
                📝 Word 다운로드
              </a>
              <button className="btn btn-outline" onClick={resetMeeting}>
                새 회의 시작
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MeetingRecorder
