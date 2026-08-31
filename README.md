# PowerHouse 익명게시판

가볍게 로컬에서 개발하고 그대로 AWS Lightsail에 올릴 수 있도록 만든 익명 게시판입니다.
Node.js + Express + SQLite(better-sqlite3)만 사용해서 별도 DB 서버 없이 동작하고,
프론트엔드는 빌드 과정 없는 순수 HTML/CSS/JS로 구성했습니다.

## 주요 기능

**일반 사용자**
- 게시글 목록 (검색, 페이지네이션, 공지 고정 표시)
- 글쓰기 / 조회수 / 추천(IP 기준 중복 방지) / 댓글
- 글·댓글은 비밀번호로만 본인 수정·삭제 가능 (로그인 없는 익명 게시판)
- 게시글·댓글 신고 기능
- 금지어 자동 차단 (관리자가 등록)
- 반응형 + 라이트/다크 모드 자동 대응 UI

**관리자 (`/admin`)**
- 별도 로그인 (환경변수 비밀번호 + JWT httpOnly 쿠키)
- 대시보드 통계 (전체 글/댓글 수, 오늘 작성 글, 대기중 신고 수)
- 게시글 관리: 검색, 공지 설정/해제, 숨김 처리, 강제 삭제
- 댓글 관리: 강제 삭제
- 신고 관리: 대기중/처리완료 목록, 처리 완료 처리
- 금지어 관리: 추가/삭제

## 로컬 개발 (isolated, localhost)

```bash
npm install
cp .env.example .env
# .env 안의 ADMIN_PASSWORD, JWT_SECRET, IP_HASH_SALT 값을 변경하세요
npm run dev
```

브라우저에서 `http://localhost:3000` 접속, 관리자는 `http://localhost:3000/admin`.

DB 파일은 `data/powerhouse.db` 에 생성됩니다 (git에는 포함되지 않음).

## Docker로 격리 실행 (로컬 검증 & 배포 동일 환경)

```bash
cp .env.example .env
# .env 값 수정 후
docker compose up -d --build
```

`http://localhost:3000` 으로 접속해 확인합니다. 데이터는 named volume(`powerhouse-data`)에 유지되어
컨테이너를 내렸다 올려도 사라지지 않습니다.

## AWS Lightsail 배포

가장 간단한 방법은 Lightsail 인스턴스에 Docker를 올려 위 `docker-compose.yml`을 그대로 쓰는 것입니다.

1. **인스턴스 생성**: Lightsail 콘솔 → Instances → Create instance → Linux/Unix → OS Only (Ubuntu 22.04) →
   가장 저렴한 플랜(512MB~1GB)으로도 충분합니다.
2. **고정 IP 연결**: Networking 탭에서 Static IP를 생성해 인스턴스에 연결합니다.
3. **방화벽 설정**: 인스턴스의 Networking 탭에서 HTTP(80), HTTPS(443) 규칙을 추가합니다. (앱 포트 3000은 외부에 열지 않고 Nginx를 통해서만 노출하는 것을 권장합니다.)
4. **SSH 접속 후 Docker 설치**
   ```bash
   sudo apt-get update
   sudo apt-get install -y docker.io docker-compose-plugin
   sudo usermod -aG docker $USER
   ```
5. **코드 업로드**: `scp` 또는 `git clone`으로 프로젝트를 인스턴스에 올립니다.
6. **환경변수 설정 후 실행**
   ```bash
   cp .env.example .env
   nano .env   # ADMIN_PASSWORD, JWT_SECRET, IP_HASH_SALT 를 강력한 값으로 변경
   docker compose up -d --build
   ```
7. **Nginx 리버스 프록시 + HTTPS (권장)**
   ```bash
   sudo apt-get install -y nginx certbot python3-certbot-nginx
   ```
   `/etc/nginx/sites-available/powerhouse` 에 아래 내용을 작성:
   ```nginx
   server {
     listen 80;
     server_name your-domain.com;
     location / {
       proxy_pass http://127.0.0.1:3000;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
     }
   }
   ```
   ```bash
   sudo ln -s /etc/nginx/sites-available/powerhouse /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   sudo certbot --nginx -d your-domain.com
   ```
8. 이후 코드 업데이트 시: `git pull && docker compose up -d --build`

> 도메인이 없다면 Nginx/Certbot 단계는 생략하고 Lightsail 방화벽에서 3000 포트만 열어
> `http://고정IP:3000` 으로 바로 접속해도 됩니다 (HTTPS 없이 테스트용으로만 권장).

## 환경변수

| 변수 | 설명 |
|---|---|
| `PORT` | 서버 포트 (기본 3000) |
| `ADMIN_PASSWORD` | 관리자 로그인 비밀번호 |
| `JWT_SECRET` | 관리자 세션 토큰 서명용 비밀키 |
| `IP_HASH_SALT` | 추천(좋아요) 중복 방지용 IP 해시 솔트 |
| `DB_PATH` | SQLite 파일 경로 |

## 디렉터리 구조

```
server/         Express API 서버
  routes/       posts, comments, admin API
  middleware/   관리자 인증
  utils/        비밀번호 해시, IP 해시, 금지어 검사 등
  db.js         SQLite 스키마 초기화
public/         일반 사용자 프론트엔드 (정적 파일)
admin/          관리자 프론트엔드 (정적 파일, /admin 경로로 서빙)
data/           SQLite DB 파일 (gitignore)
```
