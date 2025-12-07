# 설치 가이드

## ? 목차
1. [사전 요구사항](#사전-요구사항)
2. [시스템 도구 설치](#시스템-도구-설치)
3. [백엔드 설치](#백엔드-설치)
4. [프론트엔드 설치](#프론트엔드-설치)
5. [패키지 상세 설명](#패키지-상세-설명)

---

## 사전 요구사항

- **Python**: 3.8 이상
- **Node.js**: 16 이상
- **OpenAI API 키**: gpt-3.5-turbo 요약 기능용
- **FFmpeg**: Whisper 음성 인식용 (필수)

---

## 시스템 도구 설치

### 1. FFmpeg 설치 (필수)

Whisper가 오디오 파일을 처리하기 위해 FFmpeg가 필요합니다.

#### Windows
```bash
# 방법 1: winget 사용
winget install ffmpeg

# 방법 2: Chocolatey 사용
choco install ffmpeg

# 방법 3: 수동 설치
# https://ffmpeg.org/download.html 에서 다운로드
# 압축 해제 후 PATH 환경 변수에 추가
```

#### Mac
```bash
brew install ffmpeg
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

#### 설치 확인
```bash
ffmpeg -version
```

---

## 백엔드 설치

### 1. Python 가상환경 생성

```bash
cd backend

# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

### 2. Python 패키지 설치

```bash
pip install -r requirements.txt
```

**설치되는 주요 패키지:**
- `fastapi` - 웹 프레임워크
- `uvicorn` - ASGI 서버
- `openai` - OpenAI API 클라이언트
- `openai-whisper` - 음성 인식 모델
- `python-docx` - Word 문서 생성
- `reportlab` - PDF 문서 생성

### 3. 환경 변수 설정

```bash
# Windows
copy env.example .env

# Mac/Linux
cp env.example .env
```

`.env` 파일을 열어 `OPENAI_API_KEY`에 본인의 API 키를 입력:

```
OPENAI_API_KEY=sk-your-api-key-here
```

### 4. 서버 실행

```bash
python main.py
```

또는

```bash
uvicorn main:app --reload
```

서버는 `http://localhost:8000`에서 실행됩니다.

---

## 프론트엔드 설치

### 1. Node.js 설치 확인

```bash
node --version
npm --version
```

Node.js가 설치되어 있지 않다면: https://nodejs.org/

### 2. 의존성 설치

```bash
cd frontend
npm install
```

**설치되는 주요 패키지:**
- `react` - UI 라이브러리
- `react-dom` - React DOM 렌더링
- `react-router-dom` - 라우팅
- `axios` - HTTP 클라이언트
- `vite` - 빌드 도구

### 3. 개발 서버 실행

```bash
npm run dev
```

프론트엔드는 `http://localhost:3000`에서 실행됩니다.

---

## 패키지 상세 설명

### 백엔드 패키지

#### 필수 패키지

| 패키지 | 버전 | 용도 |
|--------|------|------|
| **fastapi** | 0.104.1 | 웹 프레임워크, RESTful API 서버 구축 |
| **uvicorn** | 0.24.0 | ASGI 서버, FastAPI 실행 |
| **python-multipart** | 0.0.6 | 파일 업로드 처리 |
| **openai** | 1.3.5 | OpenAI API 클라이언트 (gpt-3.5-turbo) |
| **openai-whisper** | 20231117 | 음성 인식 모델 |
| **pydub** | 0.25.1 | 오디오 파일 처리 |
| **python-docx** | 1.1.0 | Word 문서 생성 |
| **reportlab** | 4.0.7 | PDF 문서 생성 |
| **pydantic** | 2.5.0 | 데이터 검증 |
| **python-dotenv** | 1.0.0 | 환경 변수 관리 |

#### 패키지별 상세 설명

**FastAPI**
- 현대적인 Python 웹 프레임워크
- 비동기 처리 지원
- 자동 API 문서 생성

**OpenAI Whisper**
- 처음 실행 시 모델 다운로드 (약 150MB)
- 기본 모델: `base` (더 정확한 모델: `medium`, `large`)
- 한국어/영어 지원

**OpenAI (GPT-3.5-turbo)**
- 회의록 요약 생성
- API 키 필요 (유료 서비스)
- 사용량에 따라 비용 발생

### 프론트엔드 패키지

#### 필수 패키지

| 패키지 | 버전 | 용도 |
|--------|------|------|
| **react** | ^18.2.0 | UI 라이브러리 |
| **react-dom** | ^18.2.0 | React DOM 렌더링 |
| **react-router-dom** | ^6.20.1 | 클라이언트 사이드 라우팅 |
| **axios** | ^1.6.2 | HTTP 요청 처리 |
| **vite** | ^5.0.8 | 빌드 도구 및 개발 서버 |

#### 개발 의존성

| 패키지 | 버전 | 용도 |
|--------|------|------|
| **@vitejs/plugin-react** | ^4.2.1 | Vite React 플러그인 |
| **@types/react** | ^18.2.43 | TypeScript 타입 정의 |
| **@types/react-dom** | ^18.2.17 | TypeScript 타입 정의 |

---

## 설치 시간 예상

- **FFmpeg**: 5-10분 (인터넷 속도에 따라 다름)
- **Python 패키지**: 5-15분 (Whisper 모델 다운로드 포함)
- **Node.js 패키지**: 2-5분

**총 예상 시간**: 약 15-30분

---

## 문제 해결

### FFmpeg 오류
```
RuntimeError: Failed to load audio file
```
**해결**: FFmpeg 설치 및 PATH 확인

### Whisper 모델 다운로드 오류
```
FileNotFoundError: [Errno 2] No such file or directory
```
**해결**: 인터넷 연결 확인, 방화벽 설정 확인

### OpenAI API 오류
```
openai.error.AuthenticationError: Invalid API key
```
**해결**: `.env` 파일의 `OPENAI_API_KEY` 확인

### 포트 충돌
```
ERROR: [Errno 48] Address already in use
```
**해결**: 
- Windows: `netstat -ano | findstr :8000` 후 프로세스 종료
- Mac/Linux: `lsof -i :8000` 후 프로세스 종료

---

## 최소 시스템 요구사항

- **RAM**: 최소 4GB (Whisper 모델 로드용)
- **디스크 공간**: 최소 1GB (모델 및 패키지용)
- **인터넷 연결**: 초기 설치 및 API 호출용


