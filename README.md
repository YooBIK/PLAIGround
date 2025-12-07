# AI 회의록 자동 생성 프로젝트 기획안 
---

## 1. 프로젝트 개요  
---
**프로젝트 이름:AI Meeting Note (에이아이 미팅노트)**  

**결과물 형태: 웹앱 (AI 음성 인식 + 자동 요약 시스템)**

## 2. 프로젝트 목적  
---
**업무 효율화**
- 반복적이고 시간 소모적인 회의록 작성 업무 자동화  
**상세 목적 설명**  
- 회의 중 발언을 실시간으로 인식해 텍스트로 전환  
- 회의 종료 후 GPT가 핵심 내용을 자동 요약  


## 3. 주요 기능  

| 기능명 | 설명 |
|--------|------|
| **음성 → 텍스트 변환 (STT)** | Whisper 모델을 이용해 한국어/영어 음성 자동 전사 |
| **AI 자동 요약 기능** | GPT가 회의 내용 요약 및 액션 포인트 도출 |
| **회의록 형식 변환** | 텍스트, PDF, Word 등 다양한 포맷으로 자동 내보내기 |
| **다국어 지원 (옵션)** | 글로벌 회의에서도 자동 번역 및 요약 가능 |

---

## 4. 사용 기술  
---
| 구분 | 기술/도구 |
|------|-------------|
| **AI 모델** | OpenAI Whisper (음성 인식), GPT-4 (요약/분석) |
| **백엔드** | Python (FastAPI) |
| **프론트엔드** | React  |
| **데이터 저장** | JSON 파일 (DB 없음) |
| **배포 환경** | Vercel |
| **AI 생성물 형태** | 텍스트(요약문), 구조화된 회의록 |


## 5. 사용자 흐름 (User Flow)  

1. 사용자가 웹앱 접속
└ "회의 시작" 버튼 클릭

2. 실시간 음성 입력
└ Whisper가 음성을 문장 단위 텍스트로 변환
└ 화자별 색상으로 표시

3. 회의 종료 후 “요약 생성” 클릭
└ GPT-5가 자동으로 핵심 요약 생성
- 한 줄 요약
- 전체 요약
- 액션 아이템 정리

4. 결과 확인
└ 회의록 미리보기 + 편집 기능 제공

5. 내보내기 / 공유
└ PDF / Word 다운로드
└ Slack, Notion 자동 업로드




**시나리오 예시:**  
> PM이 회의 중 웹앱을 실행하고 “녹음 시작” 버튼을 누른다 →  
> Whisper가 실시간 자막처럼 발언을 기록 →  
> 회의 종료 후 GPT가 자동 요약을 생성 


## 6. AI 활용 내역  

| 구분 | 모델 | 활용 목적 | 프롬프트 예시 |
|------|------|------------|----------------|
| **Whisper** | OpenAI Whisper | 음성 → 텍스트 변환 (STT) | `"Transcribe this Korean meeting audio with speaker labels"` |
| **GPT-4** | 대규모 언어모델 (LLM) | 요약, 핵심 포인트 도출, 액션 아이템 분류 | `"Summarize the meeting transcript into 3 parts: summary, decisions, and next actions"` |


## 7. 프로젝트 구조

```
PLAIGround/
├── backend/
│   ├── main.py             # FastAPI 서버
│   ├── requirements.txt    # Python 의존성
│   ├── .env                # 환경 변수
│   └── meetings/           # 회의록 저장 디렉토리 (자동 생성)
│       └── meeting_*.json  # 회의록 JSON 파일들
├── frontend/
│   ├── src/
│   │   ├── components/      # React 컴포넌트
│   │   │   ├── MeetingRecorder.jsx
│   │   │   ├── MeetingHistory.jsx
│   │   │   └── MeetingDetail.jsx
│   │   ├── App.jsx          # 메인 앱 컴포넌트
│   │   └── main.jsx         # 진입점
│   ├── package.json         # Node.js 의존성
│   └── vite.config.js       # Vite 설정
├── README.md                # 프로젝트 문서
├── INSTALLATION.md          # 설치 가이드
└── TESTING.md               # 테스트 가이드
```

**데이터 저장 방식**: DB 없이 JSON 파일로 저장됩니다. 모든 회의록은 `backend/meetings/` 디렉토리에 JSON 형식으로 저장됩니다.