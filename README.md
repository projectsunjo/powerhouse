# PowerHouse 익명게시판

Node.js + Express + Postgres(Supabase)로 만든 익명 게시판. 프론트엔드는 빌드 과정 없는
순수 HTML/CSS/JS로 구성했고, Vercel(서버리스) + Supabase(DB) + GitHub Actions(예약 작업)
조합으로 배포합니다.

## 주요 기능

**일반 사용자**
- 게시글 목록 (검색, 페이지네이션, 최신순/Best글, 공지 고정 표시)
- 글쓰기 / 조회수 / 추천(IP 기준 중복 방지) / 댓글·대댓글(1단계까지)
- 글·댓글은 비밀번호로만 본인 수정·삭제 가능 (로그인 없는 익명 게시판)
- 게시글·댓글 신고 기능
- 금지어 자동 차단 (관리자가 등록)
- 파워 테마 랜덤 닉네임 자동 생성
- Market Info: 에너지 솔루션(SOFC/반도체 전력/데이터센터 등) 브리핑을 예약/수동 생성해 목록으로 제공

**관리자 (`/admin`)**
- 별도 로그인 (환경변수 비밀번호 + JWT httpOnly 쿠키)
- 대시보드 통계, 게시글/댓글 관리, 신고 처리, 금지어 관리
- 브리핑 관리: 생성 주기/시각/수신 이메일/메일 제목 설정, "지금생성" 수동 실행, 실행 로그

## 로컬 개발

```bash
npm install
cp .env.example .env
# DATABASE_URL(Supabase), ADMIN_PASSWORD, JWT_SECRET, IP_HASH_SALT 값을 채우세요
npm run dev
```

브라우저에서 `http://localhost:3000` 접속, 관리자는 `http://localhost:3000/admin`.
로컬 전용 DB는 없고 `.env`에 설정한 Supabase Postgres에 그대로 연결됩니다 — 테이블은
첫 실행 시 자동 생성됩니다.

## 배포

`DEPLOY.md` 참고 — Vercel(웹 앱) + Supabase(DB) + GitHub Actions(브리핑 생성 스케줄) 조합입니다.
서버 SSH 관리가 필요 없습니다.

## 환경변수

| 변수 | 설명 |
|---|---|
| `PORT` | 로컬 개발용 포트 (Vercel에서는 무시됨) |
| `DATABASE_URL` | Supabase Postgres 연결 문자열 |
| `ADMIN_PASSWORD` | 관리자 로그인 비밀번호 |
| `JWT_SECRET` | 관리자 세션 토큰 서명용 비밀키 |
| `IP_HASH_SALT` | 추천(좋아요) 중복 방지용 IP 해시 솔트 |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` | 브리핑 이메일 발송용 (선택) |
| `GITHUB_TOKEN` / `GITHUB_REPO` | "지금생성" 버튼이 GitHub Actions를 트리거하는 데 필요 |
| `CLAUDE_CODE_OAUTH_TOKEN` | GitHub Actions에서 브리핑 생성 시 필요 (Actions Secret) |

## 디렉터리 구조

```
server/         Express API 서버 (api/index.js를 통해 Vercel 서버리스 함수로 노출)
  routes/       posts, comments, admin, market-info API
  middleware/   관리자 인증
  utils/        비밀번호 해시, IP 해시, 금지어 검사, 메일 발송, 설정
  db.js         Postgres 스키마 초기화
scripts/        generate-briefing.js (GitHub Actions에서 실행)
.github/workflows/  브리핑 생성 예약 작업
public/         일반 사용자 프론트엔드 (정적 파일)
admin/          관리자 프론트엔드 (정적 파일, /admin 경로로 서빙)
.claude/skills/esmi/  브리핑 생성에 쓰이는 리서치 스킬 정의
```
