// Lunch Guide Interactive Application (Leaflet Map + Static 65 Restaurants Data)
let map = null;
let currentMarkers = {};
let buildingHubMarkers = {};
let leaderLines = [];
let hqMarker = null;
let activeMeal = "all";       // all, breakfast, lunch, dinner
let activeCategory = "전체";
let activeBuildingFilter = null; // null or buildingCluster key
let activeSort = "recommend";  // recommend, rating, review, name
let activeTheme = null;        // null or LUNCH_THEMES key (lunch-fun.js)
let searchQuery = "";
let activeFocusedId = null;

// Category styles for markers and badges
const CATEGORY_STYLES = {
  "한식": { color: "#ef4444", icon: "🍚" },
  "중식": { color: "#f97316", icon: "🥟" },
  "일식": { color: "#06b6d4", icon: "🍱" },
  "양식": { color: "#8b5cf6", icon: "🍔" },
  "분식": { color: "#ec4899", icon: "🍙" },
  "카페": { color: "#10b981", icon: "☕" },
  "아시안": { color: "#eab308", icon: "🍜" },
  "패스트푸드": { color: "#f59e0b", icon: "🥪" }
};

// Initialize when DOM is ready
function initLunchGuide() {
  const pendingFocusId = applyFiltersFromUrl();
  initLeafletMap();
  setupFilterEvents();
  renderRestaurantList();

  // ?r=<id> 공유 링크로 들어오면 해당 식당을 지도·목록에서 포커스하고 상세를 연다
  if (pendingFocusId) {
    setTimeout(() => {
      focusCardInList(pendingFocusId);
      focusRestaurantOnMap(pendingFocusId);
      openRestaurantModal(pendingFocusId);
    }, 500);
  }
}

// URL 쿼리 ↔ 필터 상태 동기화 (링크 공유용). 반환값: ?r= 로 지정된 식당 id (없으면 null)
const URL_MEALS = ["all", "breakfast", "lunch", "dinner"];
const URL_SORTS = ["recommend", "rating", "review", "name"];

function applyFiltersFromUrl() {
  const p = new URLSearchParams(location.search);
  const meal = p.get("meal");
  const cat = p.get("cat");
  const b = p.get("b");
  const theme = p.get("theme");
  const sort = p.get("sort");
  const q = p.get("q");
  const r = parseInt(p.get("r"), 10);

  if (meal && URL_MEALS.includes(meal)) activeMeal = meal;
  if (cat && document.querySelector(`.guide-chip[data-category="${CSS.escape(cat)}"]`)) activeCategory = cat;
  if (b && BUILDING_CLUSTERS[b]) activeBuildingFilter = b;
  if (theme && typeof getLunchTheme === "function" && getLunchTheme(theme)) activeTheme = theme;
  if (sort && URL_SORTS.includes(sort)) activeSort = sort;
  if (q) searchQuery = q;

  // 툴바 UI 를 상태에 맞춤
  document.querySelectorAll(".guide-meal-btn[data-meal]").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-meal") === activeMeal);
  });
  document.querySelectorAll(".guide-chip[data-category]").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-category") === activeCategory);
  });
  const sortSelect = document.getElementById("filterSortSelect");
  if (sortSelect) sortSelect.value = activeSort;
  const searchInput = document.getElementById("guideSearchInput");
  if (searchInput) searchInput.value = searchQuery;

  return (Number.isInteger(r) && RESTAURANTS_DATA.some(x => x.id === r)) ? r : null;
}

function syncFiltersToUrl() {
  const p = new URLSearchParams();
  if (activeMeal !== "all") p.set("meal", activeMeal);
  if (activeCategory !== "전체") p.set("cat", activeCategory);
  if (activeBuildingFilter) p.set("b", activeBuildingFilter);
  if (activeTheme) p.set("theme", activeTheme);
  if (activeSort !== "recommend") p.set("sort", activeSort);
  if (searchQuery.trim()) p.set("q", searchQuery.trim());
  const qs = p.toString();
  const next = location.pathname + (qs ? `?${qs}` : "");
  if (next !== location.pathname + location.search) {
    history.replaceState(null, "", next);
  }
}

function copyFilterLink() {
  syncFiltersToUrl();
  const label = document.getElementById("activeFilterSummary")?.innerText?.trim() || "식당도감";
  const text = `🍽️ 식당도감 · ${label}\n${location.href}`;
  if (typeof copyTextToClipboard === "function") {
    copyTextToClipboard(text, "🔗 필터 링크를 복사했습니다");
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLunchGuide);
} else {
  initLunchGuide();
}

// Distance calculation in meters
function getDistanceMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Compute dispersed positions for multi-store buildings with leader lines (100% measured coords)
function computeDispersedPositions(list) {
  const positions = {};
  const linesToDraw = [];

  // Group by buildingCluster
  const clusterGroups = {};
  const standalone = [];

  list.forEach(r => {
    if (r.buildingCluster && BUILDING_CLUSTERS[r.buildingCluster]) {
      if (!clusterGroups[r.buildingCluster]) {
        clusterGroups[r.buildingCluster] = [];
      }
      clusterGroups[r.buildingCluster].push(r);
    } else {
      standalone.push(r);
    }
  });

  // 1. Process Real Multi-Store Building Clusters (radial dispersion + connecting leader lines)
  Object.keys(clusterGroups).forEach(bKey => {
    const bInfo = BUILDING_CLUSTERS[bKey];
    const members = clusterGroups[bKey];
    const n = members.length;

    if (n === 1) {
      const r = members[0];
      positions[r.id] = { lat: bInfo.lat, lng: bInfo.lng };
      return;
    }

    // Radius tuned for store count (clean visible fan-out without clutter)
    const radiusMeters = n >= 6 ? 26 + n * 1.5 : 18 + n * 2.0;
    members.forEach((r, idx) => {
      // Disperse in a clean circle around the measured building location
      const angle = (2 * Math.PI * idx) / n - Math.PI / 2;
      const dLat = (radiusMeters * Math.sin(angle)) / 111120;
      const dLng = (radiusMeters * Math.cos(angle)) / (111120 * Math.cos(bInfo.lat * Math.PI / 180));
      const pos = {
        lat: bInfo.lat + dLat,
        lng: bInfo.lng + dLng
      };
      positions[r.id] = pos;

      // Draw connecting leader line from building center to store pin
      linesToDraw.push({
        restaurantId: r.id,
        buildingKey: bKey,
        from: [bInfo.lat, bInfo.lng],
        to: [pos.lat, pos.lng]
      });
    });
  });

  // 2. Process Standalone Stores (strictly 100% measured coordinates, only micro-offset if exact overlap < 3m)
  const standClusters = [];
  standalone.forEach(r => {
    let found = null;
    for (let c of standClusters) {
      if (getDistanceMeters(c.lat, c.lng, r.lat, r.lng) < 4) { // Only identical plot
        found = c;
        break;
      }
    }
    if (found) {
      found.members.push(r);
    } else {
      standClusters.push({ lat: r.lat, lng: r.lng, members: [r] });
    }
  });

  standClusters.forEach(c => {
    const n = c.members.length;
    if (n === 1) {
      const r = c.members[0];
      // 100% Real Measured Coordinate!
      positions[r.id] = { lat: r.lat, lng: r.lng };
      return;
    }
    // Only if exactly same parcel/coordinate
    const radiusMeters = 14;
    c.members.forEach((r, idx) => {
      const angle = (2 * Math.PI * idx) / n - Math.PI / 2;
      const dLat = (radiusMeters * Math.sin(angle)) / 111120;
      const dLng = (radiusMeters * Math.cos(angle)) / (111120 * Math.cos(c.lat * Math.PI / 180));
      positions[r.id] = {
        lat: c.lat + dLat,
        lng: c.lng + dLng
      };
      linesToDraw.push({
        restaurantId: r.id,
        buildingKey: null,
        from: [c.lat, c.lng],
        to: [c.lat + dLat, c.lng + dLng]
      });
    });
  });

  return { positions, linesToDraw, activeClusters: Object.keys(clusterGroups) };
}

// 1. Initialize Leaflet Map (100% Clean OpenStreetMap Tile - NO "API KEY REQUIRED" WATERMARK)
function initLeafletMap() {
  const mapElement = document.getElementById("leafletMap");
  if (!mapElement) return;

  // Center on comfortable overview between City Square and Chamber of Commerce
  map = L.map("leafletMap", {
    center: [37.5620, 126.9748],
    zoom: 16.5,
    zoomSnap: 0.5,
    zoomDelta: 0.5,
    zoomControl: true,
    attributionControl: true   // OSM 타일 이용정책 필수 조건 — 끄면 "Access blocked" 타일이 오거나 도메인이 차단된다
  });

  // Standard Pure OpenStreetMap (Completely free, no API key)
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    minZoom: 13,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
  }).addTo(map);

  window.map = map;

  // Add HQ Marker
  drawHQMarker();

  // Render Restaurant Markers & Leader Lines
  updateMapMarkers(RESTAURANTS_DATA);

  // Invalidate size and center at comfortable zoom 16.5
  setTimeout(() => {
    if (map) {
      map.invalidateSize();
      map.setView([37.5620, 126.9748], 16.5);
    }
  }, 150);

  let zoomTimer = null;
  map.on("zoomend", () => {
    if (zoomTimer) clearTimeout(zoomTimer);
    zoomTimer = setTimeout(() => {
      updateMapMarkers(getFilteredRestaurants());
    }, 150);
  });

  window.addEventListener("resize", () => {
    if (map) map.invalidateSize();
  });
}

// Draw Company / Base Point Marker with Coffee Bean Sub-Pill (커피빈 가림 방지 및 일체형 배치)
function drawHQMarker(showCoffeeBean = true) {
  if (hqMarker && map) {
    map.removeLayer(hqMarker);
    hqMarker = null;
  }

  const coffeeStore = RESTAURANTS_DATA.find(r => r.id === 1);
  const isCoffeeActive = (activeFocusedId === 1);
  const coffeePillHtml = (showCoffeeBean && coffeeStore) ? `
    <div class="hq-coffee-subconnector">
      <div class="hq-coffee-wire"></div>
      <div class="tree-store-pill hq-coffee-pill ${isCoffeeActive ? 'active-pill' : ''}" 
           id="branch-pill-1"
           onclick="window.handleBranchStoreClick(1, event)"
           title="${coffeeStore.name} - ${coffeeStore.summary}"
           style="--cat-color: #10b981;">
        <span class="pill-icon">☕</span>
        <span class="pill-name">커피빈 (본관 1F)</span>
        <span class="pill-score">★${coffeeStore.rating}</span>
      </div>
    </div>
  ` : '';

  const hqIcon = L.divIcon({
    className: "custom-leaflet-pin-wrapper",
    html: `
      <div class="hq-composite-marker">
        <div class="hq-bubble" title="${HQ_CONFIG.name}" onclick="window.resetMapToHQ();">
          <span>🏢</span>
          <span>${HQ_CONFIG.name}</span>
        </div>
        <div class="hq-pointer"></div>
        ${coffeePillHtml}
      </div>
    `,
    iconSize: null,
    iconAnchor: [0, 0]
  });

  hqMarker = L.marker([HQ_CONFIG.lat, HQ_CONFIG.lng], { 
    icon: hqIcon, 
    zIndexOffset: 6500 
  }).addTo(map);

  if (showCoffeeBean) {
    currentMarkers[1] = hqMarker;
  }
}

// Create Minimalist Category Icon Pin (Zero Text Clutter, Tooltip on Hover/Active)
function createCategoryPin(restaurant, isActive = false) {
  const style = CATEGORY_STYLES[restaurant.category] || { color: "#2563eb", icon: "🍴" };
  const activeClass = isActive ? "active-pin" : "";

  return L.divIcon({
    className: "custom-leaflet-pin-wrapper",
    html: `
      <div class="restaurant-icon-pin ${activeClass}" 
           id="marker-elem-${restaurant.id}" 
           style="--pin-color: ${style.color};"
           onclick="window.handleMarkerBubbleClick(${restaurant.id}, event)">
        <div class="pin-hover-tooltip">
          <span class="tooltip-name">${restaurant.name}</span>
          <span class="tooltip-score">★${restaurant.rating}</span>
        </div>
        <div class="pin-icon-circle" title="${restaurant.name} (★${restaurant.rating})">
          <span>${style.icon}</span>
        </div>
        <div class="pin-pointer"></div>
      </div>
    `,
    iconSize: null, // Zero hitbox mismatch - exact auto sizing!
    iconAnchor: [0, 0],
    popupAnchor: [0, -32]
  });
}

// Helper: Build Meal Badges HTML
function buildMealBadgesHtml(r) {
  const badges = [];
  if (r.breakfast) badges.push(`<span class="meal-badge meal-bf">🌅 아침</span>`);
  if (r.lunch) badges.push(`<span class="meal-badge meal-lunch">☀️ 점심</span>`);
  if (r.dinner) badges.push(`<span class="meal-badge meal-dinner">🌙 저녁</span>`);
  return `<div class="meal-badge-group">${badges.join("")}</div>`;
}

// Build Interactive Marker Popup HTML
function buildPopupHtml(r) {
  return `
    <div class="popup-card">
      <img src="${r.imageUrl}" alt="${r.name}" class="popup-img" onerror="this.src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=75'"/>
      <div class="popup-body">
        <div class="popup-title-row">
          <span class="popup-name">${r.name}</span>
          <span class="popup-rating">★ ${r.rating}</span>
        </div>
        <div class="popup-meta">
          <span>${r.category}</span> · <span>${r.building || r.address}</span>
        </div>
        ${buildMealBadgesHtml(r)}
        <div class="popup-menu">🍴 ${r.summary}</div>
        <div class="popup-tip">💡 ${r.tip}</div>
        <div class="popup-actions" onclick="event.stopPropagation()">
          <button class="popup-btn card-btn-detail" onclick="window.openRestaurantModal(${r.id}); event.stopPropagation();">실제사진·정보</button>
          <a class="popup-btn card-btn-naver" href="${r.naverUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()">네이버</a>
          <a class="popup-btn card-btn-kakao" href="${r.kakaoUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()">카카오맵</a>
        </div>
      </div>
    </div>
  `;
}

// Build Building Interactive Popup HTML (클릭 시 전체 입점 매장 리스트 및 상세 연결)
function buildBuildingPopupHtml(bKey, bInfo, stores) {
  return `
    <div class="building-popup-card">
      <div class="building-popup-header">
        <div class="building-popup-title">
          <span>🏢</span>
          <span>${bInfo.name}</span>
        </div>
        <span class="building-popup-count">${stores.length}곳 입점</span>
      </div>
      <div class="building-popup-body">
        ${stores.map(r => `
          <div class="building-popup-store-row" onclick="focusRestaurantFromBuilding(${r.id})">
            <div class="b-store-info">
              <div class="b-store-name-row">
                <span class="b-store-name">${r.name}</span>
                <span class="b-store-cat">· ${r.category}</span>
              </div>
              <div class="b-store-menu">🍴 ${r.summary}</div>
            </div>
            <div class="b-store-score">★${r.rating}</div>
          </div>
        `).join("")}
      </div>
      <div class="building-popup-footer">
        <button class="b-footer-btn b-btn-filter" onclick="selectBuildingQuick('${bKey}')">
          📋 목록에서 ${stores.length}곳만 모아보기
        </button>
      </div>
    </div>
  `;
}

// Pill Store Name Formatting (중복되는 빌딩명/지점명 제거하여 콤팩트하고 명확하게 표시)
function formatTreePillName(name) {
  if (!name) return "";
  let n = name;
  if (/^[시씨]티스퀘어\((.*?)\)$/.test(n)) {
    n = n.replace(/^[시씨]티스퀘어\((.*?)\)$/, '$1');
  }
  n = n
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/^[시씨]티스퀘어\s*/g, '')
    .replace(/\s*(서울시청점|시청역점|시청본점|시청직영점|시청북창점|서소문시청역점|서소문퍼시픽타워점|서소문점|북창점|태평로점|퍼시픽타워점|상공회의소점|본점|서울시청\s*본점|시티스퀘어\s*시청점|숭례문점|시청점|삼성본관점|시청역)/g, '')
    .replace(/완백부대찌개삼겹살/g, '완백부대찌개')
    .replace(/송원스키야키샤브샤브/g, '송원스키야키')
    .replace(/\s+/g, ' ')
    .trim();
  return n;
}

// Overview Clustered Branches (Zoom < 18: 50% 이상 겹침 방지 및 지도 밖/빈 공간으로 지시선 인출)
const OVERVIEW_CLUSTERS = [
  // 1. 씨티스퀘어 (8곳, 북서측) -> 덕수궁/시청 방면(RIGHT) 인출
  {
    key: "citysquare",
    name: "씨티스퀘어",
    icon: "🏢",
    lat: 37.5631062,
    lng: 126.9752236,
    dir: "right",
    customClass: "callout-citysquare",
    ids: [14, 15, 16, 17, 18, 19, 20, 66]
  },
  // 2. 퍼시픽타워 (2곳, 서측) -> 부영 중정 방면(UP-RIGHT) 인출 (사용자 스케치 반영)
  {
    key: "pacific",
    name: "퍼시픽타워",
    icon: "🏢",
    lat: 37.5613584,
    lng: 126.9730165,
    dir: "up-right",
    customClass: "callout-pacific callout-dir-up-right",
    ids: [50, 52]
  },
  // 3. 대한상공회의소 (6곳, 남측) -> 신한은행 앞 광장(RIGHT) 인출 (사용자 스케치 반영)
  {
    key: "chamber",
    name: "대한상공회의소",
    icon: "🏢",
    lat: 37.5607137,
    lng: 126.9737753,
    dir: "right",
    customClass: "callout-chamber",
    ids: [37, 38, 44, 45, 47, 49]
  },
  // 4. 서소문로134-6 먹자라인 (9곳, 북서측 골목) -> 서소문고가/공원 방면(LEFT)으로 인출
  {
    key: "seosomun_134",
    name: "서소문로134-6",
    icon: "🏢",
    lat: 37.56350,
    lng: 126.97580,
    dir: "left",
    customClass: "callout-seosomun",
    ids: [40, 39, 30, 31, 32, 23, 24, 22, 11]
  },
  // 5. 세종대로11길 북측 골목 (6곳, 부영빌딩 북측) -> 서소문공원 방면(LEFT)으로 인출
  {
    key: "sejong11_north",
    name: "세종대로11길 북측",
    icon: "📍",
    lat: 37.56240,
    lng: 126.97430,
    dir: "left",
    customClass: "callout-sejong-north",
    ids: [13, 27, 2, 3, 4, 8]
  },
  // 6. 세종대로11길 남측 골목 (9곳, 부영빌딩 서측 및 순화동) -> 순화동/서소문 방면(LEFT)으로 인출
  {
    key: "sejong11_south",
    name: "세종대로11길 남측",
    icon: "📍",
    lat: 37.56145,
    lng: 126.97320,
    dir: "left",
    customClass: "callout-sejong-south",
    ids: [26, 25, 34, 6, 5, 36, 33, 43, 21]
  },
  // 7. 태평로2가 대로변 (7곳, 세종대로 동측 라인) -> 소공로 방면(RIGHT)으로 인출
  {
    key: "taepyeong_street",
    name: "태평로2가 대로변",
    icon: "🏢",
    lat: 37.56245,
    lng: 126.97630,
    dir: "right",
    customClass: "callout-taepyeong-street",
    ids: [65, 28, 29, 7, 10, 9, 12]
  },
  // 8. 북창동 먹자골목 (18곳 전수) -> 소공로/남대문 방면(RIGHT)으로 일괄 인출
  {
    key: "bukchang_alley",
    name: "북창동 먹자골목",
    icon: "🏮",
    lat: 37.56295,
    lng: 126.97770,
    dir: "right",
    customClass: "callout-bukchang-alley",
    ids: [59, 56, 62, 61, 64, 63, 42, 58, 51, 46, 60, 35, 55, 57, 54, 53, 48, 41]
  }
];

// Build Branch Callout Tree HTML (사용자 스케치 완벽 구현: 건물 앵커 -> 지시선 -> 세로 빗/척추선 -> 식당 알약 목록)
function buildBranchCalloutHtml(cluster, stores) {
  const dir = cluster.dir || "right";
  const isUpRight = (dir === "up-right");
  const calloutClass = `building-tree-callout dir-${dir} ${cluster.customClass || ''}`;

  const stemHtml = isUpRight
    ? `
      <div class="tree-elbow-stem">
        <svg width="40" height="48" viewBox="0 0 40 48" fill="none" class="elbow-svg">
          <path d="M 4 44 L 20 8 L 38 8" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    `
    : `<div class="tree-stem-line"></div>`;

  const spineClass = isUpRight ? "tree-spine-container up-right-spine" : "tree-spine-container";

  return `
    <div class="${calloutClass}" id="callout-tree-${cluster.key}">
      <!-- 1. 거점 랜드마크 앵커 (펄스 링 & 뱃지) -->
      <div class="tree-root-anchor" onclick="window.handleBuildingHubClick('${cluster.key}', event)">
        <span class="root-dot"></span>
        <span class="root-pulse"></span>
        <div class="root-building-badge">
          <span>${cluster.icon || '🏢'}</span>
          <span>${cluster.name}</span>
          <span class="b-count">${stores.length}곳</span>
        </div>
      </div>

      <!-- 2. 지시선 (Stem Wire) -->
      ${stemHtml}

      <!-- 3. 세로 빗(척추선) & 식당 알약 목록 -->
      <div class="${spineClass}">
        ${stores.map(r => {
          const style = CATEGORY_STYLES[r.category] || { color: "#2563eb", icon: "🍴" };
          const isActive = (r.id === activeFocusedId);
          const cleanName = formatTreePillName(r.name);
          return `
            <div class="tree-branch-node" 
                 onclick="window.handleBranchStoreClick(${r.id}, event)"
                 title="${r.name} - ${r.summary}">
              <div class="tree-store-pill ${isActive ? 'active-pill' : ''}" 
                   id="branch-pill-${r.id}"
                   style="--cat-color: ${style.color};">
                <span class="pill-icon">${style.icon}</span>
                <span class="pill-name">${cleanName}</span>
                <span class="pill-score">★${r.rating}</span>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

// Legacy alias for compatibility
function buildBranchTreeHtml(bKey, bInfo, stores) {
  const cluster = OVERVIEW_CLUSTERS.find(c => c.key === bKey) || {
    key: bKey,
    name: bInfo.name,
    icon: "🏢",
    dir: bInfo.branchDir || "right",
    customClass: `callout-${bKey}`
  };
  return buildBranchCalloutHtml(cluster, stores);
}

// Single Store Pill Marker HTML (확대 시 단독 매장 GPS 좌표에 직접 표시: [아이콘] [이름] [★평점])
function buildSingleStorePillHtml(r) {
  const style = CATEGORY_STYLES[r.category] || { color: "#2563eb", icon: "🍴" };
  const isActive = (r.id === activeFocusedId);
  const cleanName = formatTreePillName(r.name);
  return `
    <div class="single-store-pill-wrapper ${isActive ? 'active-marker' : ''}" 
         id="single-pill-wrap-${r.id}"
         onclick="window.handleBranchStoreClick(${r.id}, event)"
         title="${r.name} (★${r.rating}) - ${r.summary}">
      <div class="tree-store-pill ${isActive ? 'active-pill' : ''}" 
           id="branch-pill-${r.id}"
           style="--cat-color: ${style.color};">
        <span class="pill-icon">${style.icon}</span>
        <span class="pill-name">${cleanName}</span>
        <span class="pill-score">★${r.rating}</span>
      </div>
      <div class="single-pill-pointer" style="border-top-color: ${style.color};"></div>
    </div>
  `;
}

// Mini Building Callout HTML for Zoom >= 18 Multi-Store Buildings
function buildMiniBuildingPillHtml(stores, dir = "right", customClass = "") {
  return `
    <div class="mini-building-callout dir-${dir} ${customClass}">
      <span class="mini-hub-dot"></span>
      <div class="mini-stem-line"></div>
      <div class="mini-spine-container">
        ${stores.map(r => {
          const style = CATEGORY_STYLES[r.category] || { color: "#2563eb", icon: "🍴" };
          const isActive = (r.id === activeFocusedId);
          const cleanName = formatTreePillName(r.name);
          return `
            <div class="mini-branch-node" 
                 onclick="window.handleBranchStoreClick(${r.id}, event)"
                 title="${r.name} - ${r.summary}">
              <div class="tree-store-pill ${isActive ? 'active-pill' : ''}" 
                   id="branch-pill-${r.id}"
                   style="--cat-color: ${style.color};">
                <span class="pill-icon">${style.icon}</span>
                <span class="pill-name">${cleanName}</span>
                <span class="pill-score">★${r.rating}</span>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

// Zoom-in Multi-Store Building Configurations (확대 시 겹침 원천 방지 건물 매핑)
const ZOOMIN_BUILDING_CLUSTERS = [
  // 1. 씨티스퀘어 (8곳: 서쪽 공원 방면 LEFT 인출로 동쪽 골목과 완벽 분리)
  { key: "citysquare", dir: "left", customClass: "mini-citysquare", lat: 37.5631062, lng: 126.9752236, ids: [14, 15, 16, 17, 18, 19, 20, 66] },
  // 2. 대한상공회의소 (6곳)
  { key: "chamber", dir: "right", lat: 37.5607137, lng: 126.9737753, ids: [37, 38, 44, 45, 47, 49] },
  // 3. 퍼시픽타워 (2곳)
  { key: "pacific", dir: "right", lat: 37.5613584, lng: 126.9730165, ids: [50, 52] },
  // 4. 서소문로 134-6 빌딩 (3곳: 광화문특고기, 십원집, 조조순대)
  { key: "seosomun_134_6", dir: "right", lat: 37.56346, lng: 126.97589, ids: [30, 31, 32] },
  // 5. 서소문로 134-10/21 빌딩 (2곳: 교동전선생, 봉평막국수)
  { key: "kyodong_bongpyeong", dir: "right", lat: 37.56318, lng: 126.97589, ids: [23, 24] },
  // 6. 서소문로 134/136 대로변 코너 (2곳: KFC, 슬로우캘리)
  { key: "kfc_slowcali", dir: "right", lat: 37.56372, lng: 126.97595, ids: [39, 40] },
  // 7. 서소문로 골목 안쪽 (2곳: 신의주찹쌀순대, 소문밥상 -> 서쪽 LEFT 인출로 동측 골목과 완벽 분리)
  { key: "seosomun_alley_inner", dir: "left", lat: 37.56330, lng: 126.97565, ids: [22, 11] },
  // 8. 세종대로 68 / 태평로2가 69-12 (3곳: 쪽삼상회, 써브웨이, 본도시락 -> 세종대로 방면 LEFT 인출)
  { key: "sejong_68", dir: "left", lat: 37.56225, lng: 126.97675, ids: [9, 10, 12] },
  // 9. 세종대로 74-1 (2곳: 부대찌개대사관, 김가네 -> 세종대로 방면 LEFT 인출)
  { key: "sejong_74", dir: "left", lat: 37.56282, lng: 126.97693, ids: [28, 29] },
  // 10. 세종대로11길 26 북측 (3곳: 대독장, 누나홀닭, 본뼈감자탕)
  { key: "sejong11_26", dir: "right", lat: 37.56230, lng: 126.97425, ids: [3, 4, 8] },
  // 11. 세종대로11길 26 남측 (2곳: 우림정, 바스버거)
  { key: "sejong11_south_mini", dir: "left", lat: 37.56204, lng: 126.97417, ids: [5, 6] },
  // 12. 세종대로11길 45 (2곳: 명동순대국, 시월애)
  { key: "sejong11_45", dir: "left", lat: 37.56197, lng: 126.97340, ids: [33, 36] },
  // 13. 세종대로11길 38 (2곳: 전주다대기, 함평집)
  { key: "sejong11_38", dir: "left", lat: 37.56223, lng: 126.97362, ids: [25, 26] },
  // 14. 북창동 북창옥 & 이자카야나무 (2곳)
  { key: "bukchang_tree", dir: "right", lat: 37.56277, lng: 126.97734, ids: [35, 46] },
  // 15. 북창동 19-3 순두부 & 묵은지 (2곳: 북창동순두부, 신성식당)
  { key: "bukchang_soondubu", dir: "right", lat: 37.56310, lng: 126.97810, ids: [58, 55] },
  // 16. 세종대로18길 24 (2곳: 송원스키야키, 샐러디)
  { key: "sejong18_24", dir: "right", lat: 37.56368, lng: 126.97822, ids: [61, 62] }
];

// Update Map Markers with Dynamic Zoom-Aware Collision Extraction
function updateMapMarkers(list) {
  if (!map) return;

  // Clear existing markers and callouts
  Object.values(currentMarkers).forEach(m => {
    if (m !== hqMarker) map.removeLayer(m);
  });
  currentMarkers = {};

  Object.values(buildingHubMarkers).forEach(m => map.removeLayer(m));
  buildingHubMarkers = {};

  leaderLines.forEach(l => map.removeLayer(l));
  leaderLines = [];

  // 1. Draw Samsung HQ & Coffee Bean (ID 1) - 커피빈이 기준점에 가려지지 않게 일체형 배치
  const isCoffeeBeanVisible = list.some(r => r.id === 1);
  drawHQMarker(isCoffeeBeanVisible);

  const currentZoom = map.getZoom();

  // 2. 확대했을 때 (Zoom >= 18): 단독 매장은 단일 알약, 복합 건물 매장은 미니 브랜치로 100% 겹침 방지
  if (currentZoom >= 18) {
    const listStoreMap = {};
    list.forEach(r => { listStoreMap[r.id] = r; });

    const handledIds = new Set();
    if (isCoffeeBeanVisible) handledIds.add(1);

    // 2-1. 복합 건물 미니 브랜치 렌더링
    ZOOMIN_BUILDING_CLUSTERS.forEach(cluster => {
      const visibleStores = cluster.ids
        .map(id => listStoreMap[id])
        .filter(Boolean);

      if (visibleStores.length === 0) return;

      visibleStores.forEach(r => handledIds.add(r.id));

      if (visibleStores.length === 1) {
        // 1곳만 필터링된 경우 단독 알약 핀으로 렌더링
        const r = visibleStores[0];
        const isFocused = (r.id === activeFocusedId);
        const pillIcon = L.divIcon({
          className: "custom-leaflet-pin-wrapper",
          html: buildSingleStorePillHtml(r),
          iconSize: null,
          iconAnchor: [0, 0]
        });
        const marker = L.marker([cluster.lat, cluster.lng], {
          icon: pillIcon,
          zIndexOffset: isFocused ? 7000 : 300
        }).addTo(map);
        currentMarkers[r.id] = marker;
      } else {
        // 2곳 이상: 미니 브랜치로 세로 정렬 (겹침 0%)
        const hasFocused = visibleStores.some(r => r.id === activeFocusedId);
        const miniIcon = L.divIcon({
          className: "custom-leaflet-pin-wrapper",
          html: buildMiniBuildingPillHtml(visibleStores, cluster.dir || "right", cluster.customClass || ""),
          iconSize: null,
          iconAnchor: [0, 0]
        });
        const marker = L.marker([cluster.lat, cluster.lng], {
          icon: miniIcon,
          zIndexOffset: hasFocused ? 7500 : 1500
        }).addTo(map);

        visibleStores.forEach(r => {
          currentMarkers[r.id] = marker;
        });
      }
    });

    // 2-2. 복합 건물에 속하지 않은 일반 단독 매장들 렌더링
    list.forEach(r => {
      if (handledIds.has(r.id)) return;
      const isFocused = (r.id === activeFocusedId);
      const pillIcon = L.divIcon({
        className: "custom-leaflet-pin-wrapper",
        html: buildSingleStorePillHtml(r),
        iconSize: null,
        iconAnchor: [0, 0]
      });
      const marker = L.marker([r.lat, r.lng], {
        icon: pillIcon,
        zIndexOffset: isFocused ? 7000 : 300
      }).addTo(map);
      currentMarkers[r.id] = marker;
    });

    return;
  }

  // 3. 축소(Overview) 화면 (Zoom < 18): 50% 이상 겹침 방지 및 권역별 지시선 인출 트리 렌더링
  const listStoreMap = {};
  list.forEach(r => { listStoreMap[r.id] = r; });

  const handledIds = new Set();
  if (isCoffeeBeanVisible) handledIds.add(1);

  OVERVIEW_CLUSTERS.forEach(cluster => {
    const visibleStores = cluster.ids
      .map(id => listStoreMap[id])
      .filter(Boolean);

    if (visibleStores.length === 0) return;

    visibleStores.forEach(r => handledIds.add(r.id));

    const calloutIcon = L.divIcon({
      className: "custom-leaflet-pin-wrapper",
      html: buildBranchCalloutHtml(cluster, visibleStores),
      iconSize: null,
      iconAnchor: [0, 0]
    });

    const branchMarker = L.marker([cluster.lat, cluster.lng], {
      icon: calloutIcon,
      zIndexOffset: 4000
    }).addTo(map);

    buildingHubMarkers[cluster.key] = branchMarker;

    visibleStores.forEach(r => {
      currentMarkers[r.id] = branchMarker;
    });
  });

  // 혹시라도 클러스터에 미포함된 필터 결과는 단독 알약으로 fallback 표시
  list.forEach(r => {
    if (!handledIds.has(r.id)) {
      const isFocused = (r.id === activeFocusedId);
      const pillIcon = L.divIcon({
        className: "custom-leaflet-pin-wrapper",
        html: buildSingleStorePillHtml(r),
        iconSize: null,
        iconAnchor: [0, 0]
      });
      const marker = L.marker([r.lat, r.lng], {
        icon: pillIcon,
        zIndexOffset: isFocused ? 7000 : 300
      }).addTo(map);
      currentMarkers[r.id] = marker;
    }
  });
}

function highlightLeaderLine(restaurantId, isHighlight) {
  leaderLines.forEach(line => {
    if (line.restaurantId === restaurantId) {
      line.setStyle({
        color: isHighlight ? "#2563eb" : "#3b82f6",
        weight: isHighlight ? 3.5 : 2,
        opacity: isHighlight ? 1 : 0.65
      });
    }
  });
}

function highlightBuildingLeaderLines(buildingKey, isHighlight) {
  leaderLines.forEach(line => {
    if (line.buildingKey === buildingKey) {
      line.setStyle({
        color: isHighlight ? "#2563eb" : "#3b82f6",
        weight: isHighlight ? 4 : 2,
        opacity: isHighlight ? 1 : 0.65
      });
    }
  });
}

function focusRestaurantFromBuilding(id) {
  if (map) map.closePopup();
  focusRestaurantOnMap(id);
  setTimeout(() => {
    openRestaurantModal(id);
  }, 350);
}

// 2. Filter & Search Logic
function getFilteredRestaurants() {
  let list = [...RESTAURANTS_DATA];

  // 0) Building Filter
  if (activeBuildingFilter) {
    list = list.filter(r => r.buildingCluster === activeBuildingFilter);
  }

  // 1) Meal Time Filter
  if (activeMeal === "breakfast") {
    list = list.filter(r => r.breakfast === true);
  } else if (activeMeal === "lunch") {
    list = list.filter(r => r.lunch === true);
  } else if (activeMeal === "dinner") {
    list = list.filter(r => r.dinner === true);
  }

  // 2) Category Filter
  if (activeCategory !== "전체") {
    list = list.filter(r => r.category === activeCategory);
  }

  // 2-1) Theme Course Filter (국물·해장, 고기·구이, 면, 매운맛 등 음식 종류 — lunch-fun.js)
  if (activeTheme && typeof matchesLunchTheme === "function") {
    list = list.filter(r => matchesLunchTheme(r, activeTheme));
  }

  // 3) Search Keyword Filter
  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    list = list.filter(r => 
      r.name.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.address.toLowerCase().includes(q) ||
      (r.building && r.building.toLowerCase().includes(q)) ||
      r.summary.toLowerCase().includes(q) ||
      r.tip.toLowerCase().includes(q) ||
      r.menus.some(m => m.name.toLowerCase().includes(q))
    );
  }

  // 4) Sorting
  if (activeSort === "rating") {
    list.sort((a, b) => b.rating - a.rating);
  } else if (activeSort === "review") {
    list.sort((a, b) => b.reviewCount - a.reviewCount);
  } else if (activeSort === "name") {
    list.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  } else {
    // Default: Recommend
    list.sort((a, b) => (b.rating * 100 + b.reviewCount * 0.1) - (a.rating * 100 + a.reviewCount * 0.1));
  }

  return list;
}

// Building Filter Quick Handlers
function selectBuildingQuick(bKey) {
  activeBuildingFilter = bKey;
  renderRestaurantList();

  const bInfo = BUILDING_CLUSTERS[bKey];
  if (bInfo && map) {
    map.flyTo([bInfo.lat, bInfo.lng], 18, { duration: 0.6 });
    setTimeout(() => {
      const hub = buildingHubMarkers[bKey];
      if (hub) hub.openPopup();
      highlightBuildingLeaderLines(bKey, true);
    }, 450);
  }
}

function clearBuildingFilter() {
  activeBuildingFilter = null;
  renderRestaurantList();
  if (map) {
    map.closePopup();
    map.flyTo([HQ_CONFIG.lat, HQ_CONFIG.lng], 16, { duration: 0.6 });
  }
}

// Render Restaurant List Sidebar
function renderRestaurantList() {
  const container = document.getElementById("restaurantList");
  const countEl = document.getElementById("restaurantCount");
  const summaryEl = document.getElementById("activeFilterSummary");
  if (!container) return;

  const list = getFilteredRestaurants();
  if (countEl) countEl.innerText = list.length;
  syncFiltersToUrl();

  // Active Building Banner update
  const bannerEl = document.getElementById("buildingActiveBanner");
  const bannerTitleEl = document.getElementById("buildingBannerTitle");
  const bannerCountEl = document.getElementById("buildingBannerCount");
  if (bannerEl) {
    if (activeBuildingFilter && BUILDING_CLUSTERS[activeBuildingFilter]) {
      bannerEl.style.display = "flex";
      if (bannerTitleEl) bannerTitleEl.innerText = BUILDING_CLUSTERS[activeBuildingFilter].name;
      if (bannerCountEl) bannerCountEl.innerText = list.length;
    } else {
      bannerEl.style.display = "none";
    }
  }

  // Active Building Quick Buttons sync
  document.querySelectorAll(".building-quick-btn").forEach(btn => {
    const b = btn.getAttribute("data-building");
    if (!activeBuildingFilter && b === "all") {
      btn.classList.add("active");
    } else if (activeBuildingFilter === b) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  if (summaryEl) {
    let mealName = "전체 식사";
    if (activeMeal === "breakfast") mealName = "🌅 아침(조식)";
    if (activeMeal === "lunch") mealName = "☀️ 점심(중식)";
    if (activeMeal === "dinner") mealName = "🌙 저녁(석식)";
    let bText = activeBuildingFilter ? ` · 🏢 ${BUILDING_CLUSTERS[activeBuildingFilter]?.name}` : "";
    let tText = (activeTheme && typeof getLunchThemeLabel === "function") ? ` · ${getLunchThemeLabel(activeTheme)}` : "";
    summaryEl.innerText = `${mealName} · ${activeCategory}${bText}${tText}`;
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div class="guide-empty">
        <div class="guide-empty-icon">🍽️</div>
        <div>해당 조건에 맞는 식당이 없습니다.</div>
        <div style="font-size: 12px; margin-top: 4px; color: #94a3b8;">다른 식사 시간이나 카테고리를 선택해 보세요.</div>
      </div>
    `;
    updateMapMarkers([]);
    return;
  }

  container.innerHTML = list.map(r => `
    <div class="restaurant-card ${activeFocusedId === r.id ? 'active-focus' : ''}" 
         id="card-${r.id}" 
         onclick="focusRestaurantOnMap(${r.id})">
      <div class="card-banner">
        <img src="${r.imageUrl}" alt="${r.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=75'"/>
        <span class="card-badge">${r.badge}</span>
        ${r.images && r.images.length > 1 ? `<span class="card-photo-count">📷 네이버실사 ${r.images.length}장</span>` : ''}
      </div>
      <div class="card-body">
        <div class="card-header-row">
          <div class="card-name">${r.name}</div>
          <div class="card-rating-wrap">
            <span>★ ${r.rating}</span>
            <span class="card-rating-count">(${r.reviewCount})</span>
          </div>
        </div>

        <!-- 식사 가능 시간 뱃지 (아침/점심/저녁) -->
        ${buildMealBadgesHtml(r)}

        <div class="card-category-line">
          <span style="font-weight: 700; color: ${CATEGORY_STYLES[r.category]?.color || 'var(--primary)'}">${r.category}</span>
          <span>·</span>
          <span>${r.address}</span>
        </div>
        <div class="card-summary">${r.summary}</div>

        <!-- 대표 메뉴 미리보기 -->
        <div class="card-menu-preview">
          ${r.menus.slice(0, 3).map(m => `
            <div class="menu-item-row">
              <span class="menu-item-name">${m.isSignature ? '⭐ ' : ''}${m.name}</span>
              <span class="menu-item-price">${m.price}</span>
            </div>
          `).join("")}
        </div>

        <!-- 직장인 꿀팁 박스 -->
        <div class="card-tip-box">
          <span class="card-tip-icon">💡</span>
          <div>${r.tip}</div>
        </div>

        <!-- 액션 버튼 (네이버 / 카카오맵) -->
        <div class="card-actions" onclick="event.stopPropagation()">
          <button class="card-btn card-btn-detail" onclick="openRestaurantModal(${r.id})">실제사진·정보</button>
          <a class="card-btn card-btn-naver" href="${r.naverUrl}" target="_blank" rel="noopener">네이버</a>
          <a class="card-btn card-btn-kakao" href="${r.kakaoUrl}" target="_blank" rel="noopener">카카오맵</a>
        </div>
      </div>
    </div>
  `).join("");

  updateMapMarkers(list);
}

// 3. User Interactions
function focusRestaurantOnMap(id) {
  const r = RESTAURANTS_DATA.find(x => x.id === id);
  if (!r || !map) return;

  activeFocusedId = id;
  highlightCard(id);
  highlightPin(id);
  highlightLeaderLine(id, true);
  if (r.buildingCluster) {
    highlightBuildingLeaderLines(r.buildingCluster, true);
  }

  const marker = currentMarkers[id];
  if (marker) {
    const latLng = marker.getLatLng();
    map.flyTo(latLng, 18, { duration: 0.6 });
    marker.setZIndexOffset(7000);
    setTimeout(() => {
      marker.openPopup();
    }, 400);
  } else {
    map.flyTo([r.lat, r.lng], 18, { duration: 0.6 });
  }
}

function focusCardInList(id) {
  activeFocusedId = id;
  const targetR = RESTAURANTS_DATA.find(x => x.id === id);

  // If filtered out by building, clear building filter so card is visible
  if (activeBuildingFilter && targetR && targetR.buildingCluster !== activeBuildingFilter) {
    activeBuildingFilter = null;
    renderRestaurantList();
  }

  highlightCard(id);
  highlightPin(id);
  highlightLeaderLine(id, true);
  if (targetR && targetR.buildingCluster) {
    highlightBuildingLeaderLines(targetR.buildingCluster, true);
  }

  setTimeout(() => {
    const card = document.getElementById(`card-${id}`);
    const sidebar = document.querySelector('.guide-sidebar');
    if (card && sidebar) {
      const offset = card.offsetTop - sidebar.offsetTop - 80;
      sidebar.scrollTo({ top: Math.max(0, offset), behavior: "smooth" });
    } else if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 50);
}

function highlightCard(id) {
  document.querySelectorAll(".restaurant-card").forEach(el => {
    el.classList.remove("active-focus");
  });
  const card = document.getElementById(`card-${id}`);
  if (card) {
    card.classList.add("active-focus");
  }
}

function highlightPin(id) {
  document.querySelectorAll(".restaurant-icon-pin, .restaurant-bubble-marker").forEach(el => {
    el.classList.remove("active-pin");
  });
  const pinElem = document.getElementById(`marker-elem-${id}`);
  if (pinElem) {
    pinElem.classList.add("active-pin");
  }
}

// Quick Map View Controls
function resetMapToHQ() {
  if (!map) return;
  map.flyTo([HQ_CONFIG.lat, HQ_CONFIG.lng], 16, { duration: 0.6 });
  if (hqMarker) hqMarker.openPopup();
}

function fitAllPinsOnMap() {
  if (!map) return;
  const list = getFilteredRestaurants();
  if (list.length === 0) return;

  const markersList = Object.values(currentMarkers);
  if (markersList.length === 0) return;

  const latLngs = markersList.map(m => m.getLatLng());
  latLngs.push(L.latLng(HQ_CONFIG.lat, HQ_CONFIG.lng));
  const bounds = L.latLngBounds(latLngs);
  map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
}

// 4. Modal with Multiple Real Photos Gallery
function openRestaurantModal(id) {
  const r = RESTAURANTS_DATA.find(x => x.id === id);
  if (!r) return;

  const modalOverlay = document.getElementById("detailModalOverlay");
  const modalContainer = document.getElementById("detailModalContent");
  if (!modalOverlay || !modalContainer) return;

  const photos = (r.images && r.images.length > 0) ? r.images : [r.imageUrl];

  modalContainer.innerHTML = `
    <!-- 실제 네이버 사진 갤러리 영역 -->
    <div class="modal-gallery-container">
      <img id="modalMainPhoto" src="${photos[0]}" alt="${r.name}" class="modal-main-img" onerror="this.src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80'"/>
      <button class="modal-close-btn" onclick="closeRestaurantModal()">✕</button>

      <!-- 네이버 실물 사진 여러 장 썸네일 스트립 -->
      <div class="modal-thumb-strip">
        ${photos.map((pUrl, idx) => `
          <img src="${pUrl}" alt="실제사진 ${idx+1}" 
               class="modal-thumb-item ${idx === 0 ? 'active' : ''}" 
               onclick="switchModalPhoto(this, '${pUrl}')"
               onerror="this.style.display='none'"/>
        `).join("")}
      </div>
    </div>

    <div class="modal-content">
      <div class="modal-title-wrap">
        <div>
          <div class="modal-restaurant-name">${r.name}</div>
          <div class="modal-meta-row">
            <span style="color: ${CATEGORY_STYLES[r.category]?.color || 'var(--primary)'}; font-weight: 700;">${r.category}</span>
            <span>·</span>
            <span>📞 ${r.phone}</span>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 20px; font-weight: 800; color: #ea580c;">★ ${r.rating}</div>
          <div style="font-size: 12px; color: #64748b;">네이버/리뷰 ${r.reviewCount}개</div>
        </div>
      </div>

      <!-- 식사 지원 시간 안내 -->
      <div>
        <div class="modal-section-title">⏰ 식권대장 이용 가능 시간</div>
        ${buildMealBadgesHtml(r)}
        <div style="font-size: 12.5px; color: #475569; margin-top: 6px;">🕒 ${r.hours}</div>
      </div>

      <!-- 건물 및 위치 안내 -->
      <div style="font-size: 13px; color: #475569;">
        📍 <b>위치:</b> ${r.address}
      </div>

      <!-- 꿀팁 -->
      <div class="card-tip-box" style="font-size: 13px; padding: 10px 14px;">
        <span class="card-tip-icon" style="font-size: 16px;">💡</span>
        <div><b>가맹점 안내 및 이용 팁:</b><br/>${r.tip}</div>
      </div>

      <!-- 대표 메뉴판 -->
      <div>
        <div class="modal-section-title">🍴 대표 메뉴 및 가격</div>
        <div class="modal-menu-list">
          ${r.menus.map(m => `
            <div class="modal-menu-item ${m.isSignature ? 'signature' : ''}">
              <span>${m.isSignature ? '⭐ ' : ''}${m.name}</span>
              <span>${m.price}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- 외부 포털 바로가기 (시청역 매장 핀포인트 연동) -->
      <div class="card-actions" style="margin-top: 8px;">
        <a class="card-btn card-btn-naver" href="${r.naverUrl}" target="_blank" rel="noopener" style="padding: 10px 0; font-size: 13px;">
          🟢 네이버 플레이스 (시청역 매장 바로보기)
        </a>
        <a class="card-btn card-btn-kakao" href="${r.kakaoUrl}" target="_blank" rel="noopener" style="padding: 10px 0; font-size: 13px;">
          🟡 카카오맵 (시청역 실측위치 핀포인트)
        </a>
      </div>
    </div>
  `;

  modalOverlay.classList.add("open");
}

// Switch main photo in modal gallery
function switchModalPhoto(thumbEl, url) {
  const mainPhoto = document.getElementById("modalMainPhoto");
  if (mainPhoto) {
    mainPhoto.src = url;
  }
  document.querySelectorAll(".modal-thumb-item").forEach(t => t.classList.remove("active"));
  thumbEl.classList.add("active");
}

function closeRestaurantModal() {
  const modalOverlay = document.getElementById("detailModalOverlay");
  if (modalOverlay) {
    modalOverlay.classList.remove("open");
  }
}

// 5. Setup Toolbar & Filter Event Handlers
function setupFilterEvents() {
  // Meal Time Tabs (아침/점심/저녁)
  document.querySelectorAll(".guide-meal-btn[data-meal]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".guide-meal-btn[data-meal]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeMeal = btn.getAttribute("data-meal");
      renderRestaurantList();
    });
  });

  // Category Chips
  document.querySelectorAll(".guide-chip[data-category]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".guide-chip[data-category]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.getAttribute("data-category");
      renderRestaurantList();
    });
  });

  // Sort Select
  const sortSelect = document.getElementById("filterSortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      activeSort = e.target.value;
      renderRestaurantList();
    });
  }

  // Search Input
  const searchInput = document.getElementById("guideSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderRestaurantList();
    });
  }

  // Modal Backdrop Click & ESC Key
  const modalOverlay = document.getElementById("detailModalOverlay");
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeRestaurantModal();
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeRestaurantModal();
  });
}

// Marker bubble direct click handler
function handleMarkerBubbleClick(id, event) {
  if (event) {
    if (event.stopPropagation) event.stopPropagation();
  }
  focusRestaurantOnMap(id);
}

// Branch Tree store pill click handler (User Sketch: pill click opens detail & focuses list)
function handleBranchStoreClick(id, event) {
  if (event) {
    if (event.stopPropagation) event.stopPropagation();
  }
  focusCardInList(id);
  highlightBranchPill(id);
  openRestaurantModal(id);
}

function highlightBranchPill(id) {
  document.querySelectorAll(".tree-store-pill").forEach(el => el.classList.remove("active-pill"));
  const pill = document.getElementById(`branch-pill-${id}`);
  if (pill) {
    pill.classList.add("active-pill");
  }
}

// Building hub / cluster direct click handler
function handleBuildingHubClick(bKey, event) {
  if (event) {
    if (event.stopPropagation) event.stopPropagation();
  }
  const ovCluster = OVERVIEW_CLUSTERS.find(c => c.key === bKey);
  if (ovCluster) {
    if (map) {
      map.flyTo([ovCluster.lat, ovCluster.lng], 18, { duration: 0.6 });
    }
  } else {
    selectBuildingQuick(bKey);
  }
}

// Reset map to center
function resetMapToHQ() {
  if (!map) return;
  map.closePopup();
  map.flyTo([37.5620, 126.9748], 16.5, { duration: 0.6 });
}

// Fit all pins in viewport
function fitAllPinsOnMap() {
  if (!map) return;
  map.closePopup();
  const allCoords = RESTAURANTS_DATA.map(r => [r.lat, r.lng]);
  allCoords.push([HQ_CONFIG.lat, HQ_CONFIG.lng]);
  const bounds = L.latLngBounds(allCoords);
  map.fitBounds(bounds, { padding: [40, 40], maxZoom: 17 });
}

// Global window bindings for inline HTML onclick handlers
window.handleMarkerBubbleClick = handleMarkerBubbleClick;
window.handleBranchStoreClick = handleBranchStoreClick;
window.highlightBranchPill = highlightBranchPill;
window.handleBuildingHubClick = handleBuildingHubClick;
window.focusRestaurantFromBuilding = focusRestaurantFromBuilding;
window.selectBuildingQuick = selectBuildingQuick;
window.clearBuildingFilter = clearBuildingFilter;
window.focusRestaurantOnMap = focusRestaurantOnMap;
window.focusCardInList = focusCardInList;
window.openRestaurantModal = openRestaurantModal;
window.closeRestaurantModal = closeRestaurantModal;
window.switchModalPhoto = switchModalPhoto;
window.resetMapToHQ = resetMapToHQ;
window.fitAllPinsOnMap = fitAllPinsOnMap;
window.copyFilterLink = copyFilterLink;


