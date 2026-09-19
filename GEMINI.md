# Powerhouse Project - Oh My Gemini / Antigravity (OmA) Context

이 프로젝트는 **Powerhouse 사내 복지 및 식음료/식당 가이드 시스템**입니다.
Oh My Antigravity (OmA) 멀티 에이전트 자율 개발 및 자동화 체계가 적용되어 있습니다.

## 1. OmA Core Integration
- **State & Project Map**: `.omg/state/` 참조
- **Durable Memory**: `MEMORY.md` 및 `.omg/memory/` 참조
- **Custom Rules**: `.omg/rules/` 참조
- **Agent Roles**:
  - `oma-director` / `oma-architect`: 시스템 설계 및 아키텍처 결정
  - `oma-executor`: 프론트엔드 및 데이터 파이프라인 구현
  - `oma-verifier`: 브라우저 UI/E2E 검증 및 데이터 무결성 검사
  - `oma-debugger`: 런타임 에러 추적 및 자가 치유(Self-Healing) 루프

## 2. 프로젝트 핵심 제약 & 가이드라인
1. **Zero-API 원칙 (100% 무료/정적)**:
   - 외부 상용 지도 유료 API 키(네이버/카카오/구글 지도 API 키) 결제 없이 완전 정적 구동.
   - 지도는 Leaflet (OpenStreetMap 타일) + 카카오맵 길찾기 웹 딥링크 연동.
2. **식당 가이드 데이터 무결성**:
   - 사내 공지사항 기준 **총 66개 가맹점 전수 등록 유지**.
   - 조식 가능: 19곳, 중식 가능: 66곳 (전체), 석식 가능: 54곳.
   - 복합 건물(씨티스퀘어 8곳, 대한상의 6곳, 서소문로134-6 3곳 등)은 건물 허브 마커 및 방사형 핀 전개 인터랙션 적용.
3. **좌표 실측 보정**:
   - 실측 GPS 좌표(위도/경도)를 기준으로 하며, Leaflet CSS `transform: translate(-50%, -100%)`로 마커 꼬리가 실제 위치에 1px 오차 없이 일치해야 함.
4. **프로세스 자동 정리**:
   - 개발 및 검증용 임시 서버/스크립트는 작업 완료 시 자동 종료 및 정리.
