## Verification Criteria & Real Test Results (2026-09-28)
1. **Data Completeness**:
   - `RESTAURANTS_DATA.length === 66` (전수 등록 일치, PASS)
   - 조식 필터: 66곳 일치 (조식·중식 동일 66곳, PASS)
   - 중식 필터: 66곳 일치 (66곳 전수, PASS)
   - 석식 필터: 19곳 일치 (석식 지원 계약 19곳 한정, PASS)
   - 소문밥상(#11): 씨티스퀘어 편입 완료 (씨티스퀘어 9곳, PASS)
2. **Toolbar & Filter UX**:
   - 상단 4단 필터 라인(식사시간 탭, 카테고리 칩, 건물 모아보기, 테마 코스) 각 라인별 가로 스크롤 및 마우스 휠 스크롤 적용 (PASS)
   - 툴바 필터 칩 줄바꿈 방지(`flex-wrap: nowrap`, `overflow-x: auto`) 및 부드러운 터치 스크롤 (PASS)
3. **Interactive Elements**:
   - Leaflet 지도 마커 버블 클릭 시 사이드바 카드 스크롤 및 포커스 확인 (PASS)
   - 상세 보기 모달 창 정상 오픈 (메뉴, 실제 사진 갤러리 4장, 카카오맵 길찾기 링크, 네이버 플레이스 링크 확인, PASS)
   - 건물 허브 마커(씨티스퀘어 9곳, 대한상의 6곳, 퍼시픽타워 2곳) 정상 작동 (PASS)
   - JS 런타임 콘솔 에러: `0`건 (PASS)
