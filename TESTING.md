# 로컬 테스트 가이드

필요한 것:
1. Python 3.8+ 및 Node.js 16+
2. FFmpeg 설치
3. OpenAI API 키
4. 마이크 (음성 녹음 테스트용)

---

## 빠른 시작

### 1단계: 백엔드 서버 실행

```bash
# 터미널 1
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
copy env.example .env  # Windows
# cp env.example .env  # Mac/Linux
# .env 파일에 OPENAI_API_KEY 입력
python main.py
```

**예상 출력:**
```
INFO:     Started server process [xxxxx]
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 2단계: 프론트엔드 서버 실행

```bash
# 터미널 2 (새 터미널)
cd frontend
npm install
npm run dev
```

**예상 출력:**
```
  VITE v5.0.8  ready in xxx ms
  ?  Local:   http://localhost:3000/
```

### 3단계: 브라우저에서 테스트

1. 브라우저에서 `http://localhost:3000` 접속
2. "회의 시작" 버튼 클릭
3. 마이크 권한 허용
4. 음성 녹음 테스트


## ? 기능별 테스트 시나리오

### 테스트 1: 음성 전사 (STT)

**목적**: 음성을 텍스트로 변환하는 기능 테스트

**단계**:
1. 웹앱 접속 (`http://localhost:3000`)
2. "회의 시작" 버튼 클릭
3. 마이크 권한 허용
4. 간단한 문장 말하기 (예: "안녕하세요, 오늘 회의를 시작하겠습니다")
5. "회의 종료" 버튼 클릭
6. "전사하기" 버튼 클릭
7. 잠시 대기 (Whisper 처리 시간 소요)

**예상 결과**: 
- 말한 내용이 텍스트로 변환되어 표시됨
- 전사 시간: 약 2-5초 (10초 오디오 기준)

---

### 테스트 2: AI 요약 생성

**목적**: GPT-4를 사용한 회의록 요약 기능 테스트

**단계**:
1. 전사된 텍스트 확인
2. "요약 생성" 버튼 클릭
3. 잠시 대기 (GPT API 호출 시간 소요)

**예상 결과**:
- 핵심 요약 표시
- 주요 논의 사항 목록
- 결정 사항 목록
- 액션 아이템 목록

**예상 시간**: 
- 짧은 전사본 (100자): 약 3-5초
- 중간 전사본 (1000자): 약 5-10초
- 긴 전사본 (5000자): 약 10-20초

### 테스트 3: 회의록 저장 및 조회

**목적**: 파일 저장 방식으로 회의록이 저장되는지 확인

**단계**:
1. 요약 생성 완료 후
2. 상단 메뉴에서 "회의 아카이브" 클릭
3. 방금 생성한 회의록 확인

**예상 결과**:
- 회의록 목록에 표시됨
- `backend/meetings/` 디렉토리에 JSON 파일 생성
- 파일명 형식: `meeting_YYYYMMDD_HHMMSS_microseconds.json`

**파일 확인**:
```bash
# Windows
dir backend\meetings

# Mac/Linux
ls backend/meetings
```

---

### 테스트 4: 회의록 상세 조회

**목적**: 저장된 회의록의 상세 정보 확인

**단계**:
1. 회의 아카이브 페이지에서
2. 회의록 카드 클릭

**예상 결과**:
- 회의 제목 표시
- 요약 표시
- 주요 논의 사항 표시
- 결정 사항 표시
- 액션 아이템 표시
- 전체 전사본 표시

### 테스트 5: 회의록 내보내기

**목적**: PDF 및 Word 문서 내보내기 기능 테스트

**단계**:
1. 회의록 상세 페이지에서
2. "PDF 다운로드" 또는 "Word 다운로드" 버튼 클릭

**예상 결과**:
- 파일이 다운로드됨
- 다운로드된 파일을 열어 내용 확인

**파일 내용 확인**:
- 제목
- 요약
- 주요 논의 사항
- 결정 사항
- 액션 아이템
- 전체 전사본
