# 배포 가이드 — 상시 구동 서버 (Lightsail / Oracle Cloud Always Free 등)

이 앱은 Node.js 서버 하나가 계속 떠 있어야 하는 구조입니다. AWS Lightsail든 Oracle Cloud
Always Free(Ampere A1)든, "24/7 켜져 있는 Ubuntu 인스턴스"라면 동일하게 적용됩니다.

## 1. 서버 준비

```bash
git clone https://github.com/projectsunjo/powerhouse.git
cd powerhouse
npm install
cp .env.example .env   # 값 채워넣기 (아래 참고)
```

`.env`에 최소한 다음을 채워야 합니다: `ADMIN_PASSWORD`, `JWT_SECRET`, `IP_HASH_SALT`.
`GMAIL_USER`/`GMAIL_APP_PASSWORD`는 이메일 발송용(선택), `CLAUDE_CODE_OAUTH_TOKEN`은
에너지 솔루션 브리핑 자동 생성용(아래 2번 참고, 이것도 선택이지만 없으면 브리핑 기능은 동작 안 함).

## 2. 브리핑 자동 생성을 쓰려면 — Claude Code CLI 설치

에너지 솔루션 브리핑(Market Info 탭)은 실제 웹서치를 수행하는 AI 리서치라서, 이 기능을 쓰려면
서버에 Claude Code CLI가 설치·인증되어 있어야 합니다. 안 쓸 거면 이 섹션은 건너뛰어도 되고,
브리핑 관련 기능만 동작하지 않습니다(나머지 게시판 기능은 무관하게 정상 동작).

```bash
npm install -g @anthropic-ai/claude-code
claude setup-token   # 사람이 직접 실행 — 브라우저 인증 후 토큰 발급
```

- `setup-token`은 실제 터미널(pty)에서 브라우저 인증을 거쳐야 해서 자동화할 수 없고, 배포할 때
  한 번은 SSH로 접속해 사람이 직접 실행해야 합니다. 발급된 토큰을 `.env`의
  `CLAUDE_CODE_OAUTH_TOKEN`에 넣으세요.
- 이 CLI가 설치·인증되어 있지 않으면 예약 생성도, 관리자 대시보드의 "지금생성" 버튼도 실패합니다
  (실패 시 브리핑 관리 탭 로그에 사유가 표시됩니다).
- 매번 웹서치 + 긴 리서치를 도는 작업이라 자동이든 수동이든 토큰 비용이 발생합니다. 부담되면
  관리자 대시보드에서 생성 주기를 늘리거나 자동 생성을 끄고 수동으로만 쓰세요.
- 회사 네트워크 등 TLS 인터셉션 방화벽 뒤에서 돌린다면 `NODE_EXTRA_CA_CERTS`로 해당 네트워크의
  루트 CA 인증서를 지정해야 `claude` CLI가 SSL 인증서 오류 없이 동작합니다(일반 클라우드 서버라면
  보통 필요 없습니다).

## 3. 생성 스케줄 — 앱 안에서 관리자가 직접 설정

이제 OS 레벨 cron이 아니라 **앱 자체 스케줄러**(`server/scheduler.js`)가 매분 체크하며 돕니다.
관리자 대시보드 → "브리핑 관리" 탭에서:

- 자동 생성 사용 여부
- 시작 시각 (기본 08시)
- 생성 주기 (6/8/12/24시간, 기본 24시간마다)
- 수신 이메일 목록 (여러 개는 `;` 로 구분)
- 메일 제목 양식 (`{날짜}` 토큰이 생성일로 치환됨)

을 저장하면 바로 반영됩니다. 서버 프로세스가 계속 떠 있기만 하면 되고, 별도 crontab 설정은
필요 없습니다.

같은 화면 또는 Market Info 페이지의 "⚡ 지금생성" 버튼으로 즉시 한 번 생성할 수도 있습니다
(관리자 로그인 상태에서만 노출 — 비용이 발생하는 기능이라 일반 방문자에게는 숨겨져 있습니다).

## 4. 서버를 계속 띄워두기 (프로세스 매니저)

로컬 개발 중엔 `nodemon`으로 띄우지만, 실서버에서는 재부팅/충돌 후에도 자동으로 다시 뜨도록
PM2나 systemd를 권장합니다. 예 (PM2):

```bash
npm install -g pm2
pm2 start server/index.js --name powerhouse
pm2 save
pm2 startup   # 부팅 시 자동 시작 등록, 출력된 명령을 그대로 한 번 더 실행
```

## 5. 확인

관리자 대시보드 "브리핑 관리" 탭의 실행 로그에 `HH:MM 시작 · HH:MM 생성완료 · ...이메일 발송 완료`
형태로 한 줄씩 쌓이는지 확인합니다. 실패한 실행은 사유(타임아웃, 종료 코드 등)가 함께 표시됩니다.

## Docker로 배포한다면

`briefings`/`briefing_runs`/`settings` 테이블은 모두 기존 `powerhouse-data` 볼륨(SQLite DB
파일) 안에 저장되므로 추가 볼륨 마운트는 필요 없습니다. 다만 컨테이너 이미지(`node:20-slim`
베이스)에는 Claude Code CLI가 없으므로, 브리핑 자동 생성 기능을 쓰려면 Dockerfile에
`npm install -g @anthropic-ai/claude-code` 설치 단계를 추가하고 `CLAUDE_CODE_OAUTH_TOKEN`을
컨테이너 환경변수로 전달해야 합니다.
