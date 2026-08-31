# Lightsail 배포 시 에너지 솔루션 브리핑 자동화

에너지 솔루션 브리핑은 `briefings` 테이블(SQLite)에 저장되고, Market Info > 에너지 솔루션 탭에서
목록으로 보여줍니다. 갱신 방법은 두 가지입니다: (1) cron으로 매일 자동 생성, (2) 관리자 대시보드의
"지금생성" 버튼으로 즉시 생성. 둘 다 같은 스크립트(`scripts/run-esmi-briefing.sh`)를 실행하며,
이 스크립트는 Claude Code CLI를 통해 실제 웹 리서치를 수행하므로 아래 설치가 반드시 필요합니다.

## 1. 서버에 Claude Code CLI 설치 및 로그인

```bash
npm install -g @anthropic-ai/claude-code
claude login   # 최초 1회, 대화형으로 인증 (또는 ANTHROPIC_API_KEY 환경변수 설정)
```

- `claude login`으로 로그인하면 해당 계정/구독으로 과금됩니다. API 키 방식(`ANTHROPIC_API_KEY`)을 쓰면 별도 API 과금입니다.
- Enterprise 플랜처럼 별도 API 키를 안 쓰는 경우, 대화형 로그인 대신 `claude setup-token`으로 헤드리스용
  장기 토큰을 발급받아 `CLAUDE_CODE_OAUTH_TOKEN` 환경변수로 설정하세요 (cron·서버 트리거는 브라우저
  로그인을 할 수 없으므로 이 방식이 필요합니다). 발급은 실제 터미널(pty)에서 브라우저 인증을 거쳐야 해서
  사람이 한 번은 직접 실행해야 합니다.
- 이 CLI가 설치·인증되어 있지 않으면 cron도, 관리자 대시보드의 "지금생성" 버튼도 실패합니다
  (실패 시 관리자 대시보드에 종료 코드/에러가 표시됩니다).
- 매번 웹서치 + 긴 리서치를 도는 작업이라 자동이든 수동이든 토큰 비용이 발생합니다. 부담되면 cron 주기를
  줄이거나(예: 평일만) "지금생성" 버튼 사용을 자제하세요.

## 1-1. 브리핑 이메일 발송 (선택)

`.env`에 `GMAIL_USER`, `GMAIL_APP_PASSWORD`(구글 계정 앱 비밀번호), `BRIEFING_EMAIL_TO`를 모두
설정하면, 새 브리핑이 생성될 때마다(`scripts/insert-briefing.js`가 실행될 때) 자동으로 해당 주소로
이메일이 발송됩니다. 셋 중 하나라도 비어 있으면 조용히 건너뜁니다(에러 아님, 로그에만 남음).

## 2. 실행 스크립트

`scripts/run-esmi-briefing.sh`가 이미 준비되어 있습니다. 서버에서:

```bash
chmod +x scripts/run-esmi-briefing.sh
```

이 스크립트는 esmi 리서치를 수행해 임시 파일에 HTML을 쓰고, `scripts/insert-briefing.js`로
`briefings` 테이블에 새 행을 추가합니다.

⚠️ 이 스크립트는 `--dangerously-skip-permissions`를 사용합니다. cron·서버 트리거 모두 대화형 승인을
받을 수 없기 때문에 불가피하지만, 이 옵션은 Claude가 어떤 툴 호출이든(웹검색, 파일쓰기 등) 사용자 확인
없이 바로 실행하게 만듭니다. 반드시 이 프로젝트 디렉터리 전용 계정/권한으로, 신뢰할 수 있는 서버에서만
사용하세요.

## 3. crontab 등록 (자동 생성)

```bash
crontab -e
```

아래 줄 추가 (매일 아침 7시, 서버 로컬 시간 기준):

```
0 7 * * * cd /home/ubuntu/powerhouse && ./scripts/run-esmi-briefing.sh >> /var/log/esmi-cron.log 2>&1
```

경로(`/home/ubuntu/powerhouse`)는 실제 배포 경로에 맞게 수정하세요.

## 4. 관리자 대시보드 "지금생성" (수동 생성)

관리자로 로그인 후 대시보드 "브리핑 관리" 탭, 또는 Market Info 페이지의 "⚡ 지금생성" 버튼을 누르면
서버가 `POST /api/admin/briefings/generate`를 받아 위 스크립트를 백그라운드로 실행합니다.
생성 중에는 버튼이 비활성화되고, 완료되면 목록에 자동 반영됩니다. 이 버튼은 관리자 로그인 상태에서만
보입니다(비용이 발생하는 기능이라 일반 방문자에게는 노출하지 않습니다).

## 5. 확인

`briefings` 테이블에 새 행이 쌓이는지, Market Info 페이지의 "최종 업데이트" 표시가 갱신되는지
확인합니다. cron 실패 시 `/var/log/esmi-cron.log`를, 수동 생성 실패 시 관리자 대시보드의
브리핑 관리 탭 상태 메시지를 확인하세요.

## Docker 배포 시 참고

이 프로젝트를 Docker로 배포한다면, `briefings` 테이블은 기존 `powerhouse-data` 볼륨(SQLite DB 파일)에
같이 저장되므로 별도 볼륨 마운트가 필요 없습니다. 다만 `scripts/run-esmi-briefing.sh`가 컨테이너
내부에서 `claude` CLI를 호출하려면, 컨테이너 이미지에도 Claude Code CLI를 설치하고 인증 정보를
전달해야 합니다 — 컨테이너 안에서 cron을 돌리는 대신, **호스트에서 cron으로 스크립트를 실행하고
컨테이너의 DB 볼륨 경로를 직접 바라보게 하는 방식**이 더 간단합니다.
