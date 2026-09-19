// 식당도감 점심 재미 도구 (Zero-API, 100% 프론트 전용)
//  1. 테마 코스 필터  : 국물·해장, 고기·구이, 면, 매운맛 등 음식 종류(맛) 기준 — 정적 데이터의 메뉴/팁 텍스트만으로 판정
//  2. "오늘 뭐 먹지?" 룰렛 : 현재 필터(식사·카테고리·건물·테마·검색) 조건의 후보 중 무작위 추첨 (canvas 휠)
//  3. 음료 내기 사다리 타기 : 2~8명, 결과 프리셋(음료 1명 / 커피+디저트 / 순서 정하기 / 직접 입력), 경로 애니메이션
// lunch-guide.js 다음에 로드되며, 그쪽의 전역(activeTheme, getFilteredRestaurants, renderRestaurantList 등)을 그대로 사용한다.

// ==========================================================================
// 1. 테마 코스 정의
// ==========================================================================
function lunchThemeText(r) {
  return [r.name, r.summary, r.tip, (r.menus || []).map(m => m.name).join(" ")].join(" ");
}

const LUNCH_THEMES = [
  {
    key: "soup", icon: "🍲", label: "국물·해장",
    desc: "국밥·탕·찌개·해장국 — 전날 회식 다음 날",
    test: r => /국밥|곰탕|설렁탕|추어탕|감자탕|해장국|삼계탕|순대국|찌개|온면|우동|칼만두|만두국|떡국|술국|도가니탕|우육탕면|갈비탕|순두부|탕반|굴국밥/.test(lunchThemeText(r))
  },
  {
    key: "meat", icon: "🥩", label: "고기·구이",
    desc: "삼겹살·불고기·갈비·보쌈·수육 — 오후 회의 전 에너지 충전",
    test: r => /삼겹살|삼겹(?!유부)|불고기|갈비|오겹|화로|숯불|보쌈정식|굴보쌈|등심|차돌|스키야키|샤브|제육|쭈삼|스테이크|통닭/.test(lunchThemeText(r))
  },
  {
    key: "noodle", icon: "🍜", label: "면 땡기는 날",
    desc: "막국수·밀면·냉면·우육면·짬뽕·우동",
    test: r => /탕면|막국수|밀면|냉면|짜장|짬뽕|라면|칼국수|우동|국수|칼만두|메밀|온면|라볶이/.test(lunchThemeText(r))
  },
  {
    key: "spicy", icon: "🌶️", label: "매운맛 스트레스 해소",
    desc: "얼큰·칼칼·불향 — 속 터지는 날",
    test: r => /매운|얼큰|칼칼|쭈꾸미|짬뽕|불향|매콤|김치찌개|부대찌개|낙지|떡볶이|라볶이|비빔막국수|비빔밀면|스파이시|쭈삼/.test(lunchThemeText(r))
  },
  {
    key: "bowl", icon: "🍛", label: "덮밥·카레·볶음밥",
    desc: "한 그릇 밥 — 카레·규동·사케동·볶음밥·비빔밥",
    test: r => /카레|덮밥|가츠동|사케동|에비동|돈부리|볶음밥|비빔밥|부리또볼|포케/.test(lunchThemeText(r))
  },
  {
    key: "rice", icon: "🍚", label: "백반·정식·솥밥",
    desc: "집밥처럼 반찬 깔리는 한상 — 백반·정식·솥밥·뷔페",
    test: r => /백반|정식|솥밥|돌솥|뷔페|쌈밥|가정식/.test(lunchThemeText(r))
  },
  {
    key: "fried", icon: "🍗", label: "돈까스·치킨·튀김",
    desc: "바삭한 게 당길 때 — 돈까스·돈카츠·치킨·탕수육",
    test: r => /돈까스|돈카츠|가츠|까스|치킨|튀김|탕수육|가라아게|통닭|닭/.test(lunchThemeText(r))
  },
  {
    key: "rainy", icon: "☔", label: "지하·건물 연결", hidden: true,   // 칩에는 안 보이고 날씨 배너(비)에서만 켠다
    desc: "우산 없이 건물 안·지하로 바로 이어지는 곳 (씨티스퀘어 B1, 상공회의소 B2, 본관 1F 등)",
    test: r => /지하|B1|B2|삼성본관/i.test(`${r.building || ""} ${r.address || ""}`)
  },
  {
    key: "light", icon: "🥗", label: "샐러드·가볍게",
    desc: "샐러드·포케·샌드위치·유부초밥·김밥 — 저녁 약속 있는 날",
    test: r => /샐러드|포케|웜볼|샌드위치|유부초밥|김밥|랩\(|베이글|토스트|크루아상|샐러디|부리또|타코/.test(lunchThemeText(r))
  }
];

function getLunchTheme(key) {
  return LUNCH_THEMES.find(t => t.key === key) || null;
}

function getLunchThemeLabel(key) {
  const t = getLunchTheme(key);
  return t ? `${t.icon} ${t.label}` : "";
}

function matchesLunchTheme(r, key) {
  const t = getLunchTheme(key);
  if (!t) return true;
  try { return !!t.test(r); } catch (e) { return false; }
}

function countLunchTheme(key) {
  return RESTAURANTS_DATA.filter(r => matchesLunchTheme(r, key)).length;
}

// 오늘 추천 테마 (날씨 API 없이 요일·계절만으로 가볍게 제안)
function getTodaySuggestedThemeKey() {
  const now = new Date();
  const day = now.getDay();     // 0 일 ~ 6 토
  const month = now.getMonth() + 1;
  if (day === 1) return "soup";                   // 월요일: 해장
  if (day === 5) return "meat";                   // 금요일: 고기
  if (month >= 6 && month <= 8) return "noodle";  // 여름: 면
  if (month === 12 || month <= 2) return "soup";  // 겨울: 국물
  return null;
}

// 툴바 4단 테마 칩 렌더링
function renderThemeBar() {
  const bar = document.getElementById("themeBar");
  if (!bar) return;
  const today = getTodaySuggestedThemeKey();
  bar.innerHTML = `
    <span class="theme-bar-label">🎯 테마 코스:</span>
    <button class="theme-chip ${!activeTheme ? "active" : ""}" onclick="setActiveTheme(null)">전체</button>
    ${LUNCH_THEMES.filter(t => !t.hidden).map(t => `
      <button class="theme-chip ${activeTheme === t.key ? "active" : ""}"
              title="${t.desc}"
              onclick="setActiveTheme('${t.key}')">
        ${t.icon} ${t.label}
        <span class="theme-chip-count">${countLunchTheme(t.key)}</span>
        ${today === t.key ? '<span class="theme-today-badge">오늘 추천</span>' : ""}
      </button>
    `).join("")}
  `;
}

function setActiveTheme(key) {
  activeTheme = (key && key !== activeTheme) ? key : null;
  renderThemeBar();
  renderRestaurantList();
  if (isRouletteOpen()) refreshRoulettePool();
  renderWeatherBanner();
}

// ==========================================================================
// 2. "오늘 뭐 먹지?" 룰렛
// ==========================================================================
const ROULETTE_MAX_SEGMENTS = 12;   // 휠에 올릴 최대 후보 수 (그 이상이면 무작위 12곳 샘플링 → 결과는 여전히 균등 추첨)
let roulettePool = [];              // 현재 조건 전체 후보
let rouletteWheel = [];             // 휠에 그려진 후보 (<= 12)
let rouletteAngle = 0;
let rouletteSpinning = false;
let rouletteRaf = null;

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function isRouletteOpen() {
  const el = document.getElementById("rouletteModalOverlay");
  return !!(el && el.classList.contains("open"));
}

function openRouletteModal() {
  const overlay = document.getElementById("rouletteModalOverlay");
  if (!overlay) return;
  closeLadderModal();
  overlay.classList.add("open");
  refreshRoulettePool();
}

function closeRouletteModal() {
  const overlay = document.getElementById("rouletteModalOverlay");
  if (overlay) overlay.classList.remove("open");
  if (rouletteRaf) { cancelAnimationFrame(rouletteRaf); rouletteRaf = null; }
  rouletteSpinning = false;
}

function describeCurrentConditions() {
  const parts = [];
  if (activeMeal === "breakfast") parts.push("🌅 아침");
  else if (activeMeal === "lunch") parts.push("☀️ 점심");
  else if (activeMeal === "dinner") parts.push("🌙 저녁");
  else parts.push("전체 식사");
  parts.push(activeCategory === "전체" ? "전체메뉴" : activeCategory);
  if (activeBuildingFilter && BUILDING_CLUSTERS[activeBuildingFilter]) parts.push(`🏢 ${BUILDING_CLUSTERS[activeBuildingFilter].name}`);
  if (activeTheme) parts.push(getLunchThemeLabel(activeTheme));
  if (searchQuery.trim()) parts.push(`🔍 "${searchQuery.trim()}"`);
  return parts.join(" · ");
}

function refreshRoulettePool() {
  if (rouletteSpinning) return;
  roulettePool = getFilteredRestaurants();
  rouletteWheel = shuffleArray(roulettePool).slice(0, ROULETTE_MAX_SEGMENTS);
  rouletteAngle = 0;

  const info = document.getElementById("roulettePoolInfo");
  if (info) info.innerText = `${describeCurrentConditions()} · 후보 ${roulettePool.length}곳`;

  const hint = document.getElementById("rouletteHint");
  if (hint) {
    if (roulettePool.length === 0) hint.innerText = "조건에 맞는 식당이 없습니다. 테마나 필터를 바꿔 보세요.";
    else if (roulettePool.length > ROULETTE_MAX_SEGMENTS) hint.innerText = `후보 ${roulettePool.length}곳 중 무작위 ${ROULETTE_MAX_SEGMENTS}곳을 휠에 올렸습니다. (다시 열면 새로 섞입니다)`;
    else hint.innerText = `후보 ${roulettePool.length}곳 모두 휠에 올렸습니다.`;
  }

  const spinBtn = document.getElementById("rouletteSpinBtn");
  if (spinBtn) spinBtn.disabled = roulettePool.length === 0;

  renderRouletteThemeChips();
  drawRouletteWheel();
}

function renderRouletteThemeChips() {
  const wrap = document.getElementById("rouletteThemeChips");
  if (!wrap) return;
  wrap.innerHTML = `
    <button class="theme-chip ${!activeTheme ? "active" : ""}" onclick="setActiveTheme(null)">전체</button>
    ${LUNCH_THEMES.filter(t => !t.hidden).map(t => `
      <button class="theme-chip ${activeTheme === t.key ? "active" : ""}" title="${t.desc}" onclick="setActiveTheme('${t.key}')">
        ${t.icon} ${t.label}
      </button>
    `).join("")}
  `;
}

function rouletteLabel(r) {
  const clean = (typeof formatTreePillName === "function") ? formatTreePillName(r.name) : r.name;
  return clean.length > 8 ? clean.slice(0, 8) + "…" : clean;
}

function drawRouletteWheel() {
  const canvas = document.getElementById("rouletteCanvas");
  if (!canvas) return;
  const size = 300;
  const dpr = window.devicePixelRatio || 1;
  if (canvas.width !== size * dpr) {
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
  }
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, size, size);

  const cx = size / 2, cy = size / 2, R = size / 2 - 4;
  const n = rouletteWheel.length;

  if (n === 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = "#e2e8f0";
    ctx.fill();
    ctx.fillStyle = "#64748b";
    ctx.font = "700 14px Pretendard, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("후보 없음", cx, cy + 5);
    return;
  }

  const seg = (Math.PI * 2) / n;
  rouletteWheel.forEach((r, i) => {
    const start = rouletteAngle + i * seg;
    const style = CATEGORY_STYLES[r.category] || { color: "#2563eb", icon: "🍴" };

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, R, start, start + seg);
    ctx.closePath();
    ctx.fillStyle = style.color;
    ctx.globalAlpha = (i % 2 === 0) ? 1 : 0.8;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(start + seg / 2);
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.font = `800 ${n > 8 ? 11 : 12.5}px Pretendard, sans-serif`;
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = 3;
    ctx.fillText(`${style.icon} ${rouletteLabel(r)}`, R - 14, 0);
    ctx.restore();
  });

  // 중심 허브
  ctx.beginPath();
  ctx.arc(cx, cy, 28, 0, Math.PI * 2);
  ctx.fillStyle = "#0f172a";
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = "20px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🍽️", cx, cy + 1);

  // 바깥 테두리
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 3;
  ctx.stroke();
}

function spinRoulette() {
  if (rouletteSpinning || rouletteWheel.length === 0) return;
  rouletteSpinning = true;

  const spinBtn = document.getElementById("rouletteSpinBtn");
  if (spinBtn) { spinBtn.disabled = true; spinBtn.innerText = "🎡 돌아가는 중..."; }

  const resultEl = document.getElementById("rouletteResult");
  if (resultEl) {
    resultEl.innerHTML = `
      <div class="roulette-result-placeholder spinning">
        <div style="font-size: 30px;">🥁</div>
        <div>두구두구두구...</div>
      </div>
    `;
  }

  const n = rouletteWheel.length;
  const seg = (Math.PI * 2) / n;
  const winnerIdx = Math.floor(Math.random() * n);

  // 포인터(12시 방향 = -π/2)에 당첨 조각의 중심이 오도록 목표 각도 계산 (조각 안에서 살짝 랜덤 편차)
  const jitter = (Math.random() - 0.5) * seg * 0.7;
  const target = -Math.PI / 2 - (winnerIdx + 0.5) * seg + jitter;
  const twoPi = Math.PI * 2;
  const delta = ((target - rouletteAngle) % twoPi + twoPi) % twoPi;
  const startAngle = rouletteAngle;
  const totalTravel = twoPi * (5 + Math.floor(Math.random() * 2)) + delta;
  const duration = 4200;
  const startTime = performance.now();

  const step = (now) => {
    const t = Math.min(1, (now - startTime) / duration);
    const ease = 1 - Math.pow(1 - t, 4);   // easeOutQuart: 끝에서 천천히 멈춤
    rouletteAngle = startAngle + totalTravel * ease;
    drawRouletteWheel();
    if (t < 1) {
      rouletteRaf = requestAnimationFrame(step);
    } else {
      rouletteRaf = null;
      rouletteAngle = ((rouletteAngle % twoPi) + twoPi) % twoPi;
      rouletteSpinning = false;
      if (spinBtn) { spinBtn.disabled = false; spinBtn.innerText = "🔁 다시 돌리기"; }
      showRouletteResult(rouletteWheel[winnerIdx]);
    }
  };
  rouletteRaf = requestAnimationFrame(step);
}

function showRouletteResult(r) {
  const resultEl = document.getElementById("rouletteResult");
  if (!resultEl || !r) return;
  const style = CATEGORY_STYLES[r.category] || { color: "#2563eb", icon: "🍴" };
  resultEl.innerHTML = `
    <div class="roulette-result-card">
      <img class="roulette-result-img" src="${r.imageUrl}" alt="${r.name}" onerror="this.src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=75'"/>
      <div class="roulette-result-body">
        <div class="roulette-result-kicker">🎉 오늘 점심은 여기!</div>
        <div class="roulette-result-name">${r.name}</div>
        <div class="roulette-result-meta">
          <span style="color: ${style.color}; font-weight: 800;">${style.icon} ${r.category}</span>
          <span>·</span>
          <span>★ ${r.rating} (${r.reviewCount})</span>
          <span>·</span>
          <span>📍 ${r.building || r.address}</span>
        </div>
        <div class="roulette-result-summary">🍴 ${r.summary}</div>
        <div class="roulette-result-tip">💡 ${r.tip}</div>
        <div class="roulette-result-actions">
          <button class="card-btn card-btn-detail" onclick="rouletteGoToMap(${r.id})">📍 지도에서 보기</button>
          <button class="card-btn card-btn-detail" onclick="openRestaurantModal(${r.id})">📷 실제사진·정보</button>
          <button class="card-btn roulette-to-ladder-btn" onclick="openLadderFromRoulette(${r.id})">🪜 음료는 사다리로</button>
          <button class="card-btn card-btn-detail" onclick="copyRouletteResult(${r.id})">📋 카톡용 복사</button>
          ${navigator.share ? `<button class="card-btn card-btn-detail" onclick="shareRouletteResult(${r.id})">📤 공유</button>` : ""}
        </div>
      </div>
    </div>
  `;
}

function buildRouletteShareText(r) {
  return [
    "🍽️ 오늘 점심은 여기!",
    `${r.name} (${r.category} · ★${r.rating})`,
    `📍 ${r.building || r.address}`,
    `🍴 ${r.summary}`,
    `🔗 ${location.origin}${location.pathname}?r=${r.id}`
  ].join("\n");
}

function copyRouletteResult(id) {
  const r = RESTAURANTS_DATA.find(x => x.id === id);
  if (r) copyTextToClipboard(buildRouletteShareText(r), "📋 카톡에 붙여넣을 수 있게 복사했습니다");
}

async function shareRouletteResult(id) {
  const r = RESTAURANTS_DATA.find(x => x.id === id);
  if (!r) return;
  try {
    await navigator.share({ title: `오늘 점심: ${r.name}`, text: buildRouletteShareText(r) });
  } catch (e) {
    if (e && e.name !== "AbortError") copyRouletteResult(id);
  }
}

function rouletteGoToMap(id) {
  closeRouletteModal();
  focusCardInList(id);
  focusRestaurantOnMap(id);
}

function openLadderFromRoulette(id) {
  const r = RESTAURANTS_DATA.find(x => x.id === id);
  closeRouletteModal();
  openLadderModal(r ? `🍽️ 오늘 점심: ${r.name} — 음료는 누가 쏠까요?` : null);
}

// ==========================================================================
// 3. 음료 내기 사다리 타기
// ==========================================================================
const LADDER_MIN = 2;
const LADDER_MAX = 8;
const LADDER_ROWS = 12;
const LADDER_COL_W = 96;
const LADDER_HEIGHT = 320;
const LADDER_PASS = "통과";
const LADDER_COLORS = ["#ef4444", "#f97316", "#eab308", "#10b981", "#06b6d4", "#8b5cf6", "#ec4899", "#2563eb"];
const LADDER_NAMES_KEY = "ph_ladder_names";

const LADDER_PRESETS = [
  { key: "drink1", label: "🥤 음료수 1명이 쏜다", min: 2, build: n => ["🥤 음료 쏘기", ...Array(n - 1).fill(LADDER_PASS)] },
  { key: "coffee", label: "☕ 커피 1명 + 🍰 디저트 1명", min: 3, build: n => ["☕ 커피 쏘기", "🍰 디저트 쏘기", ...Array(n - 2).fill(LADDER_PASS)] },
  { key: "half", label: "💸 절반이 쏜다 (더치)", min: 2, build: n => { const k = Math.floor(n / 2); return [...Array(k).fill("💸 쏘기"), ...Array(n - k).fill(LADDER_PASS)]; } },
  { key: "order", label: "🔢 순서 정하기 (1등~N등)", min: 2, build: n => Array.from({ length: n }, (_, i) => `${i + 1}등`) },
  { key: "custom", label: "✍️ 직접 입력", min: 2, build: n => Array.from({ length: n }, (_, i) => (i === 0 ? "🥤 쏘기" : LADDER_PASS)) }
];

const ladderState = {
  n: 4,
  names: [],
  preset: "drink1",
  customResults: [],
  rungs: [],          // rungs[row][gapIndex] === true → gapIndex 와 gapIndex+1 열 사이 가로선
  slotResults: [],    // 아래 칸 j 에 들어간 결과 문구
  paths: {},          // startCol → 픽셀 폴리라인
  revealed: {},       // endCol → startCol
  animating: false
};

function loadLadderNames() {
  try {
    const raw = localStorage.getItem(LADDER_NAMES_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return arr.map(s => String(s).slice(0, 10));
    }
  } catch (e) { /* 프라이빗 모드 등 — 기본 이름 사용 */ }
  return [];
}

function saveLadderNames() {
  try { localStorage.setItem(LADDER_NAMES_KEY, JSON.stringify(ladderState.names)); } catch (e) { /* ignore */ }
}

function ensureLadderNames() {
  const names = ladderState.names;
  for (let i = 0; i < ladderState.n; i++) {
    if (!names[i]) names[i] = `참가자${i + 1}`;
  }
  ladderState.names = names.slice(0, LADDER_MAX);
}

function getLadderPreset() {
  return LADDER_PRESETS.find(p => p.key === ladderState.preset) || LADDER_PRESETS[0];
}

function ensureLadderCustomDefaults() {
  for (let i = 0; i < ladderState.n; i++) {
    if (ladderState.customResults[i] === undefined) ladderState.customResults[i] = (i === 0 ? "🥤 쏘기" : "");
  }
}

function buildLadderResults() {
  const n = ladderState.n;
  if (ladderState.preset === "custom") {
    ensureLadderCustomDefaults();
    const arr = [];
    for (let i = 0; i < n; i++) {
      const v = (ladderState.customResults[i] || "").trim();
      arr.push(v || LADDER_PASS);
    }
    return arr;
  }
  let preset = getLadderPreset();
  if (n < preset.min) preset = LADDER_PRESETS[0];
  return preset.build(n);
}

function openLadderModal(contextNote) {
  const overlay = document.getElementById("ladderModalOverlay");
  if (!overlay) return;
  closeRouletteModal();

  const note = document.getElementById("ladderContextNote");
  if (note) note.innerText = contextNote || "이름을 적고 위쪽 「▼ 타기」를 누르면 사다리를 타고 내려갑니다.";

  if (ladderState.names.length === 0) ladderState.names = loadLadderNames();
  ensureLadderNames();

  const sel = document.getElementById("ladderPresetSelect");
  if (sel) {
    if (sel.options.length === 0) sel.innerHTML = LADDER_PRESETS.map(p => `<option value="${p.key}">${p.label}</option>`).join("");
    sel.value = ladderState.preset;
  }

  overlay.classList.add("open");
  regenerateLadder();
}

function closeLadderModal() {
  const overlay = document.getElementById("ladderModalOverlay");
  if (overlay) overlay.classList.remove("open");
}

// 인원 스테퍼 숫자 및 ± 버튼 한계 표시
function renderLadderCountControl() {
  const countEl = document.getElementById("ladderCountText");
  if (countEl) countEl.textContent = ladderState.n;
  const btns = document.querySelectorAll(".ladder-stepper button");
  if (btns.length === 2) {
    btns[0].disabled = ladderState.n <= LADDER_MIN;
    btns[1].disabled = ladderState.n >= LADDER_MAX;
  }
}

function changeLadderCount(delta) {
  if (ladderState.animating) return;
  const next = Math.max(LADDER_MIN, Math.min(LADDER_MAX, ladderState.n + delta));
  if (next === ladderState.n) return;
  ladderState.n = next;
  ensureLadderNames();
  regenerateLadder();
}

function changeLadderPreset(key) {
  if (ladderState.animating) return;
  ladderState.preset = key;
  const sel = document.getElementById("ladderPresetSelect");
  if (sel && sel.value !== key) sel.value = key;
  regenerateLadder();
}

function updateLadderName(idx, value) {
  ladderState.names[idx] = (value || "").trim().slice(0, 10) || `참가자${idx + 1}`;
  saveLadderNames();
  renderLadderResultsRow();   // 공개된 결과 칸의 이름 갱신
  renderLadderSummary();
}

function updateLadderCustomResult(idx, value) {
  ladderState.customResults[idx] = value;
  // 결과 문구만 바뀌므로 칸 배치(순열)는 유지하고 문구만 다시 매핑
  const fresh = buildLadderResults();
  const perm = (ladderState.slotPerm && ladderState.slotPerm.length === fresh.length) ? ladderState.slotPerm : fresh.map((_, i) => i);
  ladderState.slotResults = perm.map(i => fresh[i]);
  renderLadderResultsRow();
  renderLadderSummary();
}

// 사다리 생성: 같은 행에서 이웃한 두 칸에 동시에 가로선이 오지 않게, 각 칸 사이에 최소 1개 가로선 보장
function regenerateLadder() {
  if (ladderState.animating) return;
  const n = ladderState.n;
  const gaps = n - 1;
  const rungs = [];
  for (let row = 0; row < LADDER_ROWS; row++) {
    const line = Array(gaps).fill(false);
    for (let g = 0; g < gaps; g++) {
      if (g > 0 && line[g - 1]) continue;
      if (Math.random() < 0.42) line[g] = true;
    }
    rungs.push(line);
  }
  for (let g = 0; g < gaps; g++) {
    if (rungs.some(line => line[g])) continue;
    for (let tries = 0; tries < 30; tries++) {
      const row = Math.floor(Math.random() * LADDER_ROWS);
      const line = rungs[row];
      if (!line[g - 1] && !line[g + 1]) { line[g] = true; break; }
    }
  }
  ladderState.rungs = rungs;

  const results = buildLadderResults();
  const perm = shuffleArray(results.map((_, i) => i));
  ladderState.slotPerm = perm;
  ladderState.slotResults = perm.map(i => results[i]);
  ladderState.paths = {};
  ladderState.revealed = {};

  renderLadderCountControl();
  renderLadderNamesRow();
  renderLadderCustomResults();
  renderLadderResultsRow();
  renderLadderSummary();
  drawLadder();
}

function ladderColX(col) {
  return col * LADDER_COL_W + LADDER_COL_W / 2;
}

function ladderRowY(row) {
  // row -1 = 맨 위, row = LADDER_ROWS = 맨 아래
  const top = 10, bottom = LADDER_HEIGHT - 10;
  const rowH = (bottom - top) / (LADDER_ROWS + 1);
  return top + (row + 1) * rowH;
}

function traceLadderPath(startCol) {
  const pts = [{ col: startCol, row: -1 }];
  let c = startCol;
  for (let row = 0; row < LADDER_ROWS; row++) {
    const line = ladderState.rungs[row];
    pts.push({ col: c, row });
    if (line[c]) {
      c += 1;
      pts.push({ col: c, row });
    } else if (c > 0 && line[c - 1]) {
      c -= 1;
      pts.push({ col: c, row });
    }
  }
  pts.push({ col: c, row: LADDER_ROWS });
  return { pixels: pts.map(p => ({ x: ladderColX(p.col), y: ladderRowY(p.row) })), endCol: c };
}

function setupLadderCanvas() {
  const canvas = document.getElementById("ladderCanvas");
  if (!canvas) return null;
  const width = ladderState.n * LADDER_COL_W;
  const dpr = window.devicePixelRatio || 1;
  if (canvas.width !== width * dpr || canvas.height !== LADDER_HEIGHT * dpr) {
    canvas.width = width * dpr;
    canvas.height = LADDER_HEIGHT * dpr;
  }
  canvas.style.width = width + "px";
  canvas.style.height = LADDER_HEIGHT + "px";
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { canvas, ctx, width };
}

function drawPolyline(ctx, pts, color, width, progress) {
  // progress: 0~1 폴리라인 길이 비율까지만 그림
  if (pts.length < 2) return;
  const segLens = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    segLens.push(d);
    total += d;
  }
  let remain = total * Math.max(0, Math.min(1, progress));
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) {
    const d = segLens[i - 1];
    if (remain >= d) {
      ctx.lineTo(pts[i].x, pts[i].y);
      remain -= d;
    } else {
      const ratio = d === 0 ? 0 : remain / d;
      ctx.lineTo(pts[i - 1].x + (pts[i].x - pts[i - 1].x) * ratio, pts[i - 1].y + (pts[i].y - pts[i - 1].y) * ratio);
      break;
    }
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();
}

function drawLadder(activePath) {
  const setup = setupLadderCanvas();
  if (!setup) return;
  const { ctx, width } = setup;
  const n = ladderState.n;
  ctx.clearRect(0, 0, width, LADDER_HEIGHT);

  // 세로 기둥
  for (let c = 0; c < n; c++) {
    ctx.beginPath();
    ctx.moveTo(ladderColX(c), ladderRowY(-1));
    ctx.lineTo(ladderColX(c), ladderRowY(LADDER_ROWS));
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.stroke();
  }
  // 가로 다리
  ladderState.rungs.forEach((line, row) => {
    line.forEach((has, g) => {
      if (!has) return;
      ctx.beginPath();
      ctx.moveTo(ladderColX(g), ladderRowY(row));
      ctx.lineTo(ladderColX(g + 1), ladderRowY(row));
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.stroke();
    });
  });
  // 완료된 경로
  Object.keys(ladderState.paths).forEach(startCol => {
    const idx = Number(startCol);
    drawPolyline(ctx, ladderState.paths[idx], LADDER_COLORS[idx % LADDER_COLORS.length], 5, 1);
  });
  // 진행 중 경로
  if (activePath) {
    drawPolyline(ctx, activePath.pixels, LADDER_COLORS[activePath.startCol % LADDER_COLORS.length], 5, activePath.progress);
    const head = polylinePoint(activePath.pixels, activePath.progress);
    if (head) {
      ctx.beginPath();
      ctx.arc(head.x, head.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = LADDER_COLORS[activePath.startCol % LADDER_COLORS.length];
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
}

function polylinePoint(pts, progress) {
  if (pts.length < 2) return null;
  let total = 0;
  const lens = [];
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    lens.push(d);
    total += d;
  }
  let remain = total * Math.max(0, Math.min(1, progress));
  for (let i = 1; i < pts.length; i++) {
    const d = lens[i - 1];
    if (remain <= d) {
      const ratio = d === 0 ? 0 : remain / d;
      return { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * ratio, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * ratio };
    }
    remain -= d;
  }
  return pts[pts.length - 1];
}

function runLadder(startCol) {
  return new Promise(resolve => {
    if (ladderState.animating || ladderState.paths[startCol]) { resolve(); return; }
    ladderState.animating = true;
    setLadderControlsDisabled(true);

    const { pixels, endCol } = traceLadderPath(startCol);
    const duration = 1300;
    const startTime = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;   // easeInOutQuad
      drawLadder({ pixels, startCol, progress: ease });
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        ladderState.paths[startCol] = pixels;
        ladderState.revealed[endCol] = startCol;
        ladderState.animating = false;
        setLadderControlsDisabled(false);
        renderLadderCountControl();
        drawLadder();
        renderLadderNamesRow();
        renderLadderResultsRow();
        renderLadderSummary();
        resolve();
      }
    };
    requestAnimationFrame(step);
  });
}

async function revealAllLadder() {
  if (ladderState.animating) return;
  for (let c = 0; c < ladderState.n; c++) {
    if (!ladderState.paths[c]) await runLadder(c);
  }
}

function setLadderControlsDisabled(disabled) {
  document.querySelectorAll(".ladder-go-btn, .ladder-action-btn, .ladder-stepper button, #ladderPresetSelect").forEach(el => {
    el.disabled = disabled;
  });
}

function renderLadderNamesRow() {
  const row = document.getElementById("ladderNamesRow");
  if (!row) return;
  row.innerHTML = Array.from({ length: ladderState.n }, (_, i) => {
    const color = LADDER_COLORS[i % LADDER_COLORS.length];
    const done = !!ladderState.paths[i];
    return `
      <div class="ladder-col" style="--c: ${color};">
        <input class="ladder-name-input" type="text" maxlength="10" value="${escapeHtmlAttr(ladderState.names[i] || "")}"
               onchange="updateLadderName(${i}, this.value)" onkeydown="event.stopPropagation()" aria-label="참가자 ${i + 1} 이름"/>
        <button type="button" class="ladder-go-btn" onclick="runLadder(${i})" ${done ? "disabled" : ""}>${done ? "✔ 완료" : "▼ 타기"}</button>
      </div>
    `;
  }).join("");
}

function renderLadderResultsRow() {
  const row = document.getElementById("ladderResultsRow");
  if (!row) return;
  row.innerHTML = Array.from({ length: ladderState.n }, (_, j) => {
    const startCol = ladderState.revealed[j];
    const label = ladderState.slotResults[j] || LADDER_PASS;
    if (startCol === undefined) {
      return `<div class="ladder-col"><div class="ladder-result-box">?</div></div>`;
    }
    const color = LADDER_COLORS[startCol % LADDER_COLORS.length];
    const isLoser = label !== LADDER_PASS;
    return `
      <div class="ladder-col" style="--c: ${color};">
        <div class="ladder-result-box revealed ${isLoser ? "loser" : ""}">
          <span class="ladder-result-label">${label}</span>
          <span class="ladder-result-who">${escapeHtmlText(ladderState.names[startCol] || "")}</span>
        </div>
      </div>
    `;
  }).join("");
}

function renderLadderCustomResults() {
  const wrap = document.getElementById("ladderCustomResults");
  if (!wrap) return;
  if (ladderState.preset !== "custom") {
    wrap.style.display = "none";
    wrap.innerHTML = "";
    return;
  }
  ensureLadderCustomDefaults();
  wrap.style.display = "flex";
  wrap.innerHTML = `
    <span class="ladder-setting-label">✍️ 결과 항목 (비우면 「통과」)</span>
    ${Array.from({ length: ladderState.n }, (_, i) => `
      <input type="text" maxlength="12" class="ladder-custom-input" placeholder="결과 ${i + 1}"
             value="${escapeHtmlAttr(ladderState.customResults[i] || "")}"
             oninput="updateLadderCustomResult(${i}, this.value)" onkeydown="event.stopPropagation()"/>
    `).join("")}
  `;
}

function renderLadderSummary() {
  const box = document.getElementById("ladderSummary");
  const revealBtn = document.getElementById("ladderRevealAllBtn");
  if (!box) return;
  const revealedCount = Object.keys(ladderState.revealed).length;
  if (revealBtn) revealBtn.style.display = revealedCount >= ladderState.n ? "none" : "";

  if (revealedCount < ladderState.n) {
    box.style.display = "none";
    return;
  }
  const losers = [];
  for (let j = 0; j < ladderState.n; j++) {
    const label = ladderState.slotResults[j];
    if (label !== LADDER_PASS) losers.push(`${escapeHtmlText(ladderState.names[ladderState.revealed[j]] || "")} → ${label}`);
  }
  box.style.display = "block";
  box.innerHTML = `
    <span>${losers.length ? `🎉 결과 확정! ${losers.join(" · ")}` : "🎉 결과 확정! 오늘은 모두 통과 — 각자 계산입니다."}</span>
    <button type="button" class="ladder-copy-btn" onclick="copyLadderResult()">📋 결과 복사</button>
  `;
}

function buildLadderShareText() {
  const lines = ["🪜 사다리 결과"];
  const note = document.getElementById("ladderContextNote")?.textContent?.trim();
  if (note && note.startsWith("🍽️")) lines.push(note);
  for (let j = 0; j < ladderState.n; j++) {
    const startCol = ladderState.revealed[j];
    if (startCol === undefined) continue;
    lines.push(`${ladderState.slotResults[j]} → ${ladderState.names[startCol]}`);
  }
  return lines.join("\n");
}

function copyLadderResult() {
  copyTextToClipboard(buildLadderShareText(), "📋 사다리 결과를 복사했습니다");
}

function escapeHtmlAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeHtmlText(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ==========================================================================
// 4. 빠른 결정: 동전 던지기 (참가자1 vs 참가자2) · 주사위 (참가자 중 1명)
// ==========================================================================
const DICE_FACES = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
let quickDecideTimer = null;

function setQuickDecideBusy(busy) {
  ["coinBtn", "diceBtn"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = busy;
  });
}

// frames 를 80ms 간격으로 돌리다가 durationMs 뒤에 finalHtml 을 보여 준다
function animateQuickDecide(frames, finalHtml, durationMs) {
  const out = document.getElementById("quickDecideResult");
  if (!out) return;
  if (quickDecideTimer) clearInterval(quickDecideTimer);
  setQuickDecideBusy(true);
  out.classList.remove("settled");
  let i = 0;
  const started = performance.now();
  quickDecideTimer = setInterval(() => {
    out.innerHTML = frames[i++ % frames.length];
    if (performance.now() - started >= durationMs) {
      clearInterval(quickDecideTimer);
      quickDecideTimer = null;
      out.innerHTML = finalHtml;
      out.classList.add("settled");
      setQuickDecideBusy(false);
    }
  }, 80);
}

function flipCoin() {
  ensureLadderNames();
  const heads = Math.random() < 0.5;
  const a = escapeHtmlText(ladderState.names[0] || "참가자1");
  const b = escapeHtmlText(ladderState.names[1] || "참가자2");
  animateQuickDecide(
    ["🪙 앞면?", "🪙 뒷면?"],
    heads ? `🪙 <b>앞면</b> → <b style="color:${LADDER_COLORS[0]}">${a}</b> <span class="quick-decide-sub">(뒷면: ${b})</span>`
          : `🪙 <b>뒷면</b> → <b style="color:${LADDER_COLORS[1]}">${b}</b> <span class="quick-decide-sub">(앞면: ${a})</span>`,
    1100
  );
}

function rollDice() {
  ensureLadderNames();
  const n = ladderState.n;
  const k = 1 + Math.floor(Math.random() * n);
  const name = escapeHtmlText(ladderState.names[k - 1] || `참가자${k}`);
  const face = v => (v <= 6 ? DICE_FACES[v] : `🎲${v}`);
  const frames = Array.from({ length: n }, (_, i) => `${face(i + 1)} ${i + 1}`);
  animateQuickDecide(
    frames,
    `${face(k)} <b>${k}</b> → <b style="color:${LADDER_COLORS[(k - 1) % LADDER_COLORS.length]}">${name}</b> <span class="quick-decide-sub">(1~${n} 중)</span>`,
    1200
  );
}

// ==========================================================================
// 5. 클립보드 복사 & 토스트
// ==========================================================================
let funToastTimer = null;

function showFunToast(message) {
  const el = document.getElementById("funToast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  if (funToastTimer) clearTimeout(funToastTimer);
  funToastTimer = setTimeout(() => el.classList.remove("show"), 2000);
}

async function copyTextToClipboard(text, successMessage) {
  let ok = false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      ok = true;
    }
  } catch (e) { /* 아래 폴백 */ }
  if (!ok) {
    // http 사내망 등 비보안 컨텍스트 폴백
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
  }
  showFunToast(ok ? (successMessage || "복사했습니다") : "복사에 실패했습니다. 텍스트를 직접 선택해 주세요.");
  return ok;
}

// ==========================================================================
// 6. 날씨 자동 추천 (Open-Meteo — 키 없음, 무료, 30분 캐시)
//    비/강수확률 높음 → ☔ 지하·건물 연결 식당,  체감 28°↑ → 🍜 면,  5°↓ → 🍲 국물
// ==========================================================================
const WEATHER_CACHE_KEY = "ph_weather_v1";
const WEATHER_TTL_MS = 30 * 60 * 1000;
const WEATHER_DISMISS_KEY = "ph_weather_dismissed";
let weatherInfo = null;

function weatherIcon(code) {
  if (code === 0) return "☀️";
  if (code <= 2) return "🌤️";
  if (code === 3) return "☁️";
  if (code <= 48) return "🌫️";
  if (code <= 57) return "🌦️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "🌨️";
  if (code <= 82) return "🌧️";
  return "⛈️";
}

function summarizeWeather(d) {
  const c = d.current || {};
  const code = c.weather_code ?? 0;
  const hour = parseInt(String(c.time || "").slice(11, 13), 10);
  const probs = (d.hourly && d.hourly.precipitation_probability) || [];
  let probMax = 0;
  if (Number.isInteger(hour)) {
    for (let h = hour; h < Math.min(hour + 3, probs.length); h++) probMax = Math.max(probMax, probs[h] || 0);
  }
  const rainNow = (c.precipitation || 0) > 0 || (c.rain || 0) > 0 || (code >= 51 && code <= 67) || (code >= 80);
  return {
    temp: Math.round(c.temperature_2m ?? 0),
    feels: Math.round(c.apparent_temperature ?? c.temperature_2m ?? 0),
    code, rainNow, probMax,
    icon: weatherIcon(code)
  };
}

async function loadWeather() {
  try {
    const raw = localStorage.getItem(WEATHER_CACHE_KEY);
    if (raw) {
      const cached = JSON.parse(raw);
      if (cached && Date.now() - cached.fetchedAt < WEATHER_TTL_MS && cached.data) {
        weatherInfo = summarizeWeather(cached.data);
        renderWeather();
        return;
      }
    }
  } catch (e) { /* 캐시 없음 */ }

  const url = "https://api.open-meteo.com/v1/forecast"
    + `?latitude=${HQ_CONFIG.lat}&longitude=${HQ_CONFIG.lng}`
    + "&current=temperature_2m,apparent_temperature,precipitation,rain,weather_code"
    + "&hourly=precipitation_probability&timezone=Asia%2FSeoul&forecast_days=1";
  try {
    const res = await fetch(url);
    if (!res.ok) return;
    const data = await res.json();
    try { localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), data })); } catch (e) { /* ignore */ }
    weatherInfo = summarizeWeather(data);
    renderWeather();
  } catch (e) {
    // 사내 프록시 차단 등 — 날씨 없이 조용히 동작
  }
}

function getWeatherSuggestion() {
  const w = weatherInfo;
  if (!w) return null;
  if (w.rainNow || w.probMax >= 50) {
    return {
      kind: "rain", themeKey: "rainy",
      text: w.rainNow ? `☔ 지금 비가 옵니다 (${w.temp}°)` : `🌧️ 3시간 내 강수확률 ${w.probMax}%`,
      sub: "우산 없이 갈 수 있는 지하·건물 연결 식당",
      btn: "☔ 지하·건물 연결만 보기"
    };
  }
  if (w.feels >= 28) {
    return { kind: "hot", themeKey: "noodle", text: `🥵 체감 ${w.feels}° 더운 날`, sub: "시원한 면 어때요?", btn: "🍜 면 땡기는 날 보기" };
  }
  if (w.temp <= 5) {
    return { kind: "cold", themeKey: "soup", text: `🥶 ${w.temp}° 추운 날`, sub: "뜨끈한 국물로 몸 녹이기", btn: "🍲 국물·해장 보기" };
  }
  return null;
}

function renderWeather() {
  const chip = document.getElementById("weatherChip");
  if (chip && weatherInfo) {
    chip.textContent = `${weatherInfo.icon} ${weatherInfo.temp}°`;
    chip.title = `삼성본관 현재 ${weatherInfo.temp}° (체감 ${weatherInfo.feels}°) · 3시간 내 강수확률 ${weatherInfo.probMax}% · Open-Meteo`;
  }
  renderWeatherBanner();
}

function renderWeatherBanner() {
  const banner = document.getElementById("weatherBanner");
  if (!banner) return;
  const sug = getWeatherSuggestion();
  let dismissed = false;
  try { dismissed = !!sug && sessionStorage.getItem(WEATHER_DISMISS_KEY) === sug.kind; } catch (e) { /* ignore */ }
  if (!sug || dismissed) {
    banner.style.display = "none";
    return;
  }
  const active = activeTheme === sug.themeKey;
  const count = countLunchTheme(sug.themeKey);
  banner.className = `weather-banner weather-${sug.kind}`;
  banner.style.display = "flex";
  banner.innerHTML = `
    <div class="weather-banner-text">
      <strong>${sug.text}</strong>
      <span>${sug.sub} ${count}곳</span>
    </div>
    <div class="weather-banner-actions">
      <button type="button" class="weather-banner-btn ${active ? "active" : ""}" onclick="setActiveTheme('${sug.themeKey}')">${active ? "✓ 적용 중 · 해제" : sug.btn}</button>
      <button type="button" class="weather-banner-close" onclick="dismissWeatherBanner('${sug.kind}')" title="오늘은 그만 보기">✕</button>
    </div>
  `;
}

function dismissWeatherBanner(kind) {
  try { sessionStorage.setItem(WEATHER_DISMISS_KEY, kind); } catch (e) { /* ignore */ }
  renderWeatherBanner();
}

// ==========================================================================
// 7. 초기화 & 공통 이벤트 (오버레이 클릭·ESC 닫기)
// ==========================================================================
function initLunchFun() {
  renderThemeBar();
  loadWeather();

  const rOverlay = document.getElementById("rouletteModalOverlay");
  if (rOverlay) rOverlay.addEventListener("click", e => { if (e.target === rOverlay) closeRouletteModal(); });

  const lOverlay = document.getElementById("ladderModalOverlay");
  if (lOverlay) lOverlay.addEventListener("click", e => { if (e.target === lOverlay) closeLadderModal(); });

  window.addEventListener("keydown", e => {
    if (e.key === "Escape") { closeRouletteModal(); closeLadderModal(); }
  });

  // 휠은 CSS 픽셀 비율이 바뀌면(줌 등) 다시 그린다
  window.addEventListener("resize", () => {
    if (isRouletteOpen() && !rouletteSpinning) drawRouletteWheel();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLunchFun);
} else {
  initLunchFun();
}

// 인라인 onclick 용 전역 바인딩
window.setActiveTheme = setActiveTheme;
window.matchesLunchTheme = matchesLunchTheme;
window.getLunchThemeLabel = getLunchThemeLabel;
window.openRouletteModal = openRouletteModal;
window.closeRouletteModal = closeRouletteModal;
window.spinRoulette = spinRoulette;
window.rouletteGoToMap = rouletteGoToMap;
window.openLadderFromRoulette = openLadderFromRoulette;
window.openLadderModal = openLadderModal;
window.closeLadderModal = closeLadderModal;
window.changeLadderCount = changeLadderCount;
window.changeLadderPreset = changeLadderPreset;
window.updateLadderName = updateLadderName;
window.updateLadderCustomResult = updateLadderCustomResult;
window.regenerateLadder = regenerateLadder;
window.revealAllLadder = revealAllLadder;
window.runLadder = runLadder;
window.copyRouletteResult = copyRouletteResult;
window.shareRouletteResult = shareRouletteResult;
window.copyLadderResult = copyLadderResult;
window.flipCoin = flipCoin;
window.rollDice = rollDice;
window.copyTextToClipboard = copyTextToClipboard;
window.dismissWeatherBanner = dismissWeatherBanner;
