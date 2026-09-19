# Deep Init Summary: powerhouse

- **Initialized**: 2026-09-19
- **Profile**: Balanced / High-Autonomy
- **Status**: Active & Verified

## 1. Architecture Boundaries & Entry Points
- **Web Frontend**:
  - `public/lunch-guide.html`: 식당 가이드 메인 인터페이스 (Leaflet 맵 + 검색/필터 사이드바 + 건물 퀵바)
  - `public/js/lunch-data.js`: 66개 가맹점 마스터 데이터 (이름, 카테고리, 좌표, 식사별 가능 여부, 실제 이미지 목록)
  - `public/js/lunch-guide.js`: Leaflet 지도 엔진, 마커 그룹화/방사형 오프셋, 검색, 필터, 모달 제어
  - `public/css/lunch-guide.css`: 테마, 반응형 레이아웃, 커스텀 마커 핀 스타일
- **Backend / API**:
  - `api/`: Vercel Serverless Functions (`api/lunch.js`, `api/proxy.js`)
  - `server/`: Node.js Express 백엔드 (로컬/서버용)

## 2. Guardrails
- **Zero-API Constraint**: 외부 유료 지도 API를 직접 호출하지 않고 Leaflet OSM 타일 + 카카오 길찾기 딥링크를 유지.
- **Data Integrity Constraint**: 사내 공지 66곳 목록 100% 보존.
- **Process Cleanup**: 백그라운드 테스트 서버 프로세스는 검증 후 자동 정리.
