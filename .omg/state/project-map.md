# Project Map: powerhouse

## Directory Structure & Responsibilities

```
powerhouse/
├── .omg/                    # Oh My Antigravity / Gemini state & memory
│   ├── hooks/               # Lifecycle hooks
│   ├── memory/              # Durable domain topic notes
│   ├── rules/               # Modular task rules
│   └── state/               # Workflow state, deep-init, taskboard, doctor
├── public/                  # Static frontend client
│   ├── css/
│   │   ├── lunch-guide.css  # Leaflet custom pins, layout, animations
│   │   └── style.css
│   ├── js/
│   │   ├── lunch-data.js    # Master 66 restaurant dataset (verified)
│   │   └── lunch-guide.js   # Map engine & UI interaction logic
│   ├── lunch-guide.html     # Primary restaurant guide page
│   └── index.html
├── api/                     # Serverless endpoints
├── server/                  # Node.js backend server
├── ANTIGRAVITY.md           # Antigravity project config
├── GEMINI.md                # Gemini context & instructions
└── MEMORY.md                # Project memory index
```

## Hotspots & Dependencies
- `public/js/lunch-guide.js`: Leaflet 지도 객체 및 마커 클릭 이벤트 바인딩.
- `public/js/lunch-data.js`: 66곳 매장의 식사 가능 여부(`breakfast`, `lunch`, `dinner`) 및 실측 위경도(`lat`, `lng`).
