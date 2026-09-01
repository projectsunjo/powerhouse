# 배포 가이드 — Vercel + Supabase + GitHub Actions

VM/SSH 없이 전부 웹 대시보드와 GitHub 연동으로 배포합니다.

- **Vercel**: 웹 앱 호스팅 (서버리스)
- **Supabase**: Postgres DB (게시글/댓글/브리핑 전부 저장)
- **GitHub Actions**: 에너지 솔루션 브리핑 생성(웹서치, 9~10분 걸림)을 예약/수동 실행

## 1. Supabase

1. 프로젝트 생성 (이미 있다면 재사용)
2. **Project Settings → Database → Connection string → Direct 탭 → Transaction pooler(포트 6543)** 선택 후 URI 복사, 비밀번호 채우기
3. 이 URI를 `DATABASE_URL`로 사용 (아래 2, 3번에 각각 등록)

테이블은 앱이 처음 뜰 때 자동으로 생성됩니다 (`server/db.js`의 `CREATE TABLE IF NOT EXISTS`).

## 2. Vercel

1. [vercel.com](https://vercel.com) 대시보드 → **Add New → Project** → 이 GitHub 저장소(`projectsunjo/powerhouse`) 선택 → Import
2. Framework Preset은 자동 감지 안 될 수 있음 — **Other**로 두고 그대로 Deploy 진행 (설정은 `vercel.json`에 이미 있음)
3. **Project Settings → Environment Variables**에 아래 등록 (Production/Preview 둘 다 체크):

| 변수 | 값 |
|---|---|
| `DATABASE_URL` | 1번의 Supabase URI |
| `ADMIN_PASSWORD` | 관리자 비밀번호 (직접 정하기) |
| `JWT_SECRET` | 임의의 긴 랜덤 문자열 |
| `IP_HASH_SALT` | 임의의 랜덤 문자열 |
| `GMAIL_USER` | 브리핑 발송용 Gmail (선택) |
| `GMAIL_APP_PASSWORD` | Gmail 앱 비밀번호 (선택) |
| `GITHUB_TOKEN` | 아래 4번에서 만들 PAT |
| `GITHUB_REPO` | `projectsunjo/powerhouse` |

4. 저장 후 **Deployments → 최신 배포 → Redeploy** (환경변수는 재배포해야 반영됨)

## 3. GitHub Actions Secrets

저장소 → **Settings → Secrets and variables → Actions → New repository secret**로 아래 등록:

| 이름 | 값 |
|---|---|
| `DATABASE_URL` | Supabase URI (Vercel과 동일) |
| `GMAIL_USER` | (선택) |
| `GMAIL_APP_PASSWORD` | (선택) |
| `CLAUDE_CODE_OAUTH_TOKEN` | `claude setup-token`으로 발급한 토큰 |

`.github/workflows/generate-briefing.yml`이 매시간 실행되며, 관리자 대시보드에서 설정한 주기/시각에 따라 실제 생성 여부를 스스로 판단합니다 (`scripts/generate-briefing.js`).

## 4. "지금생성" 버튼용 GitHub Personal Access Token

Vercel의 `GITHUB_TOKEN`에 쓸 토큰입니다 (3번의 Actions Secret과는 별개 — 이건 Vercel이 GitHub API를 호출해서 워크플로를 "트리거"하는 용도).

1. GitHub → **Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. **Generate new token** → `repo` 권한 체크 (workflow 트리거 포함) → 생성
3. 이 값을 Vercel의 `GITHUB_TOKEN` 환경변수에 등록 (위 2번 표)

⚠️ 예전에 채팅에 노출됐던 push용 토큰은 재사용하지 말고, 이번에 새로 하나 발급하세요.

## 5. 확인

- Vercel이 준 URL(`https://xxx.vercel.app`)로 접속 → 게시판 목록이 뜨는지 확인
- 관리자 로그인 → "브리핑 관리" 탭 → "⚡ 지금생성" 클릭 → GitHub 저장소의 **Actions** 탭에서 워크플로가 실행되는지 확인 (9~10분 후 완료)
- 완료되면 Market Info 페이지에 새 브리핑이 뜨고, 관리자 대시보드 실행 로그에도 한 줄 추가됨

## 로컬 개발

로컬에서 `npm run dev`로 띄우면 같은 Supabase DB에 연결됩니다 (별도 로컬 DB 없음). `.env`에 `DATABASE_URL` 등을 설정하세요 (`.env.example` 참고).
