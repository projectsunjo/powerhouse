// 식권대장 66개 전체 가맹점 정적 데이터베이스 (공지사항 100% 전수 반영 + 네이버/카카오 실측 좌표)
const HQ_CONFIG = {
  name: "삼성본관 (기준점)",
  address: "서울 중구 세종대로 67 (태평로2가 250)",
  lat: 37.5623905,
  lng: 126.9755797
};

const BUILDING_CLUSTERS = {
  "씨티스퀘어": {
    "name": "씨티스퀘어",
    "buildingName": "씨티스퀘어빌딩 B1F",
    "lat": 37.5631062,
    "lng": 126.9752236,
    "branchDir": "right",
    "ids": [
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      66
    ]
  },
  "대한상공회의소": {
    "name": "대한상공회의소",
    "buildingName": "대한상의회관 B2F",
    "lat": 37.5607137,
    "lng": 126.9737753,
    "branchDir": "right",
    "ids": [
      37,
      38,
      44,
      45,
      47,
      49
    ]
  },
  "퍼시픽타워": {
    "name": "퍼시픽타워",
    "buildingName": "퍼시픽타워 B1F/1F",
    "lat": 37.5613584,
    "lng": 126.9730165,
    "branchDir": "up-right",
    "ids": [
      50,
      52
    ]
  }
};

const RESTAURANTS_DATA = [
  {
    "id": 1,
    "name": "커피빈 삼성본관점",
    "category": "카페",
    "badge": "🌅 조식가능 · 🌙 저녁가능",
    "rating": 4.3,
    "reviewCount": 213,
    "address": "서울 중구 세종대로 67 (삼성본관빌딩 1층)",
    "building": "삼성본관빌딩 1층",
    "phone": "02-720-5561",
    "hours": "평일 07:00-19:00 (주말 휴무)",
    "breakfast": true,
    "lunch": true,
    "dinner": true,
    "lat": 37.5623659,
    "lng": 126.9755491,
    "imageUrl": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA1MDlfMjUg%2FMDAxNzc4MjU5Nzk0MjUz.QJD4T31ZUmPsbcUwBlsBrKHpGeNy6vUmLC0mK5MKer4g.pphYkV4dDbFitWZHdunbhp1ayk8rYdb8M5-KWSo5eaAg.JPEG%2F%25C4%25BF%25C7%25C7%25BA%25F3_%25BF%25EC%25BA%25A311.jpeg%232250x3000&type=ff192_192",
    "summary": "바닐라라떼(6,300), 아메리카노(5,000), 베이글(3,800)",
    "tip": "출근길 조식 식권으로 모닝세트 결제 가능. 본관 1층이라 가장 가까움.",
    "menus": [
      {
        "name": "바닐라라떼(6",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "300)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "아메리카노(5",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "베이글(3",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "800)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%BB%A4%ED%94%BC%EB%B9%88%20%EC%82%BC%EC%84%B1%EB%B3%B8%EA%B4%80%EC%A0%90",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%BB%A4%ED%94%BC%EB%B9%88%20%EC%82%BC%EC%84%B1%EB%B3%B8%EA%B4%80%EC%A0%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5623659,126.9755491",
    "images": [
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA1MDlfMjUg%2FMDAxNzc4MjU5Nzk0MjUz.QJD4T31ZUmPsbcUwBlsBrKHpGeNy6vUmLC0mK5MKer4g.pphYkV4dDbFitWZHdunbhp1ayk8rYdb8M5-KWSo5eaAg.JPEG%2F%25C4%25BF%25C7%25C7%25BA%25F3_%25BF%25EC%25BA%25A311.jpeg%232250x3000&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDExMjZfMTI3%2FMDAxNzMyNjE2Nzk0MzUy.4AqEXhdL3hit-h7T5VM2iJ56IrhZZXn1njLPUXMP4p8g.YPhj8oRAoYs49sJACm_gjeeKkDcb8l710tsbXYIhNIog.GIF%2F134462865.gif%23375x500&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTA3MDFfMjU0%2FMDAxNzUxMzU3MTAwNjY2.0gCEm_Px1iXuiUrwn6EDd45A6xi7idAM60ieArd8G0gg.5vb_Yrlg707cJRPelIypohSZCCGw391ZBTDhEfO1-hog.JPEG%2FT_THE_COFFEE_BEAN_01.jpg%23900x900&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTA4MTJfMjU4%2FMDAxNzU0OTUyOTEzNzM5.p37nxlhwuaauNWQA_5q22mw3Pi_rEb3vfhiZJ_6jeGkg.QtZ_FlhsjpLgqY7hx1dyB4HUYKeoKuwRwNK50AEOzXkg.JPEG%2F900%25A3%25DF20250807%25A3%25DF082054.jpg%23900x900&type=ff192_192"
    ]
  },
  {
    "id": 2,
    "name": "술술돼지",
    "category": "한식",
    "badge": "🌙 저녁가능 · ⭐ 직장인인기",
    "rating": 4.5,
    "reviewCount": 116,
    "address": "서울 중구 세종대로11길 26 (1층) (세종대로11길 26 1층)",
    "building": "세종대로11길 26 1층",
    "phone": "매장 확인",
    "hours": "매일 07:00-22:00",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.562463,
    "lng": 126.9743991,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20240307_149%2F17097798954037o7uR_JPEG%2F20231130_110602.jpg",
    "summary": "제육백반정식(9,000), 삼겹살(15,000), 김치찌개(8,500)",
    "tip": "반찬 가짓수가 많고 푸짐한 백반 맛집. 저녁 회식으로도 인기.",
    "menus": [
      {
        "name": "제육백반정식(9",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "삼겹살(15",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "김치찌개(8",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%8B%9C%EC%B2%AD%EC%97%AD%20%EC%88%A0%EC%88%A0%EB%8F%BC%EC%A7%80",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%88%A0%EC%88%A0%EB%8F%BC%EC%A7%80%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.562463,126.9743991",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20240307_149%2F17097798954037o7uR_JPEG%2F20231130_110602.jpg",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA5MDlfNiAg%2FMDAxNzg4OTYzNTkyODIy.0u0NZIDiyTcIHD1IHUAYMpkWEYLZoPFHBRu4bJLaSQQg.A9evk_V7RVbzExU5rkVF9kWQXFrINh2nUmVq--h_ApUg.GIF%2F1425675797.gif%23282x500&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA4MjRfNjgg%2FMDAxNzg3NTQwOTExNjk1.Fy7ra8W-4vOTOQmaCUrSCrfMl29xLPBduVsTQYekiCMg.5hnZ2wRLknJMZfdVej26kcBCgjLXT3_a8n3zPskYy38g.JPEG%2FKakaoTalk_20260824_100347604.jpg%234000x3000&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA5MDNfMTkw%2FMDAxNzg4NDIxMDk4MDIw.5cr_pK9RpyF4QUS_EM8xCaOSVuJcsJpU03n1JuZ5YeIg.XYkrvACcl9xAnSKsVFO8BEv2doSI8E0R1aoKm97uzlgg.JPEG%2Foutput%25A3%25DF1836136703.jpg%23893x893&type=f238_208"
    ]
  },
  {
    "id": 3,
    "name": "대독장 서소문점",
    "category": "한식",
    "badge": "⭐ 직장인인기",
    "rating": 4.6,
    "reviewCount": 334,
    "address": "서울 중구 서소문동 120-12 (2층) (서소문동 120-12 2층)",
    "building": "서소문동 120-12 2층",
    "phone": "02-752-5500",
    "hours": "평일 운영 (식권대장 이용시간 준수)",
    "breakfast": false,
    "lunch": true,
    "dinner": false,
    "lat": 37.5623176,
    "lng": 126.9742936,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNTA2MTlfMjI3%2FMDAxNzUwMzA2MzE5ODQ2.4oHuIA6luuGxgEktEW63U_QG_PL0lngvHUWOgf7c2Gkg.btS5Kw6-lFUea_qMj_f2ECMFek2kAqtBd7LiVJSuwPAg.JPEG%2FKakaoTalk_20250619_115259114_04.jpg%2F3000x2250",
    "summary": "김치찌개정식(9,500), 두루치기(18,000), 라면사리(1,500)",
    "tip": "계란후라이 셀프 무제한 + 갓 지은 귀리밥 제공. 점심 피크에 대기 있음.",
    "menus": [
      {
        "name": "김치찌개정식(9",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "두루치기(18",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "라면사리(1",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EB%8C%80%EB%8F%85%EC%9E%A5%20%EC%84%9C%EC%86%8C%EB%AC%B8%EC%A0%90",
    "kakaoUrl": "https://map.kakao.com/link/map/%EB%8C%80%EB%8F%85%EC%9E%A5%20%EC%84%9C%EC%86%8C%EB%AC%B8%EC%A0%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5623176,126.9742936",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNTA2MTlfMjI3%2FMDAxNzUwMzA2MzE5ODQ2.4oHuIA6luuGxgEktEW63U_QG_PL0lngvHUWOgf7c2Gkg.btS5Kw6-lFUea_qMj_f2ECMFek2kAqtBd7LiVJSuwPAg.JPEG%2FKakaoTalk_20250619_115259114_04.jpg%2F3000x2250",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNTA2MTlfODIg%2FMDAxNzUwMzAxODQ4ODE3.gdIhj-cmo0kg31_buVhC6h0cyklqrf_WzeEg_I5WJ0Ig.ga1JmYR604uqAc7bQTnqNc2mzo-OONFbVY3x2lY7QfYg.JPEG%2FKakaoTalk_20250619_115259114_11.jpg%2F3024x4032",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA0MTJfMTEg%2FMDAxNzc1OTk5MDU1NDUy.AOiPSrsCEmSv6T5L0nz94pmiQsCTKCKstgzZf9V9xrgg.d07Z4PL2ngJP3uB_zuy9B6RO47DLx6vFmRp8Xx_M0j0g.JPEG%2F20260325_123522.jpg%2F2992x2992",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA0MTJfMjgx%2FMDAxNzc1OTk5MDIzNjM5.nolROVTS9PDcSeNGY-o0zS2CQ2n8t9NM2OpAs5hrqt8g.b2OoBDcWUIN-I9LD0eTRCPVOOE1-DvXuteDoTEX7aB8g.JPEG%2F20260325_121255.jpg%2F2992x2992"
    ]
  },
  {
    "id": 4,
    "name": "누나홀닭(시청역점)",
    "category": "한식",
    "badge": "🌙 저녁가능 · ⭐ 직장인인기",
    "rating": 4.7,
    "reviewCount": 300,
    "address": "서울 중구 세종대로11길 30",
    "building": "세종대로11길 30",
    "phone": "02-3789-2599",
    "hours": "평일 운영 (식권대장 이용시간 준수)",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.5622975,
    "lng": 126.974292,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&type=w278_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260430_222%2F1777533793073BN7K8_JPEG%2F3_%25B9%25D9%25BB%25E7%25C4%25AD%25B4%25DF%25C2%25CC%25B9%25F0%25C0%25CC.jpg",
    "summary": "바사칸닭(19,900), 쌈닭(22,900), 떡볶이(7,000)",
    "tip": "오븐에 구워 바삭하고 담백한 치킨. 저녁 식권 회식 1순위.",
    "menus": [
      {
        "name": "바사칸닭(19",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "900)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "쌈닭(22",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "900)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "떡볶이(7",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EB%88%84%EB%82%98%ED%99%80%EB%8B%AD%20%EC%8B%9C%EC%B2%AD%EC%97%AD%EC%A0%90",
    "kakaoUrl": "https://map.kakao.com/link/map/%EB%88%84%EB%82%98%ED%99%80%EB%8B%AD%20%EC%8B%9C%EC%B2%AD%EC%97%AD%EC%A0%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5622975,126.974292",
    "buildingLat": 37.56215,
    "buildingLng": 126.97425,
    "buildingName": "서소문 먹자골목",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&type=w278_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260430_222%2F1777533793073BN7K8_JPEG%2F3_%25B9%25D9%25BB%25E7%25C4%25AD%25B4%25DF%25C2%25CC%25B9%25F0%25C0%25CC.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w278_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260430_18%2F17775337841392Fflv_JPEG%2F4_%25C3%25CB%25C3%25CB%25C4%25AD%25B4%25DF%25C2%25CC%25B9%25F0%25C0%25CC.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w278_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260430_216%2F1777533774821reedj_JPEG%2F5_%25C8%25C4%25B7%25B9%25BD%25AC%25BD%25D3%25B4%25DF%25C2%25CC%25B9%25F0%25C0%25CC.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w278_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260430_145%2F1777533760799fdWkz_JPEG%2F6_%25B9%25D9%25BA%25A3%25C5%25A5%25BD%25D3%25B4%25DF%25C2%25CC%25B9%25F0%25C0%25CC.jpg"
    ]
  },
  {
    "id": 5,
    "name": "우림정",
    "category": "한식",
    "badge": "🌙 저녁가능",
    "rating": 4.3,
    "reviewCount": 213,
    "address": "서울 중구 세종대로11길 33-3",
    "building": "세종대로11길 33-3",
    "phone": "02-752-5939",
    "hours": "월-토 10:00-21:30 (일요일 휴무)",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.5619838,
    "lng": 126.9741807,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20221204_66%2F1670165715844nhGNk_JPEG%2FScreenshot_20221204_235055_Instagram.jpg",
    "summary": "따닥불고기(14,000), 부대찌개(9,000), 제육볶음(9,500)",
    "tip": "숯불향 가득한 언양식 따닥불고기와 칼칼한 부대찌개 조합 인기.",
    "menus": [
      {
        "name": "따닥불고기(14",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "부대찌개(9",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "제육볶음(9",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%8B%9C%EC%B2%AD%EC%97%AD%20%EC%9A%B0%EB%A6%BC%EC%A0%95",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%9A%B0%EB%A6%BC%EC%A0%95%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5619838,126.9741807",
    "buildingLat": 37.56215,
    "buildingLng": 126.97425,
    "buildingName": "서소문 먹자골목",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20221204_66%2F1670165715844nhGNk_JPEG%2FScreenshot_20221204_235055_Instagram.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20190914_87%2F1568453437803cm4ff_JPEG%2FdVvy8O9vV3k_bpEWKu2zl10G.jpeg.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20200212_40%2F15815107398130FoHO_JPEG%2F0ZP0MR3Ke0Fnx0sXPgamOww2.jpeg.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210130_259%2F1611991571502ijiXj_JPEG%2FR1KsKhAqBPBqUMGrkl_ZXEIE.jpg"
    ]
  },
  {
    "id": 6,
    "name": "바스버거 서소문시청역점",
    "category": "양식",
    "badge": "🌙 저녁가능 · ⭐ 직장인인기",
    "rating": 4.7,
    "reviewCount": 250,
    "address": "서울 중구 세종대로11길 33 (세종대로11길 33 B1)",
    "building": "세종대로11길 33 B1",
    "phone": "02-310-9188",
    "hours": "월-금 11:00-22:00, 토-일 11:00-21:00",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.5620973,
    "lng": 126.9741569,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20241210_266%2F1733818164122IICU1_JPEG%2F49.JPG",
    "summary": "바스버거(7,800), 더블바스버거(9,800), 감자칩(무료무한)",
    "tip": "매장에서 직접 튀긴 생감자칩 무제한 셀프바 이용 가능.",
    "menus": [
      {
        "name": "바스버거(7",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "800)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "더블바스버거(9",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "800)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "감자칩",
        "price": "무료무한",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EB%B0%94%EC%8A%A4%EB%B2%84%EA%B1%B0%20%EC%84%9C%EC%86%8C%EB%AC%B8%EC%8B%9C%EC%B2%AD%EC%97%AD%EC%A0%90",
    "kakaoUrl": "https://map.kakao.com/link/map/%EB%B0%94%EC%8A%A4%EB%B2%84%EA%B1%B0%20%EC%84%9C%EC%86%8C%EB%AC%B8%EC%8B%9C%EC%B2%AD%EC%97%AD%EC%A0%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5620973,126.9741569",
    "buildingLat": 37.56215,
    "buildingLng": 126.97425,
    "buildingName": "서소문 먹자골목",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20241210_266%2F1733818164122IICU1_JPEG%2F49.JPG",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20241210_297%2F1733818151864HtNkE_PNG%2F1.png",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA5MTVfOTgg%2FMDAxNzg5NDYzODA5NjM5.wxau-T9W8Jo0gOcCBXVxlIcgCogoWweilOPPuQVL8LYg.hzgGzFBKSewaEWIFIJ9t9zTQJgDBlulPv4IBMxAbfLMg.JPEG%2FIMG%25EF%25BC%25BF8897.JPG%2F900x1200",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjAzMjBfMjk0%2FMDAxNzc0MDE0OTQzMDQ1.H8e1O8wL5-RrCesE-0egNcIP29lzhSI5OH3kk6b7M3Eg.g57aI3hFPx3yd2vHP8_xpia6yLHJovr2VDoE_qc9neMg.JPEG%2F%25EC%258B%259C%25EC%25B2%25AD%25EC%2597%25AD_%25ED%2596%2584%25EB%25B2%2584%25EA%25B1%25B0_%25EB%25A7%259B%25EC%25A7%2591_%25EB%25B0%2594%25EC%258A%25A4%25EB%25B2%2584%25EA%25B1%25B0_%25EC%2584%259C%25EC%2586%258C%25EB%25AC%25B8_BTS_%25EA%25B3%25B5%25EC%2597%25B0_%25EB%25B3%25B4%25EA%25B8%25B0%25EC%25A0%2584_%25EC%2584%259C%25EC%259A%25B8_%25EA%25B4%2591%25ED%2599%2594%25EB%25AC%25B8_%25EA%25B0%2580%25EC%2584%25B1%25EB%25B9%2584_%25EC%2588%2598%25EC%25A0%259C%25EB%25B2%2584%25EA%25B1%25B0_%25ED%2588%25AC%25EC%2596%25B4_(3).jpg%2F800x800"
    ]
  },
  {
    "id": 7,
    "name": "하나센돈까스",
    "category": "일식",
    "badge": "🌙 저녁가능 · ⭐ 직장인인기",
    "rating": 4.8,
    "reviewCount": 204,
    "address": "서울 중구 세종대로 70 (세종대로 70 1층)",
    "building": "세종대로 70 1층",
    "phone": "02-773-1060",
    "hours": "월-금 10:00-22:00 (토·일 휴무)",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.5623635,
    "lng": 126.9766278,
    "imageUrl": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA5MTRfMjQ2%2FMDAxNzg5MzU5NjgxOTAw.f03XU6ITlFDMBisQwnbyUCRO6Q2BvCBDe28qUv2Qzxsg.isPCSV4IalqaXdG6r54qsXu7ycp-NvN9bgnLg1QhhaIg.PNG%2Fimage.png%231080x1440&type=ff192_192",
    "summary": "뚝배기김치돈까스(11,000), 로스가츠(10,500), 치즈돈까스(12,500)",
    "tip": "얼큰 칼칼한 뚝배기 김치돈까스가 시그니처. 쌀쌀한 날 최고.",
    "menus": [
      {
        "name": "뚝배기김치돈까스(11",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "로스가츠(10",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "치즈돈까스(12",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%8B%9C%EC%B2%AD%EC%97%AD%20%ED%95%98%EB%82%98%EC%84%BC%EB%8F%88%EA%B9%8C%EC%8A%A4",
    "kakaoUrl": "https://map.kakao.com/link/map/%ED%95%98%EB%82%98%EC%84%BC%EB%8F%88%EA%B9%8C%EC%8A%A4%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5623635,126.9766278",
    "images": [
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA5MTRfMjQ2%2FMDAxNzg5MzU5NjgxOTAw.f03XU6ITlFDMBisQwnbyUCRO6Q2BvCBDe28qUv2Qzxsg.isPCSV4IalqaXdG6r54qsXu7ycp-NvN9bgnLg1QhhaIg.PNG%2Fimage.png%231080x1440&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA3MDlfMTcg%2FMDAxNzgzNTkxODE0MDIw.jqUerb5Hs67Rjm--tWr_U5OJEE6MukKn4EKZ_9eJQO0g.1tprke3BuNGbKaRIaIQ4FH0bXW4X7i6GwtLGc1Jw_T8g.JPEG%2FIMG%25A3%25DF0106.jpg%23900x1200&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDExMjNfMTA5%2FMDAxNzMyMzUwNTk4MjE0.mdhh0P5IwsZp09o6XDayRyCSMdAcZOjMV4GppPkvzGgg.SHXGZ3ehyeINTFAhUJUR7VKmnkf5ukdN6qQ48ZreOX0g.JPEG%2Foutput_3942259464.jpg%23900x724&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTA1MjVfNzIg%2FMDAxNzQ4MTc2MTkzMzM3.4q2Ce5epbgcYKD2ky0K1EHYMpljx96ACpSGZMSVsG2Yg.hDeDfyFt_HgK9EJ8aZIvIO4wkfmgmgFHk-_9-j2nczkg.JPEG%2FIMG%25A3%25DF2148.jpg%23900x676&type=ff192_192"
    ]
  },
  {
    "id": 8,
    "name": "본뼈감자탕",
    "category": "한식",
    "badge": "🌙 저녁가능",
    "rating": 4.4,
    "reviewCount": 257,
    "address": "서울 중구 세종대로11길 30 (세종대로11길 30 1층)",
    "building": "세종대로11길 30 1층",
    "phone": "매장 확인",
    "hours": "평일 운영 (식권대장 이용시간 준수)",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.5622803,
    "lng": 126.9741781,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20241014_270%2F1728869297572dgRhz_JPEG%2FKakaoTalk_20241007_113705362_04.jpg",
    "summary": "뼈해장국(10,000), 뼈구이(34,000), 감자탕(32,000)",
    "tip": "살코기가 부드럽고 국물이 진한 뼈해장국. 저녁 매콤 뼈구이 별미.",
    "menus": [
      {
        "name": "뼈해장국(10",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "뼈구이(34",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "감자탕(32",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%8B%9C%EC%B2%AD%EC%97%AD%20%EB%B3%B8%EB%BC%88%EA%B0%90%EC%9E%90%ED%83%95",
    "kakaoUrl": "https://map.kakao.com/link/map/%EB%B3%B8%EB%BC%88%EA%B0%90%EC%9E%90%ED%83%95%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5622803,126.9741781",
    "buildingLat": 37.56215,
    "buildingLng": 126.97425,
    "buildingName": "서소문 먹자골목",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20241014_270%2F1728869297572dgRhz_JPEG%2FKakaoTalk_20241007_113705362_04.jpg",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA5MTdfMTE5%2FMDAxNzg5NjUzMDMwMTUw.SXE7Nc_7KAs2GrnZwCxhmSkuRBz2nrVMv5sK9i1GiK0g.07vsAfx6HSVOY_euOfLNNSxG_VTi_KukU7I6cTBdsfAg.JPEG%2F900_20260913_164709.jpg%23900x675&type=f238_208",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA5MTdfMjQ5%2FMDAxNzg5NjUzMDgyMzAw.8WZRrJI51r6or2g1zrrisOtz0oLhL1hm2f6saOKC9MAg.5G8sd28nYVY3a4NnR6bFqu2bL5DkukZyc4Bhvs-hGvAg.JPEG%2F900_20260913_142023.jpg%23900x675&type=f238_208",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA5MTdfMjcz%2FMDAxNzg5NjUzMDgyMzIx.ESdYPbQsZb-JVxF9hRf2iT79fP6MWqW_WNBKgFsMolAg.2tHjyheoKS-S6SkW1cY4UPQSMBqqF299vcUMj_HDR_kg.JPEG%2F900_20260913_144546.jpg%23900x1200&type=f238_208"
    ]
  },
  {
    "id": 9,
    "name": "쪽삼상회",
    "category": "한식",
    "badge": "🌙 저녁가능 · ⭐ 직장인인기",
    "rating": 4.6,
    "reviewCount": 190,
    "address": "서울 중구 세종대로 68 (1층 102호) (세종대로 68 1층)",
    "building": "세종대로 68 1층",
    "phone": "02-6953-8282",
    "hours": "매일 11:00-22:30 (브레이크 15:00-17:00)",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.5622675,
    "lng": 126.9767006,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250428_34%2F1745835614016HxWAD_JPEG%2FIMG_5583.jpeg",
    "summary": "통삼겹살(16,000), 쪽갈비(17,000), 김치찌개(8,000)",
    "tip": "숯불 초벌구이 삼겹살과 매콤달콤한 쪽갈비 전문점.",
    "menus": [
      {
        "name": "통삼겹살(16",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "쪽갈비(17",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "김치찌개(8",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%8B%9C%EC%B2%AD%EC%97%AD%20%EC%AA%BD%EC%82%BC%EC%83%81%ED%9A%8C",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%AA%BD%EC%82%BC%EC%83%81%ED%9A%8C%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5622675,126.9767006",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250428_34%2F1745835614016HxWAD_JPEG%2FIMG_5583.jpeg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250603_293%2F1748959747480Fbeho_JPEG%2FIMG_6874.jpeg",
      "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250428_34%2F1745835614016HxWAD_JPEG%2FIMG_5583.jpeg",
      "https://search.pstatic.net/common/?autoRotate=true&quality=95&type=f&size=464x464&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250608_268%2F1749356090084uV9Xg_JPEG%2FResized_1000068371_1748231525068.jpeg"
    ]
  },
  {
    "id": 10,
    "name": "써브웨이(시청점)",
    "category": "양식",
    "badge": "🌅 조식가능 · 🌙 저녁가능 · ⭐ 직장인인기",
    "rating": 4.8,
    "reviewCount": 194,
    "address": "서울 중구 세종대로 68 (세종대로 68 1층)",
    "building": "세종대로 68 1층",
    "phone": "02-777-9200",
    "hours": "07:30-21:30",
    "breakfast": true,
    "lunch": true,
    "dinner": true,
    "lat": 37.5622691,
    "lng": 126.976597,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&type=w278_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260803_286%2F1785767461174sEKIE_JPEG%2F%25BD%25BA%25C5%25D7%25C0%25CC%25C5%25A9%25C4%25A1%25C1%25EE.jpg",
    "summary": "이탈리안BMT(6,900), 에그마요(5,500), 로티세리치킨(7,300)",
    "tip": "아침(조식) 모닝 샌드위치 세트 가능. 바쁜 직장인 빠른 한 끼.",
    "menus": [
      {
        "name": "이탈리안BMT(6",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "900)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "에그마요(5",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "로티세리치킨(7",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "300)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%8D%A8%EB%B8%8C%EC%9B%A8%EC%9D%B4%20%EC%8B%9C%EC%B2%AD%EC%A0%90",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%8D%A8%EB%B8%8C%EC%9B%A8%EC%9D%B4%20%EC%8B%9C%EC%B2%AD%EC%A0%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5622691,126.976597",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&type=w278_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260803_286%2F1785767461174sEKIE_JPEG%2F%25BD%25BA%25C5%25D7%25C0%25CC%25C5%25A9%25C4%25A1%25C1%25EE.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w278_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260803_216%2F1785767504194PTWb6_JPEG%2F%25B7%25CE%25C6%25BC%25BC%25BC%25B8%25AE%25B9%25D9%25BA%25F1%25C5%25A5.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w278_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260803_44%2F1785767544133yYdFx_JPEG%2F%25B7%25CE%25BD%25BA%25C6%25AE_%25C4%25A1%25C5%25B2_%25BE%25C6%25BA%25B8%25C4%25AB%25B5%25B5.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w278_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260316_25%2F1773671688272Rj47g_PNG%2F%25C0%25E1%25BA%25C0.png"
    ]
  },
  {
    "id": 11,
    "name": "소문밥상",
    "category": "한식",
    "badge": "🌅 조식가능 · 🌙 저녁가능",
    "rating": 4.3,
    "reviewCount": 326,
    "address": "서울 중구 서소문로 인근 (위치 추정) (서소문로 일대)",
    "building": "서소문로 일대",
    "phone": "매장 확인",
    "hours": "월-금 10:00-22:00 (브레이크 15:00-17:00, 토·일 휴무)",
    "breakfast": true,
    "lunch": true,
    "dinner": true,
    "lat": 37.56325,
    "lng": 126.97575,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260709_237%2F17835568090916lVbK_JPEG%2FKakaoTalk_20260709_090112562_06.jpg",
    "summary": "가정식백반(8,500), 제육볶음(9,500), 오징어볶음(10,000)",
    "tip": "조식 지원 매장. 매일 바뀌는 반찬과 집밥 스타일 백반.",
    "menus": [
      {
        "name": "가정식백반(8",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "제육볶음(9",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "오징어볶음(10",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%8B%9C%EC%B2%AD%EC%97%AD%20%EC%84%9C%EC%86%8C%EB%AC%B8%20%EC%86%8C%EB%AC%B8%EB%B0%A5%EC%83%81",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%86%8C%EB%AC%B8%EB%B0%A5%EC%83%81%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.56325,126.97575",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260709_237%2F17835568090916lVbK_JPEG%2FKakaoTalk_20260709_090112562_06.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260709_6%2F1783556796174BT4f4_JPEG%2FKakaoTalk_20260709_090112562_01.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA4MDdfOTAg%2FMDAxNzg2MDM0MDU4NTk1.2iL1IzIdSh4t-IigLDcLSHjEevWW2n9nsaeGfkGzxj0g.VUgxktQofZkv38vLqDG1x_2l_Bxob_WAAJXWxuMsx5Mg.JPEG%2FIMG_0839.JPG%2F3024x4032",
      "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260709_237%2F17835568090916lVbK_JPEG%2FKakaoTalk_20260709_090112562_06.jpg"
    ]
  },
  {
    "id": 12,
    "name": "본도시락 서울시청점",
    "category": "한식",
    "badge": "🌙 저녁가능",
    "rating": 4.4,
    "reviewCount": 310,
    "address": "서울 중구 태평로2가 69-12",
    "building": "태평로2가 69-12",
    "phone": "02-3789-4282",
    "hours": "평일 09:00-20:30, 토 09:00-15:00 (일요일 휴무)",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.562239,
    "lng": 126.9768228,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260820_141%2F1787180445357rjncc_JPEG%2F2608_%25BA%25BB%25B5%25B5%25BD%25C3%25B6%25F4_8%25BF%25F9_%25B3%25D7%25C0%25CC%25B9%25F6%25BD%25BA%25B8%25B6%25C6%25AE%25C7%25C3%25B7%25B9%25C0%25CC%25BD%25BA_750X553.jpg",
    "summary": "바싹불고기제육(10,400), 광양불고기(9,900), 샐러드도시락(8,500)",
    "tip": "사무실 테이크아웃이나 회의용 도시락 식권 결제 편리.",
    "menus": [
      {
        "name": "바싹불고기제육(10",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "400)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "광양불고기(9",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "900)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "샐러드도시락(8",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EB%B3%B8%EB%8F%84%EC%8B%9C%EB%9D%BD%20%EC%84%9C%EC%9A%B8%EC%8B%9C%EC%B2%AD%EC%A0%90",
    "kakaoUrl": "https://map.kakao.com/link/map/%EB%B3%B8%EB%8F%84%EC%8B%9C%EB%9D%BD%20%EC%84%9C%EC%9A%B8%EC%8B%9C%EC%B2%AD%EC%A0%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.562239,126.9768228",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260820_141%2F1787180445357rjncc_JPEG%2F2608_%25BA%25BB%25B5%25B5%25BD%25C3%25B6%25F4_8%25BF%25F9_%25B3%25D7%25C0%25CC%25B9%25F6%25BD%25BA%25B8%25B6%25C6%25AE%25C7%25C3%25B7%25B9%25C0%25CC%25BD%25BA_750X553.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260709_41%2F1783551827128Q7npk_JPEG%2Fdo-messenger_screenshot.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260610_75%2F1781091355745e06XJ_JPEG%2F2606_%25BA%25BB%25B5%25B5%25BD%25C3%25B6%25F4_%25BF%25A9%25B8%25A7%25BD%25C5%25B8%25DE%25B4%25BA_%25BF%25C2%25B6%25F3%25C0%25CE_%25BD%25BA%25B8%25B6%25C6%25AE%25C7%25C3%25B7%25B9%25C0%25CC%25BD%25BA_2.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260414_179%2F1776122762960nQ2hd_JPEG%2F2602_%25BA%25BB%25B5%25B5%25BD%25C3%25B6%25F4_%25BA%25BD%25BD%25C5%25B8%25DE%25B4%25BA_%25B3%25D7%25C0%25CC%25B9%25F6%25BD%25BA%25B8%25B6%25C6%25AE%25C7%25C3%25B7%25B9%25C0%25CC%25BD%25BA_2.jpg"
    ]
  },
  {
    "id": 13,
    "name": "창고43(시청점)",
    "category": "한식",
    "badge": "🌙 저녁가능",
    "rating": 4.2,
    "reviewCount": 182,
    "address": "서울 중구 서소문동 75 (서소문동 75 B1)",
    "building": "서소문동 75 B1",
    "phone": "02-6020-7955",
    "hours": "매일 11:30-22:00 (브레이크 15:00-17:30)",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.5629077,
    "lng": 126.9746765,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20211012_23%2F1634014746992Nd7Rd_JPEG%2F%25C0%25CC%25B9%25CC%25C1%25F6_14.jpg",
    "summary": "창고스페셜(48,000), 유자육회비빔밥(14,000), 매운갈비찜(16,000)",
    "tip": "점심 식사 단품(육회비빔밥, 갈비탕) 훌륭. 룸 완비 고급 한우.",
    "menus": [
      {
        "name": "창고스페셜(48",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "유자육회비빔밥(14",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "매운갈비찜(16",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%B0%BD%EA%B3%A043%20%EC%8B%9C%EC%B2%AD%EC%A0%90",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%B0%BD%EA%B3%A043%20%EC%8B%9C%EC%B2%AD%EC%A0%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5629077,126.9746765",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20211012_23%2F1634014746992Nd7Rd_JPEG%2F%25C0%25CC%25B9%25CC%25C1%25F6_14.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250513_51%2F174713012006399vMf_PNG%2F%25B3%25D7%25C0%25CC%25B9%25F6_%25C7%25C3%25B7%25B9%25C0%25CC%25BD%25BA06.png",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNDA2MjBfMTMx%2FMDAxNzE4ODkwOTM2NTkx.MAD9ESTX6l92G0EVXaoqIqkdlX7QQz_xYC7OqKZeO7gg.iMx0W01J23KqFW-W03c9sdzQA7lvMtVEJffcojiR94Mg.JPEG%2F20240502_130555.jpg%2F2992x2992",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjAzMTFfMTgy%2FMDAxNzczMTk0Mjc4MDQw.6GnsoCbo3-ZMleEG7iF25sq045dc-pqUQdul2NOZfLog.rcFbHlPRGEvjEmOyd3jaMMG70azC4Qpp_NBzbv8Ofzwg.JPEG%2FIMG%25EF%25BC%25BF1511.jpg%2F900x1200"
    ]
  },
  {
    "id": 14,
    "name": "씨티스퀘어 완백부대찌개삼겹살",
    "category": "한식",
    "badge": "🌅 조식가능 · 🌙 저녁가능",
    "rating": 4.3,
    "reviewCount": 190,
    "address": "서울 중구 서소문로 124 (씨티스퀘어 지하) (씨티스퀘어 지하 1층)",
    "building": "씨티스퀘어 지하 1층",
    "phone": "매장 확인",
    "hours": "평일 09:30-21:30 (브레이크 15:00-16:30), 토 10:00부터 (일요일 휴무)",
    "breakfast": true,
    "lunch": true,
    "dinner": true,
    "lat": 37.5631061,
    "lng": 126.9752236,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20200328_232%2F1585360558397DhFAa_JPEG%2FjePw8gTlUmZTngLx1httLsFJ.jpg",
    "summary": "완백부대찌개(10,000), 묵은지삼겹(16,000), 라면·밥(무한)",
    "tip": "조식 가능. 백김치가 들어간 깔끔한 부대찌개, 라면사리 무한리필.",
    "menus": [
      {
        "name": "완백부대찌개(10",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "묵은지삼겹(16",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "라면·밥",
        "price": "무한",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%94%A8%ED%8B%B0%EC%8A%A4%ED%80%98%EC%96%B4%20%EC%99%84%EB%B0%B1%EB%B6%80%EB%8C%80%EC%B0%8C%EA%B0%9C%EC%82%BC%EA%B2%B9%EC%82%B4",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%94%A8%ED%8B%B0%EC%8A%A4%ED%80%98%EC%96%B4%20%EC%99%84%EB%B0%B1%EB%B6%80%EB%8C%80%EC%B0%8C%EA%B0%9C%EC%82%BC%EA%B2%B9%EC%82%B4%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5631061,126.9752236",
    "buildingCluster": "씨티스퀘어",
    "buildingLat": 37.563046,
    "buildingLng": 126.975172,
    "buildingName": "씨티스퀘어",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20200328_232%2F1585360558397DhFAa_JPEG%2FjePw8gTlUmZTngLx1httLsFJ.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20200328_154%2F1585360576204w6OOx_JPEG%2FpHLvsds_0EanA0fP1GiTz2tr.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjAzMDdfMjc5%2FMDAxNzcyODgwNDI4NjM2.gqR-meLDD7JmZ8XjBfdsINPblBR3yUZLSsG5USRyaM8g.WQrZVX4FijLUroRV9reH5vm-fiQBlC1-ZNWiD0kUq_gg.JPEG%2FIMG%25EF%25BC%25BF0785.jpg%2F900x1200",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA3MThfMjk4%2FMDAxNzg0MzYyOTAwOTQx.7URW8AGrwbHV8odkNHx3wCySgkNq4SgC5VuO5GWRpuog.FsDM3wDlcYo0iCqbuiA_fiyx51PilfgfNa6O5AfVgh0g.JPEG%2FIMG%25EF%25BC%25BF9152.jpg%2F900x676"
    ]
  },
  {
    "id": 15,
    "name": "씨티스퀘어(오한수 우육면가)",
    "category": "중식",
    "badge": "🌅 조식가능 · 🌙 저녁가능 · ⭐ 직장인인기",
    "rating": 4.8,
    "reviewCount": 174,
    "address": "서울 중구 서소문로 124 지하1층 B1041호 (씨티스퀘어 B1층 B1041호)",
    "building": "씨티스퀘어 B1층 B1041호",
    "phone": "매장 확인",
    "hours": "월-금 10:00-22:00 (브레이크 15:00-17:00, 토·일 휴무)",
    "breakfast": true,
    "lunch": true,
    "dinner": true,
    "lat": 37.5631062,
    "lng": 126.9752236,
    "imageUrl": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA0MDNfMTUw%2FMDAxNzc1MjAxMjMzNzg3._giobG3I_PiG5KFh6Gpf9YGNc-YwT4TbcLZkaXzrU58g.FF5--jkDfbtCl8gSr_4d_SZsCrqlwrHnpQOemp4ZCdYg.JPEG%2F900%25A3%25DF20260331%25A3%25DF112851.jpg%23900x900&type=ff192_192",
    "summary": "홍콩우육탕면(9,800), 수제군만두(7,500), 도가니탕면(12,000)",
    "tip": "조식 지원. 면사리·밥 무료 리필. 바삭한 육즙 군만두 필수.",
    "menus": [
      {
        "name": "홍콩우육탕면(9",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "800)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "수제군만두(7",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "도가니탕면(12",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%94%A8%ED%8B%B0%EC%8A%A4%ED%80%98%EC%96%B4%20%EC%98%A4%ED%95%9C%EC%88%98%20%EC%9A%B0%EC%9C%A1%EB%A9%B4%EA%B0%80",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%94%A8%ED%8B%B0%EC%8A%A4%ED%80%98%EC%96%B4%20%EC%98%A4%ED%95%9C%EC%88%98%20%EC%9A%B0%EC%9C%A1%EB%A9%B4%EA%B0%80%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5631062,126.9752236",
    "buildingCluster": "씨티스퀘어",
    "buildingLat": 37.563046,
    "buildingLng": 126.975172,
    "buildingName": "씨티스퀘어",
    "images": [
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA0MDNfMTUw%2FMDAxNzc1MjAxMjMzNzg3._giobG3I_PiG5KFh6Gpf9YGNc-YwT4TbcLZkaXzrU58g.FF5--jkDfbtCl8gSr_4d_SZsCrqlwrHnpQOemp4ZCdYg.JPEG%2F900%25A3%25DF20260331%25A3%25DF112851.jpg%23900x900&type=ff192_192",
      "https://search.pstatic.net/common/?autoRotate=true&quality=95&type=f160_160&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210419_73%2F1618820910777Gw5lA_JPEG%2FVVSYs4AjgDV1lylFqHYL7nsB.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&quality=95&type=f160_160&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjAyMTJfMzcg%2FMDAxNzcwODcwODA1Nzk5.9-5DQy4f-0v6XCOk4QnV6MXb21k2pP_muNwZqzjHJ8wg.up24v7PkNqamP9OifkNRS9jUW6Niqaa_bOvrwrZvxuQg.JPEG%2Fimage_(3).jpg%2F1024x1365",
      "https://search.pstatic.net/common/?autoRotate=true&quality=95&type=f160_160&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjAyMTJfMjIw%2FMDAxNzcwODcxMjgwODUx.hEfiHLmeQnI6TCzoX5d_h9i0tGqk2P3cXG0aPQuMtjcg.NK_UC6U8CUs7OMyKs5lDUKMnDCr2wApE8xY4RL5b0F0g.JPEG%2Fimage_(10).jpg%2F1024x1365"
    ]
  },
  {
    "id": 16,
    "name": "구름산추어탕 시청점",
    "category": "한식",
    "badge": "🌅 조식가능 · 🌙 저녁가능",
    "rating": 4.4,
    "reviewCount": 166,
    "address": "서울 중구 서소문로 124 (씨티스퀘어 지하) (씨티스퀘어 지하 1층)",
    "building": "씨티스퀘어 지하 1층",
    "phone": "매장 확인",
    "hours": "평일 운영 (식권대장 이용시간 준수)",
    "breakfast": true,
    "lunch": true,
    "dinner": true,
    "lat": 37.5631062,
    "lng": 126.9752236,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260820_86%2F1787204950087kChGW_JPEG%2FKakaoTalk_20260820_144824874_04.jpg",
    "summary": "구름산추어탕(11,000), 보쌈추가(무료제공), 우렁추어탕(13,000)",
    "tip": "조식 가능. 추어탕 주문 시 맛보기 보쌈과 콩나물무침 기본 제공.",
    "menus": [
      {
        "name": "구름산추어탕(11",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "보쌈추가",
        "price": "무료제공",
        "isSignature": false
      },
      {
        "name": "우렁추어탕(13",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%94%A8%ED%8B%B0%EC%8A%A4%ED%80%98%EC%96%B4%20%EA%B5%AC%EB%A6%84%EC%82%B0%EC%B6%94%EC%96%B4%ED%83%95",
    "kakaoUrl": "https://map.kakao.com/link/map/%EA%B5%AC%EB%A6%84%EC%82%B0%EC%B6%94%EC%96%B4%ED%83%95%20%EC%8B%9C%EC%B2%AD%EC%A0%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5631062,126.9752236",
    "buildingCluster": "씨티스퀘어",
    "buildingLat": 37.563046,
    "buildingLng": 126.975172,
    "buildingName": "씨티스퀘어",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260820_86%2F1787204950087kChGW_JPEG%2FKakaoTalk_20260820_144824874_04.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20240923_43%2F1727099116798mKnMP_JPEG%2F1727098912597.jpg",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA5MTlfMTgz%2FMDAxNzg5Nzc3MDMyOTk0.J0lhTU-aBtj2_8IzM9uef_AkCvyKDiUEJwiiCzsgG5wg.s0x7KXGmNliM-gJGeqzAculW1FGxQIx-8fMEbf8bcQUg.JPEG%2FKakaoTalk_20260919_090741637_11.jpg%233024x4032&type=f238_208",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA5MTlfMTc3%2FMDAxNzg5Nzc3MTk5NjMz.2xoJ2LR8NjDWiDu5B9HpqBCaQiGnjh4PBhnlNd2P7Okg.g60Ey6HMmPMPdy20KGpkasl5r1uZC77tvUdKMh7t02og.JPEG%2FKakaoTalk_20260919_090741637_03.jpg%233024x4032&type=f238_208"
    ]
  },
  {
    "id": 17,
    "name": "왕건카레 시티스퀘어 시청점",
    "category": "일식",
    "badge": "🌅 조식가능 · 🌙 저녁가능 · ⭐ 직장인인기",
    "rating": 4.5,
    "reviewCount": 322,
    "address": "서울 중구 서소문로 124 (씨티스퀘어 지하) (씨티스퀘어 지하 1층)",
    "building": "씨티스퀘어 지하 1층",
    "phone": "매장 확인",
    "hours": "평일 운영 (식권대장 이용시간 준수)",
    "breakfast": true,
    "lunch": true,
    "dinner": true,
    "lat": 37.5631062,
    "lng": 126.9752236,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260624_244%2F17822600541984vjh6_JPEG%2F%25BD%25C3%25C3%25BB%25C1%25A11.jpg",
    "summary": "왕건카레(8,500), 치킨가라아게카레(10,500), 돈까스카레(11,000)",
    "tip": "조식 지원. 진한 일본식 숙성 카레. 밥과 카레 리필 가능.",
    "menus": [
      {
        "name": "왕건카레(8",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "치킨가라아게카레(10",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "돈까스카레(11",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%94%A8%ED%8B%B0%EC%8A%A4%ED%80%98%EC%96%B4%20%EC%99%95%EA%B1%B4%EC%B9%B4%EB%A0%88",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%99%95%EA%B1%B4%EC%B9%B4%EB%A0%88%20%EC%8B%9C%ED%8B%B0%EC%8A%A4%ED%80%98%EC%96%B4%20%EC%8B%9C%EC%B2%AD%EC%A0%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5631062,126.9752236",
    "buildingCluster": "씨티스퀘어",
    "buildingLat": 37.563046,
    "buildingLng": 126.975172,
    "buildingName": "씨티스퀘어",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260624_244%2F17822600541984vjh6_JPEG%2F%25BD%25C3%25C3%25BB%25C1%25A11.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260624_296%2F1782260054115ocKgk_JPEG%2F%25BD%25C3%25C3%25BB%25C1%25A12.jfif.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA3MjBfMjE5%2FMDAxNzg0NTU3NTI5NDAw.0H25TJ0hgCeQg4GqPrr--gMZ25WWnAY24SygvMup8AAg.ElkcJkIbE5XT01QyK9lvW-KxZPjVg-2xbaGxxK7y8Jwg.PNG%2FKakaoTalk_20260720_232417633.png%2F1024x1536",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA3MjJfMTEx%2FMDAxNzg0NjUyMjg2OTk1.AwkkEJ7Wk-plyWP6bks7Aon-5hmcMIkU9d5lfYGRVnQg.p93r7eNjW9dQtm-7Ervjp2S7RIOiYjtG8MMG6W09Ey8g.JPEG%2FIMG%25EF%25BC%25BF4603.JPG%2F900x975"
    ]
  },
  {
    "id": 18,
    "name": "유브유부(씨티스퀘어점)",
    "category": "분식",
    "badge": "🌅 조식가능 · 🌙 저녁가능 · ⭐ 직장인인기",
    "rating": 4.7,
    "reviewCount": 117,
    "address": "서울 중구 서소문로 124 (씨티스퀘어 지하) (씨티스퀘어 지하 1층)",
    "building": "씨티스퀘어 지하 1층",
    "phone": "매장 확인",
    "hours": "평일 운영 (식권대장 이용시간 준수)",
    "breakfast": true,
    "lunch": true,
    "dinner": true,
    "lat": 37.5631062,
    "lng": 126.9752236,
    "imageUrl": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA4MjJfMTE3%2FMDAxNzg3MzU4MjA5MjM1.Bhdlc7Xuc90wYyBnafcKSP_cjbMOB3op2jc0ld6jT04g.AF2hms_hYFX5lcMZ9bADNF_KR8PivXxeclK0euQjiGYg.JPEG%2F900%25A3%25DF20251117%25A3%25DF183647.jpg%23922x697&type=ff192_192",
    "summary": "연어유부초밥(3,200), 우삼겹유부(3,000), 라면(4,500)",
    "tip": "조식 가능. 큼직한 토핑 대왕 유부초밥. 빠르고 간편한 혼밥.",
    "menus": [
      {
        "name": "연어유부초밥(3",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "200)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "우삼겹유부(3",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "라면(4",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%94%A8%ED%8B%B0%EC%8A%A4%ED%80%98%EC%96%B4%20%EC%9C%A0%EB%B8%8C%EC%9C%A0%EB%B6%80",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%9C%A0%EB%B8%8C%EC%9C%A0%EB%B6%80%20%EC%94%A8%ED%8B%B0%EC%8A%A4%ED%80%98%EC%96%B4%EC%A0%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5631062,126.9752236",
    "buildingCluster": "씨티스퀘어",
    "buildingLat": 37.563046,
    "buildingLng": 126.975172,
    "buildingName": "씨티스퀘어",
    "images": [
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA4MjJfMTE3%2FMDAxNzg3MzU4MjA5MjM1.Bhdlc7Xuc90wYyBnafcKSP_cjbMOB3op2jc0ld6jT04g.AF2hms_hYFX5lcMZ9bADNF_KR8PivXxeclK0euQjiGYg.JPEG%2F900%25A3%25DF20251117%25A3%25DF183647.jpg%23922x697&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTExMTlfMTYy%2FMDAxNzYzNTExNjIzMzIz.ifYabve0rfNODD-iVP8EaXPvDNzVDdk2XgCZuK32tYYg.x6PLSHkEv52XlxYwjdggDxOXCuF8b0sD7os294fUHQog.JPEG%2FIMG%25A3%25DF9976.JPG%23900x676&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTA2MTFfMTA3%2FMDAxNzQ5NTk3OTE5NDk2.aZ3bnXL1PvjNvhXw0rvWHLpK_Xysa2C_7GUYw9Dfwxkg.3scGfupDja9g_yWli4Ie8kV5EbN0vjHEcg-Cpi-pWygg.JPEG%2F900%25A3%25DFSNOW%25A3%25DF20250610%25A3%25DF181131%25A3%25DF064.jpg%23900x1200&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTA2MjJfOTQg%2FMDAxNzUwNTcwODM1NDM1.qoqsXul89wtBRCd-Z39ImM-IPNpgIFqh_wnP7H8gW9Qg.ulz_2rLmyFqdNmcCYtUqNib_5bLTtQFUN9vXKqsaaUUg.PNG%2FIMG%25A3%25DF5900.PNG%23900x900&type=ff192_192"
    ]
  },
  {
    "id": 19,
    "name": "씨티스퀘어(서평옥)",
    "category": "한식",
    "badge": "🌅 조식가능 · 🌙 저녁가능",
    "rating": 4.2,
    "reviewCount": 103,
    "address": "서울 중구 서소문로 124 (씨티스퀘어 지하) (씨티스퀘어 B1층)",
    "building": "씨티스퀘어 B1층",
    "phone": "02-6250-0967",
    "hours": "평일 10:30-21:00 (토·일 휴무)",
    "breakfast": true,
    "lunch": true,
    "dinner": true,
    "lat": 37.5631061,
    "lng": 126.9752236,
    "imageUrl": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA1MjFfOTMg%2FMDAxNzc5MzUxMzM0NTMw.YHeAekj9t6oPk2-u1ZUAMFCM4lx8F2BX5WIkqyeiaqog.T8PBJMnrbJ8OBZHlNrWwRme6faqMVJqh8McxlCxRwhgg.JPEG%2F900%25A3%25DF20260518%25A3%25DF134242.jpg%23900x1200&type=ff192_192",
    "summary": "탕반/곰탕(10,000), 우거지탕(11,000), 접시만두(7,000)",
    "tip": "조식 가능. 맑고 담백한 이북식 곰탕. 국밥이라 회전율 가장 빠름.",
    "menus": [
      {
        "name": "탕반/곰탕(10",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "우거지탕(11",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "접시만두(7",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%94%A8%ED%8B%B0%EC%8A%A4%ED%80%98%EC%96%B4%20%EC%84%9C%ED%8F%89%EC%98%A5",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%94%A8%ED%8B%B0%EC%8A%A4%ED%80%98%EC%96%B4%20%EC%84%9C%ED%8F%89%EC%98%A5%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5631061,126.9752236",
    "buildingCluster": "씨티스퀘어",
    "buildingLat": 37.563046,
    "buildingLng": 126.975172,
    "buildingName": "씨티스퀘어",
    "images": [
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA1MjFfOTMg%2FMDAxNzc5MzUxMzM0NTMw.YHeAekj9t6oPk2-u1ZUAMFCM4lx8F2BX5WIkqyeiaqog.T8PBJMnrbJ8OBZHlNrWwRme6faqMVJqh8McxlCxRwhgg.JPEG%2F900%25A3%25DF20260518%25A3%25DF134242.jpg%23900x1200&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjAyMDZfMjI2%2FMDAxNzcwMzY2MDkwMDU4.qIEwei4HfAzpYNssj7zR7bE3YaJEUmuaLyTUrCDH6Egg.iHHqq9FaUsbqvPRPxins86u4PzlmVUxst53seAW0HBkg.JPEG%2FIMG_1389.JPG%233000x2250&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTExMjdfNzIg%2FMDAxNzY0MjE4OTg4NzMz.I7L6bZAh_jpveuGv3zSGdit_0y6i1JIaGkG9iap2s4og.M3kXu8mK7cFsTQ2m1MPZVGeGPCm2ct0cioQwzbBo8Q0g.JPEG%2Foutput%25A3%25DF1870424664.jpg%23900x963&type=f238_208",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTExMjdfMjU5%2FMDAxNzY0MjE4MzM0NzY1.JOLUza59YnntgaES84bD0Z-WlXsb7s1Aw97bdaccYmwg.6vIkypDL338LFI8VYBR6ddWadUk_1k3klKB0LKZGRDsg.JPEG%2Foutput%25A3%25DF727032864.jpg%23900x676&type=f238_208"
    ]
  },
  {
    "id": 20,
    "name": "씨티스퀘어(브라운돈까스)",
    "category": "양식",
    "badge": "🌅 조식가능 · 🌙 저녁가능 · ⭐ 직장인인기",
    "rating": 4.8,
    "reviewCount": 89,
    "address": "서울 중구 서소문로 124 지하1층 B104-5호 (씨티스퀘어 지하 1층)",
    "building": "씨티스퀘어 지하 1층",
    "phone": "매장 확인",
    "hours": "평일 10:30-20:00",
    "breakfast": true,
    "lunch": true,
    "dinner": true,
    "lat": 37.5631061,
    "lng": 126.9752236,
    "imageUrl": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA4MTdfMTY1%2FMDAxNzg2OTcyMDI5MTg1.RCwVcGq5kVxhid6Kbo8aQoiEW40gG4rAG1qGzJXzaAog.mp0gBcrJ_YWlqT8zJlF-9fEouNyGKqHCSSLr3kbygXMg.JPEG%2FIMG_1206.JPG%232686x2182&type=ff192_192",
    "summary": "등심돈까스(9,500), 안심돈까스(10,500), 매운돈까스(10,500)",
    "tip": "조식 가능. 추억의 스프와 모닝빵이 나오는 경양식 돈까스.",
    "menus": [
      {
        "name": "등심돈까스(9",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "안심돈까스(10",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "매운돈까스(10",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%94%A8%ED%8B%B0%EC%8A%A4%ED%80%98%EC%96%B4%20%EB%B8%8C%EB%9D%BC%EC%9A%B4%EB%8F%88%EA%B9%8C%EC%8A%A4",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%94%A8%ED%8B%B0%EC%8A%A4%ED%80%98%EC%96%B4%20%EB%B8%8C%EB%9D%BC%EC%9A%B4%EB%8F%88%EA%B9%8C%EC%8A%A4%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5631061,126.9752236",
    "buildingCluster": "씨티스퀘어",
    "buildingLat": 37.563046,
    "buildingLng": 126.975172,
    "buildingName": "씨티스퀘어",
    "images": [
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA4MTdfMTY1%2FMDAxNzg2OTcyMDI5MTg1.RCwVcGq5kVxhid6Kbo8aQoiEW40gG4rAG1qGzJXzaAog.mp0gBcrJ_YWlqT8zJlF-9fEouNyGKqHCSSLr3kbygXMg.JPEG%2FIMG_1206.JPG%232686x2182&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTExMzBfMTky%2FMDAxNzY0NDgxNjQ0OTYy.RZThuDtVSz5fTlSYHucR9qftC_56wYoO2Ttria7F4ycg.gy4QyJznFiKjRAe8empWsj88j85Y71j4nDgGNT9pGi8g.JPEG%2FIMG%25A3%25DF9855.jpg%23900x1200&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTAxMTZfMTc2%2FMDAxNzM2OTgxNDg5Mjk2.sdgbTuU78owc4GXBrcaFud13f15JfWiX91XEN-4ZjWIg.UMDg5rtAInOGfcOZhBOickab3gtSP7PTSJFWbcRXQ68g.JPEG%2FIMG_2954.jpg%23900x1200&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTEyMjNfMTE4%2FMDAxNzY2NDY0MDk2ODg2.M9liZC1bicwFfV44yeqbsFs2cyAEVsnHHw03OuK8w7Eg.bPI0UPkJfjla8TeR8Tv4cWw8hXhimV1IVUmr2wnGr-sg.JPEG%2Foutput%25A3%25DF4181199227.jpg%23900x676&type=ff192_192"
    ]
  },
  {
    "id": 21,
    "name": "정원소담(부영빌딩)",
    "category": "한식",
    "badge": "⭐ 직장인인기",
    "rating": 4.8,
    "reviewCount": 112,
    "address": "서울 중구 세종대로9길 42 (부영빌딩, 좌표는 인접 건물 기준 추정) (부영빌딩 지하 1층)",
    "building": "부영빌딩 지하 1층",
    "phone": "매장 확인",
    "hours": "조식 06:00-09:10 / 중식 11:00-14:00 (구내식당형, 저녁 없음)",
    "breakfast": false,
    "lunch": true,
    "dinner": false,
    "lat": 37.5616585,
    "lng": 126.9738508,
    "imageUrl": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTEyMTZfNDkg%2FMDAxNzY1ODY4NjM0MDA0.9Uv2tVYxd1e8f59sbkQeb85cIu9vJp-VF63HsLxLh8cg.bWtrARSbGHTEZwSpC3vGlzfIpqbWxEWwpGIbpWvgJI0g.JPEG%2F20251215_122306.jpg%232250x3000&type=ff192_192",
    "summary": "점심한식뷔페(8,500), 조식뷔페(6,500), 식권묶음(80,000)",
    "tip": "조식 가능. 10가지 반찬과 고기메인 무제한 한식뷔페 가성비 최고.",
    "menus": [
      {
        "name": "점심한식뷔페(8",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "조식뷔페(6",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "식권묶음(80",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%A0%95%EC%9B%90%EC%86%8C%EB%8B%B4%20%EB%B6%80%EC%98%81%EB%B9%8C%EB%94%A9",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%A0%95%EC%9B%90%EC%86%8C%EB%8B%B4%20%EB%B6%80%EC%98%81%EB%B9%8C%EB%94%A9%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5616585,126.9738508",
    "images": [
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTEyMTZfNDkg%2FMDAxNzY1ODY4NjM0MDA0.9Uv2tVYxd1e8f59sbkQeb85cIu9vJp-VF63HsLxLh8cg.bWtrARSbGHTEZwSpC3vGlzfIpqbWxEWwpGIbpWvgJI0g.JPEG%2F20251215_122306.jpg%232250x3000&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA0MzBfMjA2%2FMDAxNzc3NTA1NTA5NzQw.ZuxzWJWY-Fhr3h9S5CWTS7uVdWiKIOOqOxr_7igOYAQg.BcU8zScUOlbFTUhzD2hhOGX0VtiB4P_7Mi8KQdQvgv4g.PNG%2F900_file_000000000ff87206aa49b2b7942a29ad.png%23900x900&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTA0MjBfMTM5%2FMDAxNzQ1MDgzOTY3MjQ4.RvfeSJuS6Hu0x-qegnl48hS4mhZHwiZo3xmY2aTOONQg.tywvcrGGHB5ROj7lTYDjxm-YA73E8tKaJczwfCGqy7Ag.JPEG%2F1745083966372.jpg%23900x1200&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTAzMjZfMTU4%2FMDAxNzQyOTYzODc5OTA2.EsIdZQhcRxBMh7Ur5Vf8idcc7pCH-a7TIWRjfnJx0M0g.KTR0GltG6n1XR7Xe1n-6P-SQNtlHrWHh1u5zm3jr9Awg.JPEG%2F%25C1%25A6%25B8%25F1%25C0%25BB-%25C0%25D4%25B7%25C2%25C7%25D8%25C1%25D6%25BC%25BC%25BF%25E4_-001_%25288%2529.jpg%237087x7087&type=ff192_192"
    ]
  },
  {
    "id": 22,
    "name": "신의주찹쌀순대(서소문점)",
    "category": "한식",
    "badge": "🌙 저녁가능",
    "rating": 4.4,
    "reviewCount": 298,
    "address": "서울 중구 서소문로 128-3",
    "building": "서소문로 128-3",
    "phone": "02-757-8866",
    "hours": "평일 운영 (식권대장 이용시간 준수)",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.5633311,
    "lng": 126.9755479,
    "imageUrl": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA5MDFfMjEz%2FMDAxNzg4Mjc0MTEyNTUw.pMRz8OUTRblprqGExwXSNdCTGsrj4HAHg6p3Egt_5dUg.TFFrPmG4rVzNVlGwTzYS10V1c-tx4kjJ2gWbjV_Uhy4g.PNG%2FGemini_Generated_Image_2zt0ol2zt0ol2zt0-Photoroom.png%232048x2048&type=ff192_192",
    "summary": "순대국(10,000), 뼈해장국(10,000), 모듬순대(25,000)",
    "tip": "잡내 없는 진한 사골육수 순대국. 다대기 기본 포함.",
    "menus": [
      {
        "name": "순대국(10",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "뼈해장국(10",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "모듬순대(25",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%8B%A0%EC%9D%98%EC%A3%BC%EC%B0%B9%EC%8C%80%EC%88%9C%EB%8C%80%20%EC%84%9C%EC%86%8C%EB%AC%B8%EC%A0%90",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%8B%A0%EC%9D%98%EC%A3%BC%EC%B0%B9%EC%8C%80%EC%88%9C%EB%8C%80%20%EC%84%9C%EC%86%8C%EB%AC%B8%EC%A0%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5633311,126.9755479",
    "images": [
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA5MDFfMjEz%2FMDAxNzg4Mjc0MTEyNTUw.pMRz8OUTRblprqGExwXSNdCTGsrj4HAHg6p3Egt_5dUg.TFFrPmG4rVzNVlGwTzYS10V1c-tx4kjJ2gWbjV_Uhy4g.PNG%2FGemini_Generated_Image_2zt0ol2zt0ol2zt0-Photoroom.png%232048x2048&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA4MjVfMjcz%2FMDAxNzg3NjMxMTM1MjYw.xtnCSyrbt8ur7iJFLSwEaSsybRRbbDkeYTTaiSk9gmMg.fMiTFtfHOhwkziukFe_mRklGDRiDAKHBNW4QhLMhhwwg.JPEG%2F7B43CBAE%25A3%25ADD895%25A3%25AD4194%25A3%25AD8B14%25A3%25ADFA02CCDF7F78.jpg%23900x900&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA4MjJfMjAy%2FMDAxNzg3MzY4MDk4OTcy.Nkluhpc_o3NPEOsawengfS3HQOuXKaHFbAfFhEh---sg.eOeZj_1oSyJuQh4jplFI2ID2yh33Ii8PVhlRm_sb4eAg.JPEG%2Foutput%25A3%25DF979222663.jpg%23780x803&type=f238_208",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA4MjJfMjA2%2FMDAxNzg3MzY4MTIyNzQ3.YabkT1wBihmmhr6ocJLeVL-Dx84ysRDSeEaIfpkPMxog.opJiyTQPLmi5xztHFLJQRNqKj8Gjnrz0KLtbnoPFfxIg.JPEG%2Foutput%25A3%25DF3267218773.jpg%23734x1028&type=f238_208"
    ]
  },
  {
    "id": 23,
    "name": "교동전선생(서소문점)",
    "category": "한식",
    "badge": "🌙 저녁가능",
    "rating": 4.3,
    "reviewCount": 95,
    "address": "서울 중구 서소문로 134-10",
    "building": "서소문로 134-10",
    "phone": "02-310-9909",
    "hours": "월-금 10:30-23:30, 토 11:00-21:30 (일요일 휴무)",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.5633214,
    "lng": 126.9758944,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230605_274%2F16859580123474ez7f_JPEG%2FA147AE70-6440-4989-9DDF-04BBDEB11EB5.jpeg",
    "summary": "순두부+모둠전정식(9,000), 된장찌개+전(9,000), 모둠전(22,000)",
    "tip": "점심 식사 주문 시 따끈한 모둠전 5종이 반찬으로 제공.",
    "menus": [
      {
        "name": "순두부+모둠전정식(9",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "된장찌개+전(9",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "모둠전(22",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EA%B5%90%EB%8F%99%EC%A0%84%EC%84%A0%EC%83%9D%20%EC%84%9C%EC%86%8C%EB%AC%B8%EC%A0%90",
    "kakaoUrl": "https://map.kakao.com/link/map/%EA%B5%90%EB%8F%99%EC%A0%84%EC%84%A0%EC%83%9D%20%EC%84%9C%EC%86%8C%EB%AC%B8%EC%A0%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5633214,126.9758944",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230605_274%2F16859580123474ez7f_JPEG%2FA147AE70-6440-4989-9DDF-04BBDEB11EB5.jpeg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjAzMjFfMjgw%2FMDAxNzc0MDc2NzY1OTg0.tyDfY22L3iWlV-zpEIyZA_Y0RkBvx42S3SXpZPI0xqkg.5SDw7F_jWtv087SicMxD5JAvom165959Na34A5VdfS0g.JPEG%2F900%25EF%25BC%25BF20260319%25EF%25BC%25BF161603.jpg%2F900x1599",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjAzMjFfMTY1%2FMDAxNzc0MDc2NzcwMDg5.95TnPUPxoQ0lSxntQOKY6NThkjCTrlTQWJWbuRHKoRMg.7CaB-4vIQ65SFycIBwmb3_fZgLWuZcZOp39mFfZPiiUg.JPEG%2F900%25EF%25BC%25BF20260319%25EF%25BC%25BF160211.jpg%2F900x1599",
      "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230605_274%2F16859580123474ez7f_JPEG%2FA147AE70-6440-4989-9DDF-04BBDEB11EB5.jpeg"
    ]
  },
  {
    "id": 24,
    "name": "시청역 봉평막국수",
    "category": "한식",
    "badge": "🌙 저녁가능",
    "rating": 4.4,
    "reviewCount": 298,
    "address": "서울 중구 서소문로 134-10 (2층) (세종대로11길 42)",
    "building": "세종대로11길 42",
    "phone": "02-777-5557",
    "hours": "평일 11:00-21:00 (브레이크 15:00-17:00, 주말 휴무)",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.563321,
    "lng": 126.9758827,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230306_266%2F1678101442335688Cz_JPEG%2F%25BA%25C0%25C6%25F2%25B8%25B7%25B1%25B9%25BC%25F6%25B0%25C7%25B9%25B0_230305.jpg",
    "summary": "물막국수(10,000), 비빔막국수(10,000), 메밀전병(8,000)",
    "tip": "자가제면 메밀막국수와 수육. 여름철 직장인 최고 인기.",
    "menus": [
      {
        "name": "물막국수(10",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "비빔막국수(10",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "메밀전병(8",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%8B%9C%EC%B2%AD%EC%97%AD%20%EB%B4%89%ED%8F%89%EB%A7%89%EA%B5%AD%EC%88%98",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%8B%9C%EC%B2%AD%EC%97%AD%20%EB%B4%89%ED%8F%89%EB%A7%89%EA%B5%AD%EC%88%98%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.563321,126.9758827",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230306_266%2F1678101442335688Cz_JPEG%2F%25BA%25C0%25C6%25F2%25B8%25B7%25B1%25B9%25BC%25F6%25B0%25C7%25B9%25B0_230305.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260205_28%2F1770258746091EJONQ_JPEG%2F%25BF%25CB%25BD%25C9%25C0%25CC%25B8%25DE%25B9%25D0%25C4%25AE%25B1%25B9%25BC%25F6.jpg",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA4MjdfMSAg%2FMDAxNzg3ODM1MTAwODY5.-rO_el_8uHRSXGY5cRDm30dFskQSMRUB1AVmHl6tPD4g.EFAkRrzPHH0fDHM6wEii3BG708lIivtyHGnP_pgDAyAg.JPEG%2F20260801_111636.jpg%232170x2170&type=f238_208",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA4MjdfOTYg%2FMDAxNzg3ODM1MDY3Mjk3.EslyC7sC9hhs8AqqTHQe59PVNzFOh1JXmy4CckdfALQg.8W8nUTfalriFPat2n0YZF3tLkGW62DlDtNccD7N3nAwg.JPEG%2F20260801_105313.jpg%232102x2483&type=f238_208"
    ]
  },
  {
    "id": 25,
    "name": "전주다대기",
    "category": "한식",
    "badge": "🌙 저녁가능",
    "rating": 4.2,
    "reviewCount": 268,
    "address": "서울 중구 세종대로11길 42 (세종대로11길 일대)",
    "building": "세종대로11길 일대",
    "phone": "02-318-7805",
    "hours": "평일 11:00-22:00 (브레이크 15:00-17:00), 토 10:00-14:00 (일요일 휴무)",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.5621806,
    "lng": 126.9736157,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250812_229%2F1754977543287BIv2T_JPEG%2FIMG_7022.jpeg",
    "summary": "전주콩나물국밥(8,500), 제육정식(10,000), 황태국밥(9,000)",
    "tip": "칼칼한 전주식 콩나물국밥과 수란. 전날 회식 후 해장 1순위.",
    "menus": [
      {
        "name": "전주콩나물국밥(8",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "제육정식(10",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "황태국밥(9",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%8B%9C%EC%B2%AD%EC%97%AD%20%EC%84%9C%EC%86%8C%EB%AC%B8%20%EC%A0%84%EC%A3%BC%EB%8B%A4%EB%8C%80%EA%B8%B0",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%A0%84%EC%A3%BC%EB%8B%A4%EB%8C%80%EA%B8%B0%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5621806,126.9736157",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250812_229%2F1754977543287BIv2T_JPEG%2FIMG_7022.jpeg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250812_2%2F1754977543333kjiDx_JPEG%2FIMG_7021.jpeg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjAyMTBfMjE2%2FMDAxNzcwNzAyNTEyMjEw.wlzdpIOUIRLjf_HVzZCS1imq0fp_Pgehdi1zDKxEedUg.M6ffQ8Qlo_zZPu-TCp2BMT1YDpDVFMQONHRvWhmuJK0g.JPEG%2F900%25EF%25BC%25BF20260127%25EF%25BC%25BF115153.jpg%2F900x900",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA2MjRfNTYg%2FMDAxNzgyMzA0ODcyOTA4.BdoWBgr2ZbYY-ttvTK7IR2FH-LoNrFHgjuirH30u9gAg.Co31z8umkFp7eSZdwcEztLZIgYFQxv9B1hL5l7Scgqcg.JPEG%2Foutput%25EF%25BC%25BF3712316347.jpg%2F899x1022"
    ]
  },
  {
    "id": 26,
    "name": "함평집(서울시청점)",
    "category": "한식",
    "badge": "🌙 저녁가능",
    "rating": 4.2,
    "reviewCount": 300,
    "address": "서울 중구 서소문동 120-14 (세종대로 72 2층)",
    "building": "세종대로 72 2층",
    "phone": "02-777-1987",
    "hours": "매일 10:00-21:30 (브레이크 15:00-17:00)",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.5622717,
    "lng": 126.973634,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20241226_219%2F1735179400541BtVbY_JPEG%2F1.jpg",
    "summary": "육회비빔밥(12,000), 소고기국밥(10,000), 곰탕(11,000)",
    "tip": "신선한 한우 육회비빔밥과 가마솥 맑은 곰탕 맛집.",
    "menus": [
      {
        "name": "육회비빔밥(12",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "소고기국밥(10",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "곰탕(11",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%ED%95%A8%ED%8F%89%EC%A7%91%20%EC%84%9C%EC%9A%B8%EC%8B%9C%EC%B2%AD%EC%A0%90",
    "kakaoUrl": "https://map.kakao.com/link/map/%ED%95%A8%ED%8F%89%EC%A7%91%20%EC%84%9C%EC%9A%B8%EC%8B%9C%EC%B2%AD%EC%A0%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5622717,126.973634",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20241226_219%2F1735179400541BtVbY_JPEG%2F1.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20241226_268%2F1735179400520U6d5l_JPEG%2F%25B4%25D9%25BF%25EE%25B7%25CE%25B5%25E5_%25281%2529.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjAxMDNfMTE1%2FMDAxNzY3NDM0MTQ0Nzg3.FKY8hf6o2iJUbiPWYyVXe0uvW5KR0rpORUoV1b-Rg0Mg.-xYNinRvMCyn5fGaml3fSqSC7zaSDSS5zcAPVVzYyD8g.JPEG%2F20250918_132313.jpg%2F4000x3000",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNTEwMTVfMTg3%2FMDAxNzYwNDk1MTI4NjYw.fJTAfl2ES-jIzBn-m-Jax7LdQmEtPI0QxGdrkg-K6jIg.976Eb1oaa7WlLKLbqQSsO-5m8Q_PPkG7U3emz9Sv96gg.JPEG%2F(580).jpg%2F1066x800"
    ]
  },
  {
    "id": 27,
    "name": "잼배옥",
    "category": "한식",
    "badge": "🌙 저녁가능",
    "rating": 4.4,
    "reviewCount": 93,
    "address": "서울 중구 세종대로9길 68-9 (세종대로9길 33)",
    "building": "세종대로9길 33",
    "phone": "02-755-8106",
    "hours": "평일 10:00-21:30 (브레이크 15:00-17:00), 토 11:00-15:00 (일요일 휴무)",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.5625022,
    "lng": 126.9737271,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20150831_286%2F1441029184753t6bTJ_JPEG%2F11722483_0.jpg",
    "summary": "설렁탕(11,000), 도가니탕(17,000), 수육(35,000)",
    "tip": "1933년 개업 90년 전통 노포 설렁탕. 맑고 깊은 국물.",
    "menus": [
      {
        "name": "설렁탕(11",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "도가니탕(17",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "수육(35",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%8B%9C%EC%B2%AD%EC%97%AD%20%EC%9E%BC%EB%B0%B0%EC%98%A5",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%9E%BC%EB%B0%B0%EC%98%A5%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5625022,126.9737271",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20150831_286%2F1441029184753t6bTJ_JPEG%2F11722483_0.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20150831_220%2F1441029184934PJ5Gc_JPEG%2F11722483_1.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA0MjlfMjM0%2FMDAxNzc3NDM5MjY5ODUz.t2rHoyIdgvbVpa0avl48TUbHYKqvbKNNy-gU36mN7Iog.wv-tfGBDHwF8-eSV1RtovA7UfG3bFJCGZOV_E3hbngwg.JPEG%2F20230921_122259.jpg%2F4000x3000",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA0MjlfNTkg%2FMDAxNzc3NDM5MjY5OTkx.SG5KOREZ4opoXywQiQl5rSY6GYkdVo6n4uZ7WP4iX9Mg.uc3_SZTC-ixDPyDKcuaAdJKDgc3yOTto2QG37hiL3P4g.JPEG%2F20230921_122354.jpg%2F4000x3000"
    ]
  },
  {
    "id": 28,
    "name": "부대찌개대사관 시청점",
    "category": "한식",
    "badge": "식권대장 가맹점",
    "rating": 4.4,
    "reviewCount": 337,
    "address": "서울 중구 세종대로 74-1 (1층 103호) (세종대로11길 27)",
    "building": "세종대로11길 27",
    "phone": "매장 확인",
    "hours": "평일 운영 (식권대장 이용시간 준수)",
    "breakfast": false,
    "lunch": true,
    "dinner": false,
    "lat": 37.5628167,
    "lng": 126.9769336,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20251112_290%2F1762925759636tlRfh_JPEG%2Fasdfd.jpg",
    "summary": "대사관부대찌개(11,000), 솥뚜껑삼겹살(16,000), 햄사리(4,000)",
    "tip": "촙트햄과 소시지가 산더미처럼 들어가는 송탄식 부대찌개.",
    "menus": [
      {
        "name": "대사관부대찌개(11",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "솥뚜껑삼겹살(16",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "햄사리(4",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EB%B6%80%EB%8C%80%EC%B0%8C%EA%B0%9C%EB%8C%80%EC%82%AC%EA%B4%80%20%EC%8B%9C%EC%B2%AD%EC%A0%90",
    "kakaoUrl": "https://map.kakao.com/link/map/%EB%B6%80%EB%8C%80%EC%B0%8C%EA%B0%9C%EB%8C%80%EC%82%AC%EA%B4%80%20%EC%8B%9C%EC%B2%AD%EC%A0%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5628167,126.9769336",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20251112_290%2F1762925759636tlRfh_JPEG%2Fasdfd.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20251128_253%2F1764312874880YAMTu_JPEG%2FKakaoTalk_20250529_170612896_02.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNTEyMTFfMzMg%2FMDAxNzY1NDU5OTQzNDM4.H9aDpveu9zCxiTTNpozzwqI-Us4xzLxnkUwkIdXN04Yg.xlsWQHEOYS3aAqVNraUWkEyKN2ssCjO5ueMw8kNR17cg.JPEG%2FIMG%25EF%25BC%25BF2895.jpg%2F900x1200",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA5MTJfMTE1%2FMDAxNzg5MTg1NzEyNTUy.Epk1laTtBFY515jTeX8UU9HinMFDmTxHYmK8XXl7zbMg.KFHjKzwqAoQstO1xlWf3BHirWg1o7KSSMMYfpldgtVog.JPEG%2FKakaoTalk_20260625_170536229.jpg%2F3000x2660"
    ]
  },
  {
    "id": 29,
    "name": "김가네(시청역점)",
    "category": "분식",
    "badge": "🌅 조식가능 · 🌙 저녁가능",
    "rating": 4.4,
    "reviewCount": 315,
    "address": "서울 중구 세종대로 74-1 (소공동)",
    "building": "세종대로 74",
    "phone": "02-319-0088",
    "hours": "평일 08:00-21:00, 주말 08:00-19:00",
    "breakfast": true,
    "lunch": true,
    "dinner": true,
    "lat": 37.5628167,
    "lng": 126.9769336,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20231017_279%2F1697539926156cg04m_JPEG%2F%25B1%25E8%25B0%25A1%25B3%25D7.jpg",
    "summary": "김가네김밥(4,500), 라볶이(6,500), 철판치즈김치볶음밥(8,500)",
    "tip": "조식 지원. 아침 일찍 김밥 테이크아웃 및 빠른 분식 점심.",
    "menus": [
      {
        "name": "김가네김밥(4",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "라볶이(6",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "철판치즈김치볶음밥(8",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EA%B9%80%EA%B0%80%EB%84%A4%20%EC%8B%9C%EC%B2%AD%EC%97%AD%EC%A0%90",
    "kakaoUrl": "https://map.kakao.com/link/map/%EA%B9%80%EA%B0%80%EB%84%A4%20%EC%8B%9C%EC%B2%AD%EC%97%AD%EC%A0%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5628167,126.9769336",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20231017_279%2F1697539926156cg04m_JPEG%2F%25B1%25E8%25B0%25A1%25B3%25D7.jpg",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA4MTVfMjUx%2FMDAxNzg2Nzg0ODU2Njg3.Me__q_kaLxBCyUJ7HErZxGnbx_AJcxtnMzB6eYj5ZTAg.U3I_35pT-DY3pQvE3tLDDBCTKa2yPMtdjztHiYftbp4g.JPEG%2FIMG%25A3%25DF8782.jpg%23900x1200&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA3MjdfMTEz%2FMDAxNzg1MTI4NDQ5NDQz.h4jzpzS50bhNvM3cg7eotmIC4vKQ76bUYbi6g1CejQQg.JZkH7_xMRFx5huMOVwLz0Uo9iFFs6Nq7Zi_8zlTB5ZUg.JPEG%2Foutput%25A3%25DF2173993007.jpg%23900x1154&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA4MjZfMjkg%2FMDAxNzg3NzIyMzk2MDc3.rJiHzC9qX92eiZ_SOR2pMfZr6NI6UUPVIMeUhsyS5ggg.8bH_VtdFM_g8Y12rNsUZNKWP6OXIiT9z8Evz-Fvk1V0g.JPEG%2FSE-c0c6196c-a04d-11f1-98c7-ff887e500223.jpg%23894x547&type=ff192_192"
    ]
  },
  {
    "id": 30,
    "name": "광화문특고기(시청점)",
    "category": "한식",
    "badge": "🌙 저녁가능",
    "rating": 4.3,
    "reviewCount": 252,
    "address": "서울 중구 서소문로 134-6 (세종대로11길 43)",
    "building": "세종대로11길 43",
    "phone": "02-773-9222",
    "hours": "평일 11:00-24:00, 주말 11:00-22:00",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.5634452,
    "lng": 126.9758969,
    "imageUrl": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjAzMDZfNzcg%2FMDAxNzcyNzk0ODI1NjE4.svMboWgmgUUqrPOqVfTM3diao3D1yeNMaYNuc_L1pkcg.ga0LypTq8MVm6tj82cYSV5g8W0eqQuwXvlL5KGBLWsYg.JPEG%2FIMG%25A3%25DF5612.jpg%23900x676&type=ff192_192",
    "summary": "흑돼지오겹살(17,000), 점심제육쌈밥(10,000), 된장술밥(8,000)",
    "tip": "점심에는 쌈채소 무한 제육쌈밥정식, 저녁에는 흑돼지 구이.",
    "menus": [
      {
        "name": "흑돼지오겹살(17",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "점심제육쌈밥(10",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "된장술밥(8",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EA%B4%91%ED%99%94%EB%AC%B8%ED%8A%B9%EA%B3%A0%EA%B8%B0%20%EC%8B%9C%EC%B2%AD%EC%A0%90",
    "kakaoUrl": "https://map.kakao.com/link/map/%EA%B4%91%ED%99%94%EB%AC%B8%ED%8A%B9%EA%B3%A0%EA%B8%B0%20%EC%8B%9C%EC%B2%AD%EC%A0%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5634452,126.9758969",
    "buildingLat": 37.56215,
    "buildingLng": 126.97425,
    "buildingName": "서소문 먹자골목",
    "images": [
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjAzMDZfNzcg%2FMDAxNzcyNzk0ODI1NjE4.svMboWgmgUUqrPOqVfTM3diao3D1yeNMaYNuc_L1pkcg.ga0LypTq8MVm6tj82cYSV5g8W0eqQuwXvlL5KGBLWsYg.JPEG%2FIMG%25A3%25DF5612.jpg%23900x676&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA5MTZfMTYg%2FMDAxNzg5NTY1NDU4MTU0.pUDdO0Axs2_mzb0kfvKIJVFwqklED5j5eqBHEKJRl-sg.v5EOpxW_ib9EXPfPKugApbdvsRUg7nByFW3wmqtLmQQg.JPEG%2FIMG%25A3%25DF4633.jpg%23900x676&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA5MDdfNDMg%2FMDAxNzg4NzkxNjY0NDIy.cOVvU28_q5gXc7l0iMKye6p47w6Kdxueo4cW8h4ysJIg.K65KY9KXv_BqTUtmBRGZQdPX0plX7_DSTUUrOcmQUT8g.JPEG%2FIMG%25A3%25DF8785.jpg%23900x676&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTExMTlfMTU4%2FMDAxNzYzNTIxMTQ0NzM5.wM8dMY6gyS_d__apfM1nX8L59r6fpcmUHUAUmRkMD_sg.f_2cnpkKUQ049s4N-phHJxTrMCtbAtNVgwarzHxXk-Eg.JPEG%2FIMG%25A3%25DF8177.jpg%23900x1200&type=f238_208"
    ]
  },
  {
    "id": 31,
    "name": "십원집",
    "category": "한식",
    "badge": "🌙 저녁가능",
    "rating": 4.4,
    "reviewCount": 182,
    "address": "서울 중구 서소문로 134-6 (세종대로11길 38)",
    "building": "세종대로11길 38",
    "phone": "02-777-9222",
    "hours": "매일 10:00-22:00",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.5634545,
    "lng": 126.975885,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20190716_44%2F1563261944298h3Vo9_JPEG%2FbXaMmS9Cb2oUPllLJtYcEA9R.jpg",
    "summary": "연탄초벌삼겹살(13,000), 파불고기(12,000), 마약고추장(13,000)",
    "tip": "연탄불에 초벌구이해 불향이 진하게 배어있는 연탄 불고기.",
    "menus": [
      {
        "name": "연탄초벌삼겹살(13",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "파불고기(12",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "마약고추장(13",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%8B%9C%EC%B2%AD%EC%97%AD%20%EC%84%9C%EC%86%8C%EB%AC%B8%20%EC%8B%AD%EC%9B%90%EC%A7%91",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%8B%AD%EC%9B%90%EC%A7%91%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5634545,126.975885",
    "buildingLat": 37.56215,
    "buildingLng": 126.97425,
    "buildingName": "서소문 먹자골목",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20190716_44%2F1563261944298h3Vo9_JPEG%2FbXaMmS9Cb2oUPllLJtYcEA9R.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20190916_29%2F1568601307332t0LdA_JPEG%2FJ9sWgF5T9TobuJG9Dc2DfDfn.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjAzMTBfMjU1%2FMDAxNzczMDk4OTU1NTkx.DNeWzFe1MhKLH4-7RuYTqmZ_iudC390l53GfimzuxU8g.hfK-e9d_ULwmae6WzKwm8n6M7Hw76WU-AS1D2FsRVvog.JPEG%2FIMG%25EF%25BC%25BF4077.jpg%2F900x900",
      "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20190716_44%2F1563261944298h3Vo9_JPEG%2FbXaMmS9Cb2oUPllLJtYcEA9R.jpg"
    ]
  },
  {
    "id": 32,
    "name": "조조순대 정동집",
    "category": "한식",
    "badge": "🌙 저녁가능 · ⭐ 직장인인기",
    "rating": 4.6,
    "reviewCount": 339,
    "address": "서울 중구 서소문로 134-6 (위치 추정) (서소문로 109)",
    "building": "서소문로 109",
    "phone": "매장 확인",
    "hours": "평일 운영 (식권대장 이용시간 준수)",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.5634452,
    "lng": 126.9758969,
    "imageUrl": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA5MTFfMjkx%2FMDAxNzg5MTAzMTk4MzIz.YqyYppEUMUwlxXwkkVSkGIrGrjciqRSjv7BPEs8yzH8g.rzwj_VCWanWXIW6G4Rd8Aq-hnjE_ufoITDLB6Tpt6s8g.JPEG%2FIMG%25A3%25DF4968.JPG%23900x676&type=ff192_192",
    "summary": "조조순대국(10,000), 얼큰순대국(11,000), 편육세트(14,000)",
    "tip": "진하고 뽀얀 사골 순대국. 겉절이 김치가 일품.",
    "menus": [
      {
        "name": "조조순대국(10",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "얼큰순대국(11",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "편육세트(14",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%A1%B0%EC%A1%B0%EC%88%9C%EB%8C%80%20%EC%A0%95%EB%8F%99%EC%A7%91",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%A1%B0%EC%A1%B0%EC%88%9C%EB%8C%80%20%EC%A0%95%EB%8F%99%EC%A7%91%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5634452,126.9758969",
    "images": [
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA5MTFfMjkx%2FMDAxNzg5MTAzMTk4MzIz.YqyYppEUMUwlxXwkkVSkGIrGrjciqRSjv7BPEs8yzH8g.rzwj_VCWanWXIW6G4Rd8Aq-hnjE_ufoITDLB6Tpt6s8g.JPEG%2FIMG%25A3%25DF4968.JPG%23900x676&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA5MTBfMTYy%2FMDAxNzg4OTkzNDg0NjY2.J9FkRz4CiafEy514jILI7IOMFhnglzPAyHsZ2AA6bnog.Y68jXgY7Td4UkpEOioM-616L--JFRAKWgp2Tjd02kRog.JPEG%2F900%25A3%25DF20260910%25A3%25DF073633.jpg%23900x900&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjAzMDdfMTU0%2FMDAxNzcyODk0NDY0Mjcx.E0sF1QZulK8x6dWivqcV6k0m-zOldJmxj_eAyXwojnIg.IumyT32ROzEdeBCNTvT-kqIAFPgFEeBABcouChe6Whgg.JPEG%2Foutput%25A3%25DF1437534889.jpg%23900x1200&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjAzMDJfNjMg%2FMDAxNzcyNDYxMTk4NzQx.ucwmJ09j6X44D9CjYYiOt0pev7XtMWcdMSHzLqrgUm0g.yvioDuVszfJVV8FSbwONHXhQqs4eKMXJwlIw8S1YokQg.JPEG%2Fcopy%25A3%25DF4209F4BF%25A3%25AD3127%25A3%25AD4D4E%25A3%25AD8CFA%25A3%25ADEE83304A10BC.jpeg%23900x900&type=ff192_192"
    ]
  },
  {
    "id": 33,
    "name": "명동순대국(시청직영점)",
    "category": "한식",
    "badge": "🌙 저녁가능 · ⭐ 직장인인기",
    "rating": 4.6,
    "reviewCount": 119,
    "address": "서울 중구 세종대로11길 45 (1층) (서소문로 130)",
    "building": "서소문로 130",
    "phone": "050-71344-7461",
    "hours": "평일 운영 (식권대장 이용시간 준수)",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.561964,
    "lng": 126.9734075,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20240824_198%2F1724488825708EYMfG_JPEG%2FKakaoTalk_20240824_173916565.jpg",
    "summary": "명동순대국(10,000), 머리고기수육(23,000), 술국(18,000)",
    "tip": "건더기가 푸짐하게 들어있는 서소문 골목 대표 순대국집.",
    "menus": [
      {
        "name": "명동순대국(10",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "머리고기수육(23",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "술국(18",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EB%AA%85%EB%8F%99%EC%88%9C%EB%8C%80%EA%B5%AD%20%EC%8B%9C%EC%B2%AD%EC%A7%81%EC%98%81%EC%A0%90",
    "kakaoUrl": "https://map.kakao.com/link/map/%EB%AA%85%EB%8F%99%EC%88%9C%EB%8C%80%EA%B5%AD%20%EC%8B%9C%EC%B2%AD%EC%A7%81%EC%98%81%EC%A0%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.561964,126.9734075",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20240824_198%2F1724488825708EYMfG_JPEG%2FKakaoTalk_20240824_173916565.jpg",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTA1MzFfMjI1%2FMDAxNzQ4Njc1NjIyNzIz.auetxQwY_HbwltUNQ4ibntUqZ256YXBoiXaMHL_aSJwg.JK3HqUYQ91Fhv6caX0itxyBsNyv9mSBCUbRU88BCJ5kg.JPEG%2FIMG%25A3%25DF1178.JPG%231200x900&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDA5MTVfMTEx%2FMDAxNzI2MzY1MzQ2MTcy.fjST8g89Po56cHwQt_osCZGA_zp0Ql2x1ShrkjOjRoAg.Swqq4wwdcLIwipKCWTJltqZWmuedFeZkdxCxinEcdawg.JPEG%2FIMG_9594.jpg%23900x1200&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDEwMjBfMjE2%2FMDAxNzI5NDMxMTIxNjg5.Hv-EMQgjRR-_sQbDbY24S54WaNGUwt_7trCZ9aQOhqIg.OvzDInJFA1b56oHD7iwbgMLlImPIZR8Qrl9NskaWQiYg.JPEG%2FIMG_5881.jpg%233024x4032&type=ff192_192"
    ]
  },
  {
    "id": 34,
    "name": "가락",
    "category": "한식",
    "badge": "⭐ 직장인인기",
    "rating": 4.7,
    "reviewCount": 85,
    "address": "서울 중구 시청 인근 (위치 추정) (세종대로11길 인근)",
    "building": "세종대로11길 인근",
    "phone": "매장 확인",
    "hours": "평일 운영 (식권대장 이용시간 준수)",
    "breakfast": false,
    "lunch": true,
    "dinner": false,
    "lat": 37.56215,
    "lng": 126.97395,
    "imageUrl": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA5MDhfMTQ4%2FMDAxNzg4ODU1OTEzNzgw.F1N-8Wwc2egEKIuJZ3DOfbcfv0UUzSFsVmf1cUY0_Zgg.65J9ArGhyfRm0hD-h22KYLLO_fCfHBiw7LWmtYo8AWog.JPEG%2FIMG%25A3%25DF2370.jpg%23900x676&type=ff192_192",
    "summary": "가락우동(7,500), 유부우동(8,500), 비빔국수(8,000)",
    "tip": "진한 멸치 디포리 육수로 끓여낸 정통 가락국수 노포.",
    "menus": [
      {
        "name": "가락우동(7",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "유부우동(8",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "비빔국수(8",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%8B%9C%EC%B2%AD%EC%97%AD%20%EC%84%9C%EC%86%8C%EB%AC%B8%20%EA%B0%80%EB%9D%BD",
    "kakaoUrl": "https://map.kakao.com/link/map/%EA%B0%80%EB%9D%BD%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.56215,126.97395",
    "images": [
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA5MDhfMTQ4%2FMDAxNzg4ODU1OTEzNzgw.F1N-8Wwc2egEKIuJZ3DOfbcfv0UUzSFsVmf1cUY0_Zgg.65J9ArGhyfRm0hD-h22KYLLO_fCfHBiw7LWmtYo8AWog.JPEG%2FIMG%25A3%25DF2370.jpg%23900x676&type=ff192_192",
      "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250123_194%2F1737600958289IeLpK_JPEG%2FIMG_4478.jpeg",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA5MDdfNTEg%2FMDAxNzg4Nzc5MjE3MDgx.X5o5gb_Mg_5M63VLr9KobhNJ3HZKTDMsB27c1pqwM8Yg.Jw7cIYejoDVMaljQkulA6jjQwRRqbx05JJtlqgUunZcg.JPEG%2FIMG%25A3%25DF9477.JPG%23900x1200&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA5MDlfMTI5%2FMDAxNzg4OTYwNjQxOTA5.y1nIojrV3a7VICScZZM71u8euq-6a-Y-Mtn_CM4Dn4cg.-izi4v_VKV3Tt3rZxr55LoDNvTWgtSyOVmSQGzLnbD8g.JPEG%2FKakaoTalk_20260909_222948178.jpg%232566x3421&type=ff192_192"
    ]
  },
  {
    "id": 35,
    "name": "이자카야나무(시청점)",
    "category": "일식",
    "badge": "🌙 저녁가능 · ⭐ 직장인인기",
    "rating": 4.5,
    "reviewCount": 206,
    "address": "서울 중구 남대문로1길 37 (세종대로11길 35)",
    "building": "세종대로11길 35",
    "phone": "02-777-6787",
    "hours": "월-금 11:30-05:00 (브레이크 14:30-16:30), 토·일 15:30-05:00",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.5627493,
    "lng": 126.9772644,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260126_61%2F176939216496161BJy_JPEG%2FKakaoTalk_20260123_131935135_03.jpg",
    "summary": "사케동/연어덮밥(12,000), 돈카츠정식(11,000), 모듬초밥(15,000)",
    "tip": "점심 덮밥/돈카츠 정식, 저녁에는 프라이빗 룸 이자카야 회식.",
    "menus": [
      {
        "name": "사케동/연어덮밥(12",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "돈카츠정식(11",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "모듬초밥(15",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%9D%B4%EC%9E%90%EC%B9%B4%EC%95%BC%EB%82%98%EB%AC%B4%20%EC%8B%9C%EC%B2%AD%EC%A0%90",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%9D%B4%EC%9E%90%EC%B9%B4%EC%95%BC%EB%82%98%EB%AC%B4%20%EC%8B%9C%EC%B2%AD%EC%A0%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5627493,126.9772644",
    "buildingLat": 37.56215,
    "buildingLng": 126.97425,
    "buildingName": "서소문 먹자골목",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260126_61%2F176939216496161BJy_JPEG%2FKakaoTalk_20260123_131935135_03.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260126_290%2F1769392176287K1iJt_JPEG%2F%25C0%25CC%25C0%25DA%25C4%25AB%25BE%25DF-%25B3%25AA%25B9%25AB_%25B3%25D7%25C0%25CC%25B9%25F6-%25C7%25C3%25B7%25B9%25C0%25CC%25BD%25BA-%25B8%25DE%25C0%25CE%25C0%25CC%25B9%25CC%25C1%25F6_%25B7%25EB%25B0%25AD%25C1%25B6_%25BD%25C3%25C3%25BB%25C1%25A1.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNTExMTFfMTEw%2FMDAxNzYyODM2MTE3NjMy.V0USoCYCcb-T4Wa7LTU9NfFYXuukjt9G2GXZcoeYohcg.2EGOIwc3zlK2-9hThPjbin7Lyw2tgSuXue2eLZJSqKYg.JPEG%2FIMG%25EF%25BC%25BF1131.JPG%2F900x600",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA5MTZfNjIg%2FMDAxNzg5NTQyMzI0Mjcy.609jTjeqleLvT822bR6BdeJX68MqOYPIC7KhKIMdggQg.3V69STOSei2BK6gLdkdzYdqfVrGRi7mBaqglPPfvNCcg.JPEG%2F17.JPG%2F5760x3840"
    ]
  },
  {
    "id": 36,
    "name": "시월애(모꼬지)",
    "category": "한식",
    "badge": "⭐ 직장인인기",
    "rating": 4.5,
    "reviewCount": 129,
    "address": "서울 중구 서소문동 120-19 (하동) (세종대로 66)",
    "building": "세종대로 66",
    "phone": "070-8654-3381",
    "hours": "평일 운영 (식권대장 이용시간 준수)",
    "breakfast": false,
    "lunch": true,
    "dinner": false,
    "lat": 37.5619703,
    "lng": 126.9733941,
    "imageUrl": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA2MzBfNDcg%2FMDAxNzgyNzk3NjQzNDEw.8PZ1MX-0uWun8Bh3jcOp13oFiEnirhjRM9mBgqpiBSsg.2GNRHO2UiTPMI3W-cpRoqgwFIsrdXim0sliHEAyPdzog.JPEG%2FIMG%25A3%25DF0084.JPG%23900x1200&type=ff192_192",
    "summary": "한우차돌된장(9,500), 제육돌솥(10,000), 낙지비빔밥(11,000)",
    "tip": "정갈한 한식 돌솥밥과 차돌된장찌개. 깔끔한 분위기.",
    "menus": [
      {
        "name": "한우차돌된장(9",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "제육돌솥(10",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "낙지비빔밥(11",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%84%9C%EC%86%8C%EB%AC%B8%20%EC%8B%9C%EC%9B%94%EC%95%A0%20%EB%AA%A8%EA%BC%AC%EC%A7%80",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%8B%9C%EC%9B%94%EC%95%A0%20%EB%AA%A8%EA%BC%AC%EC%A7%80%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5619703,126.9733941",
    "images": [
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA2MzBfNDcg%2FMDAxNzgyNzk3NjQzNDEw.8PZ1MX-0uWun8Bh3jcOp13oFiEnirhjRM9mBgqpiBSsg.2GNRHO2UiTPMI3W-cpRoqgwFIsrdXim0sliHEAyPdzog.JPEG%2FIMG%25A3%25DF0084.JPG%23900x1200&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjAxMjhfMTgg%2FMDAxNzY5NjA5OTk3NzQ4.xf4p0pD08jYYP7fJXdBk9IPB-wGKcotJmXC43tGOFAIg.qW2jYEnfibZceVJdrOqOjlgB_3z6OVwyoveUP6ta-vsg.JPEG%2F20260128_131607.jpg%234000x3000&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTAzMTlfMTE2%2FMDAxNzQyMzU2MDAwNTI2.YIbbMSlcMU0QDeseJUO1679tA_rkJNPQ-EINzWHbn94g.CP4jKcOmfdhMPG5UBfFK3iu_V_v_fn0CzHGw1hOxHo0g.JPEG%2F900%25A3%25DF20250319%25A3%25DF114923.jpg%23900x900&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTA0MTNfMTEy%2FMDAxNzQ0NTI1NDIwMDg1.K18UqKlbgJR0yCNKQ0Unpt5gEzklIpqOCJi241gKcokg.rVQB1KJgYpbG-lf6nC3BRinLUgQuYruI8UQXebkNspEg.JPEG%2F900%25A3%25DF20250407%25A3%25DF121425.jpg%23922x1222&type=ff192_192"
    ]
  },
  {
    "id": 37,
    "name": "제주산방식당(상공회의소)",
    "category": "한식",
    "badge": "🌅 조식가능 · 🌙 저녁가능 · ⭐ 직장인인기",
    "rating": 4.5,
    "reviewCount": 206,
    "address": "서울 중구 세종대로 39 (대한상공회의소 지하1층) (대한상공회의소 지하 2층)",
    "building": "대한상공회의소 지하 2층",
    "phone": "매장 확인",
    "hours": "평일 10:30-20:00 (브레이크 15:00-17:00), 토 11:00-15:00 (일요일 휴무)",
    "breakfast": true,
    "lunch": true,
    "dinner": true,
    "lat": 37.5607099,
    "lng": 126.9737772,
    "imageUrl": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA1MTFfMTY1%2FMDAxNzc4NDg3ODU0OTg0.Sx9NluLskl2Iy7ArlsVrUnnkvs_hRTWabqrvL_76cdwg.IKd2ZzBhldmSLKqqQpDq0bz7wBSYN-UgIK_uVo79n6Yg.JPEG%2FIMG%25A3%25DF2267.jpg%23900x900&type=ff192_192",
    "summary": "제주비빔밀면(9,500), 제주온면(9,500), 산방수육(17,000)",
    "tip": "조식 지원. 제주도 전통 쫄깃한 밀면과 담백한 수육 조합 인기.",
    "menus": [
      {
        "name": "제주비빔밀면(9",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "제주온면(9",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "산방수육(17",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%A0%9C%EC%A3%BC%EC%82%B0%EB%B0%A9%EC%8B%9D%EB%8B%B9%20%EC%83%81%EA%B3%B5%ED%9A%8C%EC%9D%98%EC%86%8C",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%A0%9C%EC%A3%BC%EC%82%B0%EB%B0%A9%EC%8B%9D%EB%8B%B9%20%EC%83%81%EA%B3%B5%ED%9A%8C%EC%9D%98%EC%86%8C%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5607099,126.9737772",
    "buildingCluster": "대한상공회의소",
    "buildingLat": 37.56012,
    "buildingLng": 126.97495,
    "buildingName": "대한상공회의소",
    "images": [
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA1MTFfMTY1%2FMDAxNzc4NDg3ODU0OTg0.Sx9NluLskl2Iy7ArlsVrUnnkvs_hRTWabqrvL_76cdwg.IKd2ZzBhldmSLKqqQpDq0bz7wBSYN-UgIK_uVo79n6Yg.JPEG%2FIMG%25A3%25DF2267.jpg%23900x900&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA3MzBfNjUg%2FMDAxNzg1NDE2Mzg0MjA3.Hn0j3eqmZf93AW5DzA7bqoCg2qHchcasHBKq52X7VH0g.7nL2HW8sL3qerPjT1gu4XK6XRygJS3wZPQfzph_XV18g.PNG%2FGemini_Generated_Image_7bgp107bgp107bgp.png%232048x2048&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA2MjlfMTIz%2FMDAxNzgyNzE3MTIwNDEy.Hq6zyJfiKWfK4926V4pQbmdmgiz7hcRdJjrl9oOLzbMg.0croEIwz7bY-6t5FJ0Mpaoe8TXrY7lkv0xPLWdAHfawg.JPEG%2FIMG%25A3%25DF6409.jpg%23900x1200&type=ff192_192",
      "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20190428_5%2F15564435852767SXGI_PNG%2Fufb6DRwGBV1OJFs5b24kWX1-.png"
    ]
  },
  {
    "id": 38,
    "name": "홍대돈부리(상공회의소)",
    "category": "일식",
    "badge": "🌅 조식가능 · 🌙 저녁가능",
    "rating": 4.2,
    "reviewCount": 120,
    "address": "서울 중구 세종대로 39 (대한상공회의소 지하1층) (대한상공회의소 지하 2층)",
    "building": "대한상공회의소 지하 2층",
    "phone": "매장 확인",
    "hours": "평일 운영 (식권대장 이용시간 준수)",
    "breakfast": true,
    "lunch": true,
    "dinner": true,
    "lat": 37.5607136,
    "lng": 126.9737753,
    "imageUrl": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA5MDNfMjEz%2FMDAxNzg4NDE3NjQ2MjI2.tWLbI-jLHR0CPUg0iqE-tY3XW2K1u2zulsoJJhVeBVAg.LX0Lvc_B-p4zFPzICOKjADCxYANZoFnwkjtIYeYnPxEg.PNG%2FIMB%25A3%25DFvkR3B3.png%23900x675&type=ff192_192",
    "summary": "가츠동(9,500), 사케동(13,000), 에비동(10,500)",
    "tip": "조식 지원. 두툼한 돈카츠 덮밥과 생연어 덮밥 전문점.",
    "menus": [
      {
        "name": "가츠동(9",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "사케동(13",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "에비동(10",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%ED%99%8D%EB%8C%80%EB%8F%88%EB%B6%80%EB%A6%AC%20%EC%83%81%EA%B3%B5%ED%9A%8C%EC%9D%98%EC%86%8C",
    "kakaoUrl": "https://map.kakao.com/link/map/%ED%99%8D%EB%8C%80%EB%8F%88%EB%B6%80%EB%A6%AC%20%EC%83%81%EA%B3%B5%ED%9A%8C%EC%9D%98%EC%86%8C%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5607136,126.9737753",
    "buildingCluster": "대한상공회의소",
    "buildingLat": 37.56012,
    "buildingLng": 126.97495,
    "buildingName": "대한상공회의소",
    "images": [
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA5MDNfMjEz%2FMDAxNzg4NDE3NjQ2MjI2.tWLbI-jLHR0CPUg0iqE-tY3XW2K1u2zulsoJJhVeBVAg.LX0Lvc_B-p4zFPzICOKjADCxYANZoFnwkjtIYeYnPxEg.PNG%2FIMB%25A3%25DFvkR3B3.png%23900x675&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA1MjVfNjUg%2FMDAxNzc5NzEwOTY0NjQx.eEBkFfMxAEtzniboC49G60tHRzzwoROokzVBqqOWHjAg.jr2Cz052vvAkgG6eg7ZisBwMu9D4EVGeBYP9ewKpJHEg.JPEG%2FKakaoTalk_20260524_230106149.jpg%233024x4032&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTA3MjBfMjEg%2FMDAxNzUyOTg0ODIzNzE2.pCL6czqy9QeqW6HQnW8gw3ekRNIqPhP0cdFUZUJuCjUg.pOe8q3a-H1RDcRuxGkpRbHwQwY9TsnNal7V11b-RaW8g.JPEG%2FIMG%25A3%25DF0601.JPG%23900x1200&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTA4MDNfMjMy%2FMDAxNzU0MTk2MTk2MTA3.WHk-O5YfGCTJMrMZ9DbZIS0_JxsipzUXW2EceI5QyCcg.5CPmFqIuPyT-pKmHTq8Ac3EVNGfJR2I4x5g-7rccVt4g.JPEG%2F900%25A3%25DF1754195883274.jpg%23900x674&type=ff192_192"
    ]
  },
  {
    "id": 39,
    "name": "KFC 시청역",
    "category": "양식",
    "badge": "⭐ 직장인인기",
    "rating": 4.8,
    "reviewCount": 134,
    "address": "서울 중구 서소문로 136 (세종대로 76-1)",
    "building": "세종대로 76-1",
    "phone": "매장 확인",
    "hours": "평일 운영 (식권대장 이용시간 준수)",
    "breakfast": false,
    "lunch": true,
    "dinner": false,
    "lat": 37.56356,
    "lng": 126.9760425,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260716_187%2F1784181390835N1tnT_JPEG%2F%25B9%25E8%25B0%25E6.jpg",
    "summary": "징거버거세트(7,900), 오리지널치킨(3,000), 트위스터(4,500)",
    "tip": "빠른 패스트푸드 점심. 갓 튀긴 핫크리스피 치킨.",
    "menus": [
      {
        "name": "징거버거세트(7",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "900)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "오리지널치킨(3",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "트위스터(4",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/KFC%20%EC%8B%9C%EC%B2%AD%EC%97%AD",
    "kakaoUrl": "https://map.kakao.com/link/map/KFC%20%EC%8B%9C%EC%B2%AD%EC%97%AD%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.56356,126.9760425",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260716_187%2F1784181390835N1tnT_JPEG%2F%25B9%25E8%25B0%25E6.jpg",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA5MTVfMTU0%2FMDAxNzg5NDMyMTY5OTEx.Al-3OM8jVEn38IGqVF4g6HcLdPYkgzPgoJINhz_Mgosg.y2JXzpDMdeCk0piY9cMbaoKBOjv_vK6i8ZWrlH9u7oAg.JPEG%2F20260725_215950.jpg%234000x3000&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA5MTJfMTUg%2FMDAxNzg5MTQyODM5Mzgw._jBEsjIfREC4PnDiBBIZm4pfvLXwadzUY5Fr5vhpCIcg.q-toCu3x_Y1GjtA-S-QSGk83xt0PnsJ1fiI8uiyq60Ig.PNG%2F%25C1%25A6%25B8%25F1%25C0%25BB_%25C0%25D4%25B7%25C2%25C7%25D8%25C1%25D6%25BC%25BC%25BF%25E4._%25281%2529.png%231000x1000&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA5MDRfMjI2%2FMDAxNzg4NTIyMzE5ODI5._7isHZpmyzZvkpf1my3TFq8JNmaysWnl813AkLatQS0g.u6WKecsS110RME04Dg7zGVdlqhu7F5g-W7NzwgZVTmQg.JPEG%2FIMG%25A3%25DF3932.JPG%23900x900&type=ff192_192"
    ]
  },
  {
    "id": 40,
    "name": "슬로우캘리(서울시청역점)",
    "category": "양식",
    "badge": "🌙 저녁가능 · ⭐ 직장인인기",
    "rating": 4.6,
    "reviewCount": 191,
    "address": "서울 중구 서소문로 134 (세종대로 72 B1)",
    "building": "세종대로 72 B1",
    "phone": "02-752-3442",
    "hours": "월-금 10:00-20:30",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.5635964,
    "lng": 126.9758636,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20240820_205%2F1724144198251mKna9_JPEG%2F%25BD%25BD%25B7%25CE%25BF%25EC%25C4%25B6%25B8%25AE_%25BC%25AD%25BF%25EF%25BD%25C3%25C3%25BB%25BF%25AA%25C1%25A1_-_%25BB%25EE%25C0%25BA_%25B0%25E8%25B6%25F5_%25BC%25AD%25BA%25F1%25BD%25BA_-_%25B3%25D7%25C0%25CC%25B9%25F6_%25BD%25BA%25B8%25B6%25C6%25AE_%25C7%25C3%25B7%25B9%25C0%25CC%25BD%25BA%25BF%25EB_2024_08_20.jpg",
    "summary": "클래식연어포케(12,500), 스파이시참치(11,500), 부채살스테이크(13,500)",
    "tip": "현미밥과 신선한 채소, 연어가 듬뿍 들어간 다이어트 포케 샐러드.",
    "menus": [
      {
        "name": "클래식연어포케(12",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "스파이시참치(11",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "부채살스테이크(13",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%8A%AC%EB%A1%9C%EC%9A%B0%EC%BA%98%EB%A6%AC%20%EC%84%9C%EC%9A%B8%EC%8B%9C%EC%B2%AD%EC%97%AD%EC%A0%90",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%8A%AC%EB%A1%9C%EC%9A%B0%EC%BA%98%EB%A6%AC%20%EC%84%9C%EC%9A%B8%EC%8B%9C%EC%B2%AD%EC%97%AD%EC%A0%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5635964,126.9758636",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20240820_205%2F1724144198251mKna9_JPEG%2F%25BD%25BD%25B7%25CE%25BF%25EC%25C4%25B6%25B8%25AE_%25BC%25AD%25BF%25EF%25BD%25C3%25C3%25BB%25BF%25AA%25C1%25A1_-_%25BB%25EE%25C0%25BA_%25B0%25E8%25B6%25F5_%25BC%25AD%25BA%25F1%25BD%25BA_-_%25B3%25D7%25C0%25CC%25B9%25F6_%25BD%25BA%25B8%25B6%25C6%25AE_%25C7%25C3%25B7%25B9%25C0%25CC%25BD%25BA%25BF%25EB_2024_08_20.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA4MjVfNjEg%2FMDAxNzg3NjMxOTI5NTY2.7akd3jx04B91-lqqj-OXm04mryFm9FfeDIhckvJNTywg.SZGqaJRSNqRTOQdveQtPBkXV7x4TGdgb0q8fZvZYtUsg.JPEG%2FIMG%25EF%25BC%25BF7850.JPG%2F3024x4032",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA4MjVfOTkg%2FMDAxNzg3NjMxOTUyNTEy.T0_Htl9Et9_usT66z1auHRp82Z_0j6Q1LDylzrkpyY8g.gDntEzsBtSzXu1cfkxzBKO9sNhNeBWmjOQnmfonnMyIg.JPEG%2FIMG%25EF%25BC%25BF7730.JPG%2F3024x4032",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA2MjRfMTY2%2FMDAxNzgyMjg0MzIyMDUz.qfGQMGy2QXkDmSRVqHP647gE4ssxtRVs6ebvc1S159Qg.76uOt4CaX8frHLAL_JBIawWBUP8Ki6ak_8h86_FJl5Ag.JPEG%2FIMG%25EF%25BC%25BF5994.JPG%2F3024x4032"
    ]
  },
  {
    "id": 41,
    "name": "청진동해장국 북창점",
    "category": "한식",
    "badge": "🌙 저녁가능",
    "rating": 4.4,
    "reviewCount": 226,
    "address": "서울 중구 남대문로1길 18 (남대문로4가 17-4)",
    "building": "남대문로4가 17-4",
    "phone": "02-753-7580",
    "hours": "화-일 24시간 영업, 월요일만 08:00-24:00",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.5619596,
    "lng": 126.9775341,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20200219_260%2F15820839386421ORlr_JPEG%2FTgblRax7P6jcEqHj890jS6rj.jpeg.jpg",
    "summary": "양선지해장국(10,000), 뼈다귀해장국(10,000), 선지추가(무료)",
    "tip": "칼칼하고 깊은 국물의 양선지 해장국. 24시간 스타일 노포.",
    "menus": [
      {
        "name": "양선지해장국(10",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "뼈다귀해장국(10",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "선지추가",
        "price": "무료",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%B2%AD%EC%A7%84%EB%8F%99%ED%95%B4%EC%9E%A5%EA%B5%AD%20%EB%B6%81%EC%B0%BD%EC%A0%90",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%B2%AD%EC%A7%84%EB%8F%99%ED%95%B4%EC%9E%A5%EA%B5%AD%20%EB%B6%81%EC%B0%BD%EC%A0%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5619596,126.9775341",
    "buildingLat": 37.56135,
    "buildingLng": 126.9783,
    "buildingName": "북창동 음식거리",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20200219_260%2F15820839386421ORlr_JPEG%2FTgblRax7P6jcEqHj890jS6rj.jpeg.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA0MjZfMTA4%2FMDAxNzc3MTkwODAwODI5.LFFKvggD_y8v6bE7AfztwL3gaWsTwPKVOpS97C9PqQkg.a2jkndzNgNbV3vHCq853JCe9dpo4FwsLIke_3usmiOcg.JPEG%2FKakaoTalk_20260405_173028284_25.jpg%2F2992x2992",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA5MTdfNjIg%2FMDAxNzg5NTk4MDkzOTc0.CkmD6Nq_FWEEcH02UtqsDU8hh4XdSslLczCTgJ_X8TIg.TBoinilUmx80DERTDJmgBtDQMpm25tOsL1jNvVmeh6kg.JPEG%2F900_20260906_105534.jpg%2F900x1200",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA5MTdfNDQg%2FMDAxNzg5NTk4MDk0ODQ2.uUXGb8dED8XTHfS3ToHpwg86RS8ed0xCQ8qUv-oD-sYg.KBhhlOBIeXAU2WAp6ZnjiLIjSMvqOZeS9DHnU66pnIAg.JPEG%2F900_20260906_105540.jpg%2F900x675"
    ]
  },
  {
    "id": 42,
    "name": "북창동순두부(본점)",
    "category": "한식",
    "badge": "🌙 저녁가능 · ⭐ 직장인인기",
    "rating": 4.5,
    "reviewCount": 176,
    "address": "서울 중구 세종대로 78 (세종대로 78 1층)",
    "building": "세종대로 78 1층",
    "phone": "02-318-4350",
    "hours": "평일 10:00-20:00 (브레이크 15:00-16:30)",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.5631376,
    "lng": 126.9769761,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20221104_95%2F1667519154754FCY9g_PNG%2F%25C2%25EE%25B0%25B3_%25B2%25FA%25B4%25C2%25B8%25F0%25BD%25C0_%25282%2529.png",
    "summary": "북창동순두부(10,500), 솥밥기본제공, 고등어구이정식(13,000)",
    "tip": "전국 북창동순두부의 원조 본점. 갓 지은 솥밥과 날계란 제공.",
    "menus": [
      {
        "name": "북창동순두부(10",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "솥밥기본제공",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "고등어구이정식(13",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EB%B6%81%EC%B0%BD%EB%8F%99%EC%88%9C%EB%91%90%EB%B6%80%20%EB%B3%B8%EC%A0%90",
    "kakaoUrl": "https://map.kakao.com/link/map/%EB%B6%81%EC%B0%BD%EB%8F%99%EC%88%9C%EB%91%90%EB%B6%80%20%EB%B3%B8%EC%A0%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5631376,126.9769761",
    "buildingLat": 37.56135,
    "buildingLng": 126.9783,
    "buildingName": "북창동 음식거리",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20221104_95%2F1667519154754FCY9g_PNG%2F%25C2%25EE%25B0%25B3_%25B2%25FA%25B4%25C2%25B8%25F0%25BD%25C0_%25282%2529.png",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20200804_54%2F1596507655568oNc3w_JPEG%2F%25BA%25CF%25C3%25A2%25B5%25BF%25BC%25F8%25B5%25CE%25BA%25CE-3%2528%25BA%25CE%25B5%25E5%25B7%25B4%25B0%25D4%2529.mp4_20190128_144923.338.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA5MDJfMjU0%2FMDAxNzg4MzQwOTMwMTE4.0sqzeqxzmGAIdx4o1D0AfDcSeu1gHCgmvO-jjWQHeF8g.C7jshlFdT3Nhc0iyi_G8BH4DOUy5DCnVENgMOFEh0W0g.JPEG%2F45AABD78%25EF%25BC%258DCCD6%25EF%25BC%258D49C3%25EF%25BC%258DA59C%25EF%25BC%258D86CA206F6F07.jpg%2F900x1200",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA1MjNfMTYw%2FMDAxNzc5NTQ0NTY1MzAy.HW2iw23lCCPPbYxFlSP7fT1U8aFqmaW-x2UYmM11YN8g.O3hb0LZcryLexPxPLKcT6CCQM4GqBPWLOxFu1QP-Qwkg.JPEG%2Foutput%25EF%25BC%25BF2949362929.jpg%2F900x900"
    ]
  },
  {
    "id": 43,
    "name": "담원순대",
    "category": "한식",
    "badge": "🌙 저녁가능 · ⭐ 직장인인기",
    "rating": 4.6,
    "reviewCount": 164,
    "address": "서울 중구 세종대로9길 52 (1층) (세종대로 82)",
    "building": "세종대로 82",
    "phone": "050-71342-7210",
    "hours": "평일 09:20-22:00 (브레이크 15:00-17:00), 토 09:20-15:00 (일요일 휴무)",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.5619522,
    "lng": 126.9731836,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20240518_131%2F1716016630894shBcs_JPEG%2F1000052170.jpg",
    "summary": "담원순대국(10,000), 얼큰순대국(10,500), 오징어순대(18,000)",
    "tip": "고기 양이 많고 누린내 없이 진한 프리미엄 순대국.",
    "menus": [
      {
        "name": "담원순대국(10",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "얼큰순대국(10",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "오징어순대(18",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%8B%9C%EC%B2%AD%EC%97%AD%20%EB%8B%B4%EC%9B%90%EC%88%9C%EB%8C%80",
    "kakaoUrl": "https://map.kakao.com/link/map/%EB%8B%B4%EC%9B%90%EC%88%9C%EB%8C%80%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5619522,126.9731836",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20240518_131%2F1716016630894shBcs_JPEG%2F1000052170.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250623_84%2F1750674918227ulMTx_JPEG%2FKakaoTalk_20250621_180533470_15.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA3MDZfNTAg%2FMDAxNzgzMzA4NDY1MTUy.9G5tlma26zjdVCb45Xb70lh_66uddzHgdrTUrnCTHigg.qflKz0RgpQxTPlVR3CBb1uD2s-UrNhxWXHLNtywMEQAg.JPEG%2F900_20260702_140117.jpg%2F900x675",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNTExMTJfMjI0%2FMDAxNzYyOTA0NDIwNDE4.-D7R-efF5wsZp_GpYa1JROlFpo0LEmhMbnGlQl25--Qg.TY79BRsdZ7LXcHyhpikepImTnck96n1MbkVGoueuYNsg.JPEG%2FIMG%25EF%25BC%25BF2978.jpg%2F900x1200"
    ]
  },
  {
    "id": 44,
    "name": "송쉐프 숭례문점",
    "category": "중식",
    "badge": "🌅 조식가능 · 🌙 저녁가능 · ⭐ 직장인인기",
    "rating": 4.5,
    "reviewCount": 278,
    "address": "서울 중구 세종대로 39 (대한상공회의소 지하1층) (세종대로 39 상의회관 인근)",
    "building": "세종대로 39 상의회관 인근",
    "phone": "매장 확인",
    "hours": "매일 11:00-21:30 (브레이크 15:00-17:00, 평일만)",
    "breakfast": true,
    "lunch": true,
    "dinner": true,
    "lat": 37.5607137,
    "lng": 126.9737753,
    "imageUrl": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjAxMjlfMjUy%2FMDAxNzY5Njg0OTQ1ODg0.aLL-NbG5B3n3A0CorxOkAkbpno9vNwX2ZMl9L213GgMg.HSf5itsJlF0ujDSiJ2BlAmTIQEyfc_D5MWIlOnZ_vqYg.JPEG%2F900%25A3%25DF1769684944889.jpg%23900x900&type=ff192_192",
    "summary": "옛날볶음밥(9,000), 육즙돼지고기탕수육(28,000), 삼선짬뽕(11,000)",
    "tip": "조식 지원. 이연복 셰프 추천 육즙 탕수육과 불맛 볶음밥 맛집.",
    "menus": [
      {
        "name": "옛날볶음밥(9",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "육즙돼지고기탕수육(28",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "삼선짬뽕(11",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%86%A1%EC%89%90%ED%94%84%20%EC%88%AD%EB%A1%80%EB%AC%B8%EC%A0%90",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%86%A1%EC%89%90%ED%94%84%20%EC%88%AD%EB%A1%80%EB%AC%B8%EC%A0%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5607137,126.9737753",
    "buildingCluster": "대한상공회의소",
    "buildingLat": 37.56012,
    "buildingLng": 126.97495,
    "buildingName": "대한상공회의소",
    "images": [
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjAxMjlfMjUy%2FMDAxNzY5Njg0OTQ1ODg0.aLL-NbG5B3n3A0CorxOkAkbpno9vNwX2ZMl9L213GgMg.HSf5itsJlF0ujDSiJ2BlAmTIQEyfc_D5MWIlOnZ_vqYg.JPEG%2F900%25A3%25DF1769684944889.jpg%23900x900&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA0MDZfMjI0%2FMDAxNzc1NDM2MDg0MzYw.rfXA4LqzUpMvBFYw02thhakn7IN4C-DV1bhlYtxsyDsg.-NGAadXL9LsC-edvwS0EoGFYWXjcnMSDJPQ2vSGoUFMg.JPEG%2FIMG%25A3%25DF4264.JPG%232250x2250&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA4MjFfMjI5%2FMDAxNzg3MjgzMDQ4Mjgz.LL8edFZOVqhXQdJuQ1Qo57cqJbjh4tfss5N-nStssrcg.DVepXWi_jcO0sRBvJn1HzhIcEbyC6bxDOZsI9ye6MaUg.JPEG%2FIMG%25A3%25DF2914.JPG%23900x676&type=f238_208",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA4MjFfMjAw%2FMDAxNzg3MjgzMDQ4Mjcz.1ZXqAQ0hLIOWRmc8Yg362LsbK5nBPMl7OOQbx46UkaMg.EgkJgJQpsTraqguEzurLgIIKYyRC72FQGkhyJLnU444g.JPEG%2FIMG%25A3%25DF2902.jpg%23900x1200&type=f238_208"
    ]
  },
  {
    "id": 45,
    "name": "코코이찌방야(상공회의소)",
    "category": "일식",
    "badge": "🌅 조식가능 · 🌙 저녁가능 · ⭐ 직장인인기",
    "rating": 4.7,
    "reviewCount": 280,
    "address": "서울 중구 세종대로 39 (대한상공회의소 지하1층) (대한상공회의소 지하 2층)",
    "building": "대한상공회의소 지하 2층",
    "phone": "매장 확인",
    "hours": "11:00-21:00 (브레이크 15:00-17:00, 주말·공휴일 휴무)",
    "breakfast": true,
    "lunch": true,
    "dinner": true,
    "lat": 37.5607137,
    "lng": 126.9737753,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210423_239%2F16191456287460wqsF_JPEG%2F5kRFCqVbjpk77um0A3NiFM4x.jpg",
    "summary": "로스까스카레(11,200), 치킨가라아게카레(10,500), 매운맛조절",
    "tip": "조식 지원. 매운맛 단계와 토핑을 자유롭게 조합하는 정통 카레.",
    "menus": [
      {
        "name": "로스까스카레(11",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "200)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "치킨가라아게카레(10",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "매운맛조절",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%BD%94%EC%BD%94%EC%9D%B4%EC%B0%8C%EB%B0%A9%EC%95%BC%20%EC%83%81%EA%B3%B5%ED%9A%8C%EC%9D%98%EC%86%8C",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%BD%94%EC%BD%94%EC%9D%B4%EC%B0%8C%EB%B0%A9%EC%95%BC%20%EC%83%81%EA%B3%B5%ED%9A%8C%EC%9D%98%EC%86%8C%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5607137,126.9737753",
    "buildingCluster": "대한상공회의소",
    "buildingLat": 37.56012,
    "buildingLng": 126.97495,
    "buildingName": "대한상공회의소",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210423_239%2F16191456287460wqsF_JPEG%2F5kRFCqVbjpk77um0A3NiFM4x.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210430_197%2F1619764577768cm7bo_JPEG%2FiyyWT8aiujYrBd8zpB8Xbci2.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA4MTZfMzEg%2FMDAxNzg2ODU0Njg3MzUw.obmffLZmhTnAPJYKQlajfnoJUZc8IZbahjSP0QcZjjUg.Bv0kBHGzPugaYclzJAcVabUuEIFKX4GwIECjdxPRkVcg.JPEG%2F900_20260813_114324.jpg%2F900x1200",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA4MTZfMjA4%2FMDAxNzg2ODU0Nzk4Mzcy.qg5f9YBNnC4NEe_i_VRyiOY4MYljjEJixyYmtfZ-oVsg.GNjeAWjHQG7u3iPrMBD55icKShKqLVq2ufS5SXbZ6Akg.JPEG%2F900_20260813_114637.jpg%2F900x1200"
    ]
  },
  {
    "id": 46,
    "name": "북창옥",
    "category": "한식",
    "badge": "식권대장 가맹점",
    "rating": 4.3,
    "reviewCount": 283,
    "address": "서울 중구 북창동 60 (남대문로4가 17)",
    "building": "남대문로4가 17",
    "phone": "02-772-9510",
    "hours": "평일 운영 (식권대장 이용시간 준수)",
    "breakfast": false,
    "lunch": true,
    "dinner": false,
    "lat": 37.5627917,
    "lng": 126.9774247,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260609_60%2F1780988239394yaDfJ_JPEG%2F%25BD%25C3%25C3%25BB%25B8%25C0%25C1%25FD.jpg",
    "summary": "도가니탕(16,000), 설렁탕(10,000), 모듬수육(38,000)",
    "tip": "진하게 고아낸 사골 육수의 노포 탕반 전문점.",
    "menus": [
      {
        "name": "도가니탕(16",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "설렁탕(10",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "모듬수육(38",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%8B%9C%EC%B2%AD%EC%97%AD%20%EB%B6%81%EC%B0%BD%EB%8F%99%20%EB%B6%81%EC%B0%BD%EC%98%A5",
    "kakaoUrl": "https://map.kakao.com/link/map/%EB%B6%81%EC%B0%BD%EC%98%A5%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5627917,126.9774247",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260609_60%2F1780988239394yaDfJ_JPEG%2F%25BD%25C3%25C3%25BB%25B8%25C0%25C1%25FD.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260609_68%2F1780988239246Uik5R_JPEG%2F%25BD%25C3%25C3%25BB%25B3%25C3%25B8%25E9.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA5MTRfNzQg%2FMDAxNzg5MzkyMzE4Nzcx.BFDb3lO-gYpv5HyY_TGC5q0Qv-rajVSn7-a9xRIoSE0g.dLFoVehB7O2O6DmzUUNoz6GhjtMMFIi1aB7LcFHPy0cg.JPEG%2F900_20260730_180531.jpg%2F922x1222",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjAzMDZfMTg0%2FMDAxNzcyNzc1MzM0NzQ1.Bv2DdH30ZLLBHIs9tpjf0TV5Am46n4LOqLEAQQJW5IQg.38h5YjAS75sV5keVuT8HIlbAQ-J0me7L-n62uRL3O8gg.JPEG%2F_MG_5303ST.jpg%2F1920x1280"
    ]
  },
  {
    "id": 47,
    "name": "방배김밥(상공회의소)",
    "category": "분식",
    "badge": "🌅 조식가능 · 🌙 저녁가능 · ⭐ 직장인인기",
    "rating": 4.8,
    "reviewCount": 305,
    "address": "서울 중구 세종대로 39 (대한상공회의소 지하1층) (대한상공회의소 지하 2층)",
    "building": "대한상공회의소 지하 2층",
    "phone": "매장 확인",
    "hours": "평일 운영 (식권대장 이용시간 준수)",
    "breakfast": true,
    "lunch": true,
    "dinner": true,
    "lat": 37.5607137,
    "lng": 126.9737753,
    "imageUrl": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjAxMjVfNzgg%2FMDAxNzY5MzI2NjAzNjM0.giDEYn-0YhOSzXD3ukpzW4K8rwQsY1vBb3UHMDNXR00g.jw_9-5TUhS5nV-yG8rcK0yMaTWmoeQqjjPVqei7-r8Yg.JPEG%2FIMG%25A3%25DF2377.JPG%23900x900&type=ff192_192",
    "summary": "방배김밥/유부김밥(4,500), 참치김밥(5,000), 라면(4,500)",
    "tip": "조식 지원. 볶은 유부가 고기처럼 고소한 생활의달인 김밥 맛집.",
    "menus": [
      {
        "name": "방배김밥/유부김밥(4",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "참치김밥(5",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "라면(4",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EB%B0%A9%EB%B0%B0%EA%B9%80%EB%B0%A5%20%EC%83%81%EA%B3%B5%ED%9A%8C%EC%9D%98%EC%86%8C",
    "kakaoUrl": "https://map.kakao.com/link/map/%EB%B0%A9%EB%B0%B0%EA%B9%80%EB%B0%A5%20%EC%83%81%EA%B3%B5%ED%9A%8C%EC%9D%98%EC%86%8C%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5607137,126.9737753",
    "buildingCluster": "대한상공회의소",
    "buildingLat": 37.56012,
    "buildingLng": 126.97495,
    "buildingName": "대한상공회의소",
    "images": [
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjAxMjVfNzgg%2FMDAxNzY5MzI2NjAzNjM0.giDEYn-0YhOSzXD3ukpzW4K8rwQsY1vBb3UHMDNXR00g.jw_9-5TUhS5nV-yG8rcK0yMaTWmoeQqjjPVqei7-r8Yg.JPEG%2FIMG%25A3%25DF2377.JPG%23900x900&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA3MTVfMTcz%2FMDAxNzg0MDk3NjMwNjc3.Fdi9T4Z__VHuK61nUpXXeB2iMTSLFwLqIeoeYUu4kSgg.VVGFC_Hn1aDsba1QB3fdxs7GtXq8nur1FddEGyqVdBsg.JPEG%2FIMG%25A3%25DF8952.jpg%23900x1200&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTA0MTNfMTAz%2FMDAxNzQ0NTI5MjE0ODU4.UMtVPvksQgdrtC4QQPwoSMvxNsPSGVwbqmVmoEdJDZIg.EQ62lvtRg4BnGH2m4wwehm99PwIgvWhZ0qxDeU4YgSUg.JPEG%2FIMG_4495.JPG%23900x676&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjAzMDlfMjY3%2FMDAxNzczMDU1ODIyNzQ2.WNRvUn8-7PmWPCUTL0Adf_Y1DWL-I4q78kmxGHSy5tIg.4WPqp7pXXDB3M5ck7DaPBBoXCnWqH5qGWUK8moEU-vog.JPEG%2F900%25A3%25DF20260304%25A3%25DF113736.jpg%23900x1200&type=ff192_192"
    ]
  },
  {
    "id": 48,
    "name": "누리옥",
    "category": "한식",
    "badge": "🌙 저녁가능",
    "rating": 4.2,
    "reviewCount": 129,
    "address": "서울 중구 남대문로1길 26-6 (2층) (세종대로 74 인근)",
    "building": "세종대로 74 인근",
    "phone": "02-3789-6738",
    "hours": "월-금 11:00-21:00 (브레이크 15:00-17:00), 토 11:00-17:00 (일요일 휴무)",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.5621889,
    "lng": 126.9777393,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20251227_169%2F1766765695222hSddd_JPEG%2FIMG_1244.jpeg",
    "summary": "한우곰탕(12,000), 육회비빔밥(13,000), 평양냉면(13,000)",
    "tip": "정갈한 놋그릇에 나오는 맑은 나주식 곰탕과 평양냉면.",
    "menus": [
      {
        "name": "한우곰탕(12",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "육회비빔밥(13",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "평양냉면(13",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%8B%9C%EC%B2%AD%EC%97%AD%20%EB%88%84%EB%A6%AC%EC%98%A5",
    "kakaoUrl": "https://map.kakao.com/link/map/%EB%88%84%EB%A6%AC%EC%98%A5%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5621889,126.9777393",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20251227_169%2F1766765695222hSddd_JPEG%2FIMG_1244.jpeg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20240707_145%2F1720320005147qf0tw_JPEG%2FIMG_9418.jpeg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA3MTFfMzcg%2FMDAxNzgzNzcxMzMwNTc2.Pcx25YZfb_IZJgzufAD2Pqw1aajstGRcnwjKXG2w0zUg.Jx1R0L88m3UxACTf7bSHuYovEysGaGIwLqQoL9sZZsEg.JPEG%2FIMG%25EF%25BC%25BF9775.JPG%2F900x676",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA0MDdfMjU2%2FMDAxNzc1NTIzMjI4OTE3.2ycgHT1Qwv1DYc6GVLrEHaSmi73GiMYvhOwlsc2U8Dwg.rswgcwmjKbsoRw_GQhL0iHwKd7WsfgR16FetMWZCGjEg.JPEG%2F900%25EF%25BC%25BF20260406%25EF%25BC%25BF174512.jpg%2F900x1599"
    ]
  },
  {
    "id": 49,
    "name": "브알라 상공회의소점",
    "category": "카페",
    "badge": "🌅 조식가능 · ⭐ 직장인인기",
    "rating": 4.6,
    "reviewCount": 166,
    "address": "서울 중구 세종대로 39 (대한상공회의소 지하) (대한상공회의소 지하 2층)",
    "building": "대한상공회의소 지하 2층",
    "phone": "매장 확인",
    "hours": "07:00-16:30",
    "breakfast": true,
    "lunch": true,
    "dinner": false,
    "lat": 37.5607137,
    "lng": 126.9737753,
    "imageUrl": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDA4MjVfNTUg%2FMDAxNzI0NTU4NzY1ODk5.4cqCY61SBbaP9RMjvUixgPdrY-blpsAwO7UjRI1pd9Eg.8ZKm3LKVKYIP2n1PRul-oV8CZatBaln6fhipNm0IdHUg.JPEG%2FIMG_4553.jpg%234032x3024&type=ff192_192",
    "summary": "바다소금라떼(4,800), 아메리카노(3,800), 크로플(4,500)",
    "tip": "조식 지원. 단짠 조합 시그니처 바다소금라떼와 질소아이스크림.",
    "menus": [
      {
        "name": "바다소금라떼(4",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "800)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "아메리카노(3",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "800)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "크로플(4",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EB%B8%8C%EC%95%8C%EB%9D%BC%20%EC%83%81%EA%B3%B5%ED%9A%8C%EC%9D%98%EC%86%8C%EC%A0%90",
    "kakaoUrl": "https://map.kakao.com/link/map/%EB%B8%8C%EC%95%8C%EB%9D%BC%20%EC%83%81%EA%B3%B5%ED%9A%8C%EC%9D%98%EC%86%8C%EC%A0%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5607137,126.9737753",
    "buildingCluster": "대한상공회의소",
    "buildingLat": 37.56012,
    "buildingLng": 126.97495,
    "buildingName": "대한상공회의소",
    "images": [
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDA4MjVfNTUg%2FMDAxNzI0NTU4NzY1ODk5.4cqCY61SBbaP9RMjvUixgPdrY-blpsAwO7UjRI1pd9Eg.8ZKm3LKVKYIP2n1PRul-oV8CZatBaln6fhipNm0IdHUg.JPEG%2FIMG_4553.jpg%234032x3024&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjAxMjZfMTA3%2FMDAxNzY5NDM1MDgxODI2.c3ET6DwiP-urLkshuH2rFRb9ACDds9goeBosJ1nsrZIg.Tm6C-ell4uZP3N0oHy8tuOzvbNN21LH16FiQau3whAMg.JPEG%2F900%25A3%25DF20260126%25A3%25DF114355.jpg%23796x796&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTEwMDZfMjI5%2FMDAxNzU5Njg0ODM4NDI2.kUkeseWmEpXeG6MFOtFFyQ3g0hWejRO8PMPazEYqyA4g.2WZlUrfIs5upMW6Fup8vmtKTVAAdoDmzdiRM3_sbvSEg.JPEG%2Foutput%25A3%25DF2395873603.jpg%23900x900&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTA5MTNfMTc4%2FMDAxNzU3NzQ2MTA5NTM4.lVqOKlTlen6nRG1J8nDd730_IPtTbjuUruZCzcnHdHgg.xPvddp0zZaxfuafrMzTOtB2hq09Y-NdMjRnEeyvtVXUg.JPEG%2FIMG%25A3%25DF0218.JPG%23900x676&type=ff192_192"
    ]
  },
  {
    "id": 50,
    "name": "단정 퍼시픽타워점",
    "category": "한식",
    "badge": "🌅 조식가능 · 🌙 저녁가능 · ⭐ 직장인인기",
    "rating": 4.8,
    "reviewCount": 234,
    "address": "서울 중구 세종대로9길 41 (퍼시픽타워, 위치 추정) (퍼시픽타워 지하 1층)",
    "building": "퍼시픽타워 지하 1층",
    "phone": "매장 확인",
    "hours": "평일 운영 (식권대장 이용시간 준수)",
    "breakfast": true,
    "lunch": true,
    "dinner": true,
    "lat": 37.5613584,
    "lng": 126.9730165,
    "imageUrl": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjAyMjdfNzUg%2FMDAxNzcyMTQ4MjQ0Mjkx.TN41dh2NTlBo8PwhMNbhyY2l8cExwr0dTMaO6GLfhYIg.bP2cycV7gRbb3bHwIrOgTT2DioWGoiY0jrCnEWrV8sog.JPEG%2FIMG%25A3%25DF6661.jpg%23900x1200&type=f238_208",
    "summary": "제철솥밥정식(13,000), 차돌된장솥밥(12,000), 보리굴비(18,000)",
    "tip": "조식 지원. 정갈한 1인 솥밥 트레이 정식. 손님 모시기 좋은 곳.",
    "menus": [
      {
        "name": "제철솥밥정식(13",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "차돌된장솥밥(12",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "보리굴비(18",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EB%8B%A8%EC%A0%95%20%ED%8D%BC%EC%8B%9C%ED%94%BD%ED%83%80%EC%9B%8C%EC%A0%90",
    "kakaoUrl": "https://map.kakao.com/link/map/%EB%8B%A8%EC%A0%95%20%ED%8D%BC%EC%8B%9C%ED%94%BD%ED%83%80%EC%9B%8C%EC%A0%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5613584,126.9730165",
    "buildingCluster": "퍼시픽타워",
    "buildingLat": 37.56142,
    "buildingLng": 126.97345,
    "buildingName": "퍼시픽타워",
    "images": [
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjAyMjdfNzUg%2FMDAxNzcyMTQ4MjQ0Mjkx.TN41dh2NTlBo8PwhMNbhyY2l8cExwr0dTMaO6GLfhYIg.bP2cycV7gRbb3bHwIrOgTT2DioWGoiY0jrCnEWrV8sog.JPEG%2FIMG%25A3%25DF6661.jpg%23900x1200&type=f238_208",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjAyMjdfOTcg%2FMDAxNzcyMTQ4MjQxMzUy.gjT1aZlB6225fkrTHtPYPRPvfdToxv3QT-bhRZZOeyUg.B5gTt56k6GO1P4lvHz8eLfi8GiyiihvrNEAogADYXrQg.JPEG%2FIMG%25A3%25DF6649.jpg%23900x1200&type=f238_208",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjAyMjdfMjYw%2FMDAxNzcyMTQ4MjQzNTU1.mXVC41B0PxwQDiX9ev_UFBwlMVaKybU_wPdOwNx_Smkg.QH03WWhO2B8I0gHOSGvdWhWNWOStDBbh6IPuzdRCM_og.JPEG%2FIMG%25A3%25DF6646.jpg%23900x1200&type=f238_208",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjAyMjdfMTM1%2FMDAxNzcyMTQ4MjQxOTA4.4TIF2jfK4NXIsCwpXmydOxIW-NYfOXm2ZN634OXzVM4g.6tVxxj4NFI9RwO9-xMkynev8nMzfzpu12Drkrjvol0Ag.JPEG%2FIMG%25A3%25DF6647.jpg%23900x1200&type=f238_208"
    ]
  },
  {
    "id": 51,
    "name": "굽돌집 서울시청 본점",
    "category": "한식",
    "badge": "🌙 저녁가능 · ⭐ 직장인인기",
    "rating": 4.7,
    "reviewCount": 91,
    "address": "서울 중구 북창동 63 (서소문로 134)",
    "building": "서소문로 134",
    "phone": "매장 확인",
    "hours": "월-금 11:00-22:30 (브레이크 14:00-16:00), 토·일 16:00-22:00",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.5628234,
    "lng": 126.977697,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250126_263%2F1737895207497OlhQd_JPEG%2F5555_%25B7%25CE%25B0%25ED.jpg",
    "summary": "돌판삼겹살(16,000), 제육돌판쌈밥(10,000), 김치찌개(8,500)",
    "tip": "뜨거운 천연 돌판에 구워먹는 삼겹살과 푸짐한 점심 쌈밥.",
    "menus": [
      {
        "name": "돌판삼겹살(16",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "제육돌판쌈밥(10",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "김치찌개(8",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EA%B5%BD%EB%8F%8C%EC%A7%91%20%EC%84%9C%EC%9A%B8%EC%8B%9C%EC%B2%AD%20%EB%B3%B8%EC%A0%90",
    "kakaoUrl": "https://map.kakao.com/link/map/%EA%B5%BD%EB%8F%8C%EC%A7%91%20%EC%84%9C%EC%9A%B8%EC%8B%9C%EC%B2%AD%20%EB%B3%B8%EC%A0%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5628234,126.977697",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250126_263%2F1737895207497OlhQd_JPEG%2F5555_%25B7%25CE%25B0%25ED.jpg",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTA4MTdfNjgg%2FMDAxNzU1NDM4MTMxMTMw.j4gtzaMhBsWvcCXWugP0OFBj1ueu5RQzlUW6h4ovymkg.PFUDhlIGg-6RqMr0sLdgFiI8VWrGoWDU1Og6unzjUI4g.JPEG%2FDSCF1423.jpg%23900x1350&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjAxMjNfMjMy%2FMDAxNzY5MTIzNDQ0NjMz.0SqV22Un-uT6948rzVXLnawpw2ZiYsa5kBTl7FM9C5og.pDDuuDz2193IgpQK5DAdKDGz60DS77r5ZdRD3n3rJugg.JPEG%2FIMG%25A3%25DF6624.jpg%23900x676&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA4MjBfMjcg%2FMDAxNzg3MTk0NzY4OTE5.tnqx_7jq04xphB7lHkE-hV8hPO5MENnjCfRhIkCJ4k4g.-qo85pEjbeYWgsZUoGirka5JSa9ev5TmiNy1EjKVfwMg.JPEG%2FIMG%25A3%25DF6537.JPG%233024x4032&type=ff192_192"
    ]
  },
  {
    "id": 52,
    "name": "쿠차라 서소문퍼시픽타워점",
    "category": "양식",
    "badge": "🌅 조식가능 · 🌙 저녁가능",
    "rating": 4.2,
    "reviewCount": 297,
    "address": "서울 중구 세종대로9길 41 (퍼시픽타워 지하1층 B2호) (퍼시픽타워 1층)",
    "building": "퍼시픽타워 1층",
    "phone": "050-71474-2158",
    "hours": "매일 11:00-21:00",
    "breakfast": true,
    "lunch": true,
    "dinner": true,
    "lat": 37.5613584,
    "lng": 126.9730165,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250618_158%2F1750209957864wphHH_PNG%2Fimage.png",
    "summary": "부리또볼(8,900), 타코(9,900), 까르니따스(10,900)",
    "tip": "조식 지원. 한국의 치폴레. 서브웨이처럼 토핑 골라먹는 멕시칸.",
    "menus": [
      {
        "name": "부리또볼(8",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "900)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "타코(9",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "900)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "까르니따스(10",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "900)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%BF%A0%EC%B0%A8%EB%9D%BC%20%EC%84%9C%EC%86%8C%EB%AC%B8%ED%8D%BC%EC%8B%9C%ED%94%BD%ED%83%80%EC%9B%8C%EC%A0%90",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%BF%A0%EC%B0%A8%EB%9D%BC%20%EC%84%9C%EC%86%8C%EB%AC%B8%ED%8D%BC%EC%8B%9C%ED%94%BD%ED%83%80%EC%9B%8C%EC%A0%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5613584,126.9730165",
    "buildingCluster": "퍼시픽타워",
    "buildingLat": 37.56142,
    "buildingLng": 126.97345,
    "buildingName": "퍼시픽타워",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250618_158%2F1750209957864wphHH_PNG%2Fimage.png",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250818_258%2F1755500814872wrvja_JPEG%2F%25C4%25ED%25C2%25F7%25B6%25F3%25C7%25C3%25B7%25A1%25C5%25CD_%25C0%25CC%25B9%25CC%25C1%25F6%25C4%25C6.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNTEyMDNfMjA3%2FMDAxNzY0NzM0MTk2MDY5.OBrIDMLKEPEG_4piWDNTyl5hrLTSI-Y7QYKUepWZ6cMg.55oKBkSfohTg4bA8udd7punTzZsUn8ToFcH5iA7cvGAg.JPEG%2FIMG%25EF%25BC%25BF9766.jpg%2F900x1200",
      "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250618_158%2F1750209957864wphHH_PNG%2Fimage.png"
    ]
  },
  {
    "id": 53,
    "name": "박씨화로숯불구이",
    "category": "한식",
    "badge": "🌙 저녁가능 · ⭐ 직장인인기",
    "rating": 4.8,
    "reviewCount": 292,
    "address": "서울 중구 남대문로1길 26-13 (1층) (세종대로11길 40)",
    "building": "세종대로11길 40",
    "phone": "02-756-8997",
    "hours": "평일 운영 (식권대장 이용시간 준수)",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.5623381,
    "lng": 126.9780591,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20180612_292%2F1528768519600Wwe09_PNG%2Flfsj-IoSMrXWpH053BgJnwqI.PNG.png",
    "summary": "소갈비살(18,000), 생삼겹(16,000), 차돌된장찌개(8,500)",
    "tip": "참숯 화로에 구워먹는 소갈비살과 삼겹살. 단체 회식 완비.",
    "menus": [
      {
        "name": "소갈비살(18",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "생삼겹(16",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "차돌된장찌개(8",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%8B%9C%EC%B2%AD%EC%97%AD%20%EB%B6%81%EC%B0%BD%EB%8F%99%20%EB%B0%95%EC%94%A8%ED%99%94%EB%A1%9C%EC%88%AF%EB%B6%88%EA%B5%AC%EC%9D%B4",
    "kakaoUrl": "https://map.kakao.com/link/map/%EB%B0%95%EC%94%A8%ED%99%94%EB%A1%9C%EC%88%AF%EB%B6%88%EA%B5%AC%EC%9D%B4%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5623381,126.9780591",
    "buildingLat": 37.56215,
    "buildingLng": 126.97425,
    "buildingName": "서소문 먹자골목",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20180612_292%2F1528768519600Wwe09_PNG%2Flfsj-IoSMrXWpH053BgJnwqI.PNG.png",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20180612_253%2F15287685190367TC5g_PNG%2F-68y3b-qE7pvt_o1H3oOofx4.PNG.png",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA4MjhfMjc2%2FMDAxNzg3ODk5NjY1NzM5.tiyBi-T_7wc6kAJfhDCnifJn3reZQDvJx_L_L9ZwG0gg.fzhfx4zqIVXNiBlfcJAKsG7y9myr6RQtzv27Oa8-mzEg.JPEG%2F900_P20260513_125633302_80627EFA-E2A3-42DA-9F29-37EF699D71A9.JPG%2F900x1200",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA3MjdfMjk3%2FMDAxNzg1MTU5NzIxOTE5.tAH7tLs7sd-llSKZPg7C8NwK2rNEBBEE83zBMZ-w8jkg.NhFN3wDlh3pxlku3L0A-SIrvNO5iDCD_MUZvvL_RnLEg.JPEG%2F900%25EF%25BC%25BF1785154378166.jpg%2F900x1200"
    ]
  },
  {
    "id": 54,
    "name": "돈우가식당",
    "category": "한식",
    "badge": "🌙 저녁가능",
    "rating": 4.3,
    "reviewCount": 102,
    "address": "서울 중구 북창동 인근 (위치 추정) (세종대로11길 일대)",
    "building": "세종대로11길 일대",
    "phone": "매장 확인",
    "hours": "평일 운영 (식권대장 이용시간 준수)",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.56245,
    "lng": 126.97825,
    "imageUrl": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTAxMjZfMjg4%2FMDAxNzM3ODE5MzcyNzY3.m1eZiYtu8C-hTkSTMNCQq4NuOXU7No28tu3CmAQSmoQg.LQLVEA3lUMlPynXGg5GaAO3vrQzcw6GtmvWC00T_3dkg.JPEG%2FIMG_6129.jpg%23900x900&type=ff192_192",
    "summary": "제육백반(9,000), 삼겹살(15,000), 묵은지김치찜(9,500)",
    "tip": "가성비 좋은 고기 백반과 묵은지 김치찜이 맛있는 노포.",
    "menus": [
      {
        "name": "제육백반(9",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "삼겹살(15",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "묵은지김치찜(9",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%8B%9C%EC%B2%AD%EC%97%AD%20%EB%B6%81%EC%B0%BD%EB%8F%99%20%EB%8F%88%EC%9A%B0%EA%B0%80%EC%8B%9D%EB%8B%B9",
    "kakaoUrl": "https://map.kakao.com/link/map/%EB%8F%88%EC%9A%B0%EA%B0%80%EC%8B%9D%EB%8B%B9%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.56245,126.97825",
    "buildingLat": 37.56215,
    "buildingLng": 126.97425,
    "buildingName": "서소문 먹자골목",
    "images": [
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTAxMjZfMjg4%2FMDAxNzM3ODE5MzcyNzY3.m1eZiYtu8C-hTkSTMNCQq4NuOXU7No28tu3CmAQSmoQg.LQLVEA3lUMlPynXGg5GaAO3vrQzcw6GtmvWC00T_3dkg.JPEG%2FIMG_6129.jpg%23900x900&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTAyMjNfNTYg%2FMDAxNzQwMjM5NzY5OTY3.yJ-mcZIEAptewasgdGygEor07supgMqTC9n9r9cNPTEg.pyP-6ZvSEcDPrVrjuzpLwXvXkapi8LpkHrLm2N0EpP4g.JPEG%2FIMG_5596.jpg%23900x900&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDExMjFfMjAw%2FMDAxNzMyMTk1MTYwNDg3.wU60YdoZOphulWmvO83t--zYGLLOmR6QU7kx0rXBwQ0g.y6f_lBTnJLVbJ5lIYVmPn4EpiaKH3v5zTtVoU9JaEo4g.JPEG%2F20241031%25A3%25DF181355.jpg%231200x1600&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA5MDhfNCAg%2FMDAxNzg4ODM0MzI5NjU5.wQ-ktzGHhWj_qatGKCj6tW65BJvxNIDtXK3a27LbX58g.0doCNDf_2_BBzs6dp7YbyHgoUccLX3PyJqdVnRP1EYkg.JPEG%2Fcopy%25A3%25DFA4711646%25A3%25ADB11C%25A3%25AD4517%25A3%25AD9D21%25A3%25ADF05A8294581C.jpeg%23900x1200&type=ff192_192"
    ]
  },
  {
    "id": 55,
    "name": "신성식당",
    "category": "한식",
    "badge": "🌙 저녁가능 · ⭐ 직장인인기",
    "rating": 4.8,
    "reviewCount": 127,
    "address": "서울 중구 세종대로14길 22-3 (북창동 81)",
    "building": "북창동 81",
    "phone": "02-753-5306",
    "hours": "매일 11:30-22:00 (브레이크 14:30-17:00)",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.5626338,
    "lng": 126.9780743,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20200214_23%2F1581636104305wRCjG_JPEG%2F-vbws9_SsGNBzWMMq1Fz7bXK.jpeg.jpg",
    "summary": "굴보쌈(39,000), 간재미회무침(25,000), 매생이떡국(9,000)",
    "tip": "수요미식회 굴보쌈 명가. 제철 통영 굴과 보쌈김치 전국구 맛집.",
    "menus": [
      {
        "name": "굴보쌈(39",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "간재미회무침(25",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "매생이떡국(9",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%8B%9C%EC%B2%AD%EC%97%AD%20%EB%B6%81%EC%B0%BD%EB%8F%99%20%EC%8B%A0%EC%84%B1%EC%8B%9D%EB%8B%B9",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%8B%A0%EC%84%B1%EC%8B%9D%EB%8B%B9%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5626338,126.9780743",
    "buildingLat": 37.56135,
    "buildingLng": 126.9783,
    "buildingName": "북창동 음식거리",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20200214_23%2F1581636104305wRCjG_JPEG%2F-vbws9_SsGNBzWMMq1Fz7bXK.jpeg.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260903_287%2F1788431587060urNoJ_JPEG%2F%25BD%25C5%25BC%25BA%25B1%25E2%25BB%25E7%25BD%25C4%25B4%25E7_%25C0%25CC%25B9%25CC%25C1%25F6_8.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220719_297%2F16582206244341n5an_JPEG%2F1658220601340.jpg",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA4MDNfMjEg%2FMDAxNzg1NzIzNDY1Nzk2.V1QGj1TRF9UDTB0Qauocg5V_ycDfK3ecJtOalrBTYs4g.7yjT6gVfuTZU4dZfc7Mr1LvSylXJ0XalgaZnCqfz8KIg.JPEG%2F1785723376027.jpg%23821x1089&type=ff192_192"
    ]
  },
  {
    "id": 56,
    "name": "장안삼계탕",
    "category": "한식",
    "badge": "🌙 저녁가능",
    "rating": 4.4,
    "reviewCount": 162,
    "address": "서울 중구 세종대로18길 8",
    "building": "세종대로18길 8",
    "phone": "02-753-5834",
    "hours": "매일 09:00-21:00",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.5637111,
    "lng": 126.9775061,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210102_27%2F1609543195209KNoXY_PNG%2FWCIGT3dWAY2DtE4f4WV4hS8t.png",
    "summary": "토종삼계탕(17,000), 옻삼계탕(20,000), 전기구이통닭(18,000)",
    "tip": "1971년부터 이어온 50년 삼계탕 명가. 인삼주 1잔 서비스.",
    "menus": [
      {
        "name": "토종삼계탕(17",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "옻삼계탕(20",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "전기구이통닭(18",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%8B%9C%EC%B2%AD%EC%97%AD%20%EB%B6%81%EC%B0%BD%EB%8F%99%20%EC%9E%A5%EC%95%88%EC%82%BC%EA%B3%84%ED%83%95",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%9E%A5%EC%95%88%EC%82%BC%EA%B3%84%ED%83%95%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5637111,126.9775061",
    "buildingLat": 37.56135,
    "buildingLng": 126.9783,
    "buildingName": "북창동 음식거리",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210102_27%2F1609543195209KNoXY_PNG%2FWCIGT3dWAY2DtE4f4WV4hS8t.png",
      "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20200213_254%2F1581520033990AzLxi_JPEG%2FlCwi6XMMRQyTbod66VkzXn9h.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20201224_241%2F16087769168674iEH8_JPEG%2FCv_ohXlYV7Gy1emWzVycg_AD.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250127_121%2F1737980740362JYBtP_JPEG%2F%25BA%25D0%25C0%25DA%25B3%25D7%25B3%25C3%25BB%25EF.jpg"
    ]
  },
  {
    "id": 57,
    "name": "김명자굴국밥(북창점)",
    "category": "한식",
    "badge": "🌙 저녁가능 · ⭐ 직장인인기",
    "rating": 4.6,
    "reviewCount": 206,
    "address": "서울 중구 세종대로14길 28-3 (남대문로4가 17-10)",
    "building": "남대문로4가 17-10",
    "phone": "02-777-9003",
    "hours": "평일 11:00-22:00 (브레이크 15:00-16:30, 토·일 휴무)",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.562625,
    "lng": 126.978425,
    "imageUrl": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTExMTZfNTQg%2FMDAxNzYzMjcxMTk4OTky.O18NhSkcIj8Ah53RJijJpIxAEMyH53zjUi48gGpx0TYg.c_cuSi6L3iSHZSKUFEPgfiZ9vubDMsgNQ4cDdqmdUekg.JPEG%2F900%25A3%25DF1763271198423.jpg%23900x1201&type=ff192_192",
    "summary": "굴국밥(9,500), 매생이굴국밥(11,000), 굴전(18,000)",
    "tip": "뜨끈하고 시원한 뚝배기 굴국밥에 부추 듬뿍. 든든한 보양식.",
    "menus": [
      {
        "name": "굴국밥(9",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "매생이굴국밥(11",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "굴전(18",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EA%B9%80%EB%AA%85%EC%9E%90%EA%B5%B4%EA%B5%AD%EB%B0%A5%20%EB%B6%81%EC%B0%BD%EC%A0%90",
    "kakaoUrl": "https://map.kakao.com/link/map/%EA%B9%80%EB%AA%85%EC%9E%90%EA%B5%B4%EA%B5%AD%EB%B0%A5%20%EB%B6%81%EC%B0%BD%EC%A0%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.562625,126.978425",
    "buildingLat": 37.56135,
    "buildingLng": 126.9783,
    "buildingName": "북창동 음식거리",
    "images": [
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTExMTZfNTQg%2FMDAxNzYzMjcxMTk4OTky.O18NhSkcIj8Ah53RJijJpIxAEMyH53zjUi48gGpx0TYg.c_cuSi6L3iSHZSKUFEPgfiZ9vubDMsgNQ4cDdqmdUekg.JPEG%2F900%25A3%25DF1763271198423.jpg%23900x1201&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTExMTVfMjgg%2FMDAxNzYzMTg1ODExMzY4.Cjbq_WzvQ3Z7OYDJxsdhCesyAuDaiRVVUcW6o0HfWuAg.p2l7ctOiNv3SWktdNQlxs6XIGQLRlU806qj2FsQGm0Yg.JPEG%2FIMG%25A3%25DF0858.jpg%23900x1200&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTEyMTVfMTg4%2FMDAxNzY1ODA3NDEzOTI2.0CvthdS6MEN8gMGwexNBh3-BNgHcYSMB5j25aOFN0V4g.rke_hBi0V_wHj0Fb4RzXIQ0VHUnqU-N3ksO80U5P0hQg.JPEG%2F900%25A3%25DF20251215%25A3%25DF184957.jpg%23900x675&type=f238_208",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTEyMTVfMjMg%2FMDAxNzY1ODA3NDgyMzQy.LYDuTXcl70ZRuI8WDaAYon17vgL1wQtpftutqK8yKIog.3MNe-3AWaF-Beg9wkNKZoF-aF3hDZ_pdPKd3AopIuIAg.JPEG%2F900%25A3%25DF1765807481126.jpg%23900x1305&type=f238_208"
    ]
  },
  {
    "id": 58,
    "name": "천복",
    "category": "한식",
    "badge": "🌙 저녁가능",
    "rating": 4.4,
    "reviewCount": 213,
    "address": "서울 중구 세종대로14길 27-4 (세종대로14길 18)",
    "building": "세종대로14길 18",
    "phone": "02-756-8524",
    "hours": "월-금 11:00-23:00 (브레이크 14:00-17:00, 토·일 휴무)",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.5629879,
    "lng": 126.9782797,
    "imageUrl": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA1MDdfMjE2%2FMDAxNzc4MTMxMzczNDcx.clE5O6sd6A17WboxeFOcubnGjbDqr8PWvbk2U3827yUg.Y7qAYXmpZk-QMa1P6MRs1PZRlP4ax2xDG38TSZPx5l8g.JPEG%2Foutput%25A3%25DF822829124.jpg%23900x900&type=ff192_192",
    "summary": "차돌된장정식(10,000), 한우꽃등심(39,000), 생삼겹살(16,000)",
    "tip": "북창동 고급 고깃집. 점심 찌개 정식과 냉면 가성비 훌륭.",
    "menus": [
      {
        "name": "차돌된장정식(10",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "한우꽃등심(39",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "생삼겹살(16",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%8B%9C%EC%B2%AD%EC%97%AD%20%EB%B6%81%EC%B0%BD%EB%8F%99%20%EC%B2%9C%EB%B3%B5",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%B2%9C%EB%B3%B5%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5629879,126.9782797",
    "buildingLat": 37.56135,
    "buildingLng": 126.9783,
    "buildingName": "북창동 음식거리",
    "images": [
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA1MDdfMjE2%2FMDAxNzc4MTMxMzczNDcx.clE5O6sd6A17WboxeFOcubnGjbDqr8PWvbk2U3827yUg.Y7qAYXmpZk-QMa1P6MRs1PZRlP4ax2xDG38TSZPx5l8g.JPEG%2Foutput%25A3%25DF822829124.jpg%23900x900&type=ff192_192",
      "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20241205_127%2F1733391559716TdUpd_JPEG%2F%25B4%25EB%25C7%25A5%25BB%25E7%25C1%25F8_%25B8%25AE%25B4%25BA%25BE%25F3-01.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20251204_176%2F17648155449978y8HR_JPEG%2F%25B4%25EB%25C7%25A5_%25BB%25E7%25C1%25F8.jpg",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA4MjdfNDIg%2FMDAxNzg3ODE0Njg2ODUw.HAhTIVZyvJ6XgK6VXe1t1KCcQykIJeRTbL8EWr5wCT8g.Kb2kKYfHA3n4-TMfHteYTI9LKoSZsTQWUpzM-KUKbIgg.JPEG%2F6AD16E87%25A3%25AD839D%25A3%25AD4B6B%25A3%25AD9706%25A3%25AD51C4134AD4B9.jpg%23900x900&type=f238_208"
    ]
  },
  {
    "id": 59,
    "name": "숭례도담",
    "category": "한식",
    "badge": "🌙 저녁가능 · ⭐ 직장인인기",
    "rating": 4.5,
    "reviewCount": 289,
    "address": "서울 중구 세종대로18길 14 (칠패로 27 1층)",
    "building": "칠패로 27 1층",
    "phone": "02-772-9850",
    "hours": "매일 11:00-22:00 (브레이크 15:00-17:00)",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.563718,
    "lng": 126.9778826,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230211_77%2F1676041204957R87rB_JPEG%2FKakaoTalk_20230210_235807727_12.jpg",
    "summary": "보쌈정식(11,000), 낙지비빔밥(11,000), 대파전(14,000)",
    "tip": "점심 공깃밥·막걸리 무제한 셀프바 운영! 한옥 감성 요리주점.",
    "menus": [
      {
        "name": "보쌈정식(11",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "낙지비빔밥(11",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "대파전(14",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%8B%9C%EC%B2%AD%EC%97%AD%20%EB%B6%81%EC%B0%BD%EB%8F%99%20%EC%88%AD%EB%A1%80%EB%8F%84%EB%8B%B4",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%88%AD%EB%A1%80%EB%8F%84%EB%8B%B4%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.563718,126.9778826",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230211_77%2F1676041204957R87rB_JPEG%2FKakaoTalk_20230210_235807727_12.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230210_37%2F1676040402038oO0IL_JPEG%2FKakaoTalk_20230210_234331015_09.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA5MTBfMjE0%2FMDAxNzg5MDE5MjIwOTc0.TW_h8Y549Bb56dcTWd6Zrckwkmky3f_rayFW5-JKsmog.wCvWz6thkN7V5NCSHV2TaLmP0pwuTV7ufoIae63OapQg.JPEG%2FCopy_of_2_C(6).jpg%2F4000x3000",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNTEyMTZfNjgg%2FMDAxNzY1ODY3MzU0OTk5.vKBgB8fSnm8BxzHhdl37sgnWBSGrG5RZjVLSFx1luFMg.XYutNClFkvHrWFbe47F8gwMAakC-6mNOOegi0rQzztkg.JPEG%2F900%25EF%25BC%25BF20251207%25EF%25BC%25BF173555.jpg%2F900x1599"
    ]
  },
  {
    "id": 60,
    "name": "북창동개성칼만두",
    "category": "한식",
    "badge": "식권대장 가맹점",
    "rating": 4.3,
    "reviewCount": 140,
    "address": "서울 중구 세종대로14길 34 (세종대로14길 28)",
    "building": "세종대로14길 28",
    "phone": "050-71354-5742",
    "hours": "평일 운영 (식권대장 이용시간 준수)",
    "breakfast": false,
    "lunch": true,
    "dinner": false,
    "lat": 37.5627549,
    "lng": 126.9785473,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260826_51%2F1787729529643H9yNm_JPEG%2F1787724734533.jpg",
    "summary": "손칼만두(9,000), 떡만두국(9,500), 개성손만두(8,000)",
    "tip": "매일 직접 빚는 큼직한 개성식 손만두와 쫄깃한 손칼국수.",
    "menus": [
      {
        "name": "손칼만두(9",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "떡만두국(9",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "개성손만두(8",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EB%B6%81%EC%B0%BD%EB%8F%99%EA%B0%9C%EC%84%B1%EC%B9%BC%EB%A7%8C%EB%91%90",
    "kakaoUrl": "https://map.kakao.com/link/map/%EB%B6%81%EC%B0%BD%EB%8F%99%EA%B0%9C%EC%84%B1%EC%B9%BC%EB%A7%8C%EB%91%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5627549,126.9785473",
    "buildingLat": 37.56135,
    "buildingLng": 126.9783,
    "buildingName": "북창동 음식거리",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260826_51%2F1787729529643H9yNm_JPEG%2F1787724734533.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260819_284%2F1787143932069MxIVh_JPEG%2FIMG_0195.jpg",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA5MDVfMjI0%2FMDAxNzg4NTk1MDU1MjEz.O06gMqkHjg-LhwRI1QDOOPQTezvKkS1lFpXd_I-CvoQg.wLU9iuP0lKv1Yk0vILSzn-aiNufJ2wxCkkR3VKUiPVkg.JPEG%2F900_20260904_112219.jpg%2F922x1222",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA4MjZfMjAw%2FMDAxNzg3Njg4Mjg5Mzgx.EB55IVz5U39UbE8EyZS6Vpo36Q6rD-wf64nVJXoo3BIg.C4pL89bpz-0VLfn4IBJ-5te9Zd8xP0RDIQyWK7nFQ2wg.JPEG%2F%25EC%258B%259C%25EC%25B2%25AD%25EC%2597%25AD%25EC%25A0%2590%25EC%258B%25AC%25EB%25A7%259B%25EC%25A7%2591_%25EB%25B6%2581%25EC%25B0%25BD%25EB%258F%2599%25EA%25B0%259C%25EC%2584%25B1%25EC%25B9%25BC%25EB%25A7%258C%25EB%2591%259010.jpg%2F1496x1496"
    ]
  },
  {
    "id": 61,
    "name": "송원스키야키샤브샤브",
    "category": "일식",
    "badge": "🌙 저녁가능 · ⭐ 직장인인기",
    "rating": 4.5,
    "reviewCount": 197,
    "address": "서울 중구 세종대로18길 24 (북창동) (세종대로18길 24 2층)",
    "building": "세종대로18길 24 2층",
    "phone": "02-778-7708",
    "hours": "월-금 11:00-21:00 (브레이크 14:30-16:30, 토·일 휴무)",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.5636682,
    "lng": 126.9781969,
    "imageUrl": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjAxMDNfMjk4%2FMDAxNzY3NDQxMTI5Mjg4._6PH37GTJU_tRiUKF--anjLh3bHT8buQjXPnX0Fo_P0g.Eq3cO1x9WeuSzvqA7Q3p8Z1qwpUx7_pIJ_JPpSydcP4g.JPEG%2F900%25A3%25DF20251230%25A3%25DF121457.jpg%23900x1200&type=ff192_192",
    "summary": "스키야키1인(15,000), 샤브샤브1인(15,000), 우동사리(3,000)",
    "tip": "1인 1인덕션 냄비로 각자 깔끔하게 즐기는 프리미엄 스키야키.",
    "menus": [
      {
        "name": "스키야키1인(15",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "샤브샤브1인(15",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "우동사리(3",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%8B%9C%EC%B2%AD%EC%97%AD%20%EB%B6%81%EC%B0%BD%EB%8F%99%20%EC%86%A1%EC%9B%90%EC%8A%A4%ED%82%A4%EC%95%BC%ED%82%A4%EC%83%A4%EB%B8%8C%EC%83%A4%EB%B8%8C",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%86%A1%EC%9B%90%EC%8A%A4%ED%82%A4%EC%95%BC%ED%82%A4%EC%83%A4%EB%B8%8C%EC%83%A4%EB%B8%8C%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5636682,126.9781969",
    "buildingLat": 37.56135,
    "buildingLng": 126.9783,
    "buildingName": "북창동 음식거리",
    "images": [
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjAxMDNfMjk4%2FMDAxNzY3NDQxMTI5Mjg4._6PH37GTJU_tRiUKF--anjLh3bHT8buQjXPnX0Fo_P0g.Eq3cO1x9WeuSzvqA7Q3p8Z1qwpUx7_pIJ_JPpSydcP4g.JPEG%2F900%25A3%25DF20251230%25A3%25DF121457.jpg%23900x1200&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjAzMjdfODUg%2FMDAxNzc0NTg3OTI2MTA0.W_xidqXFMkuQO_LdZlA02ukIIBijD8u1IIhxuiaFYkkg.ybf-BNTaV3O7ZUD3tw4n_fyUevArWVeS3e8LrTgr3mkg.JPEG%2Foutput%25A3%25DF2277075546.jpg%23900x676&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA1MTlfMTU5%2FMDAxNzc5MTY4NzkyMTYx.ni6qwAX-Nv3TzYfGoc-5RYfAD_L6VuEd4jrm_EHjCIQg.t1uK0LdZbvzd7_9p3XAHfTdx86GoFmyMzu2aPwwANWIg.JPEG%2FKakaoTalk_20260518_122627245_17.jpg%231483x1348&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTA0MThfMTA3%2FMDAxNzQ0OTYxMjQ3MjEw.xVISNPhJDOnjYmb3jeUMZcSFi8fy9jLysd1snAePYkQg.gxVjPHVBq8PBoQgSp4tM_pnJV9QI-PqnA0CE39B3K8sg.JPEG%2F900%25A3%25DF20250409%25A3%25DF125017.jpg%23900x1200&type=ff192_192"
    ]
  },
  {
    "id": 62,
    "name": "샐러디(서울시청점)",
    "category": "양식",
    "badge": "🌙 저녁가능 · ⭐ 직장인인기",
    "rating": 4.5,
    "reviewCount": 266,
    "address": "서울 중구 세종대로18길 20 (북창동) (세종대로 72)",
    "building": "세종대로 72",
    "phone": "02-318-2127",
    "hours": "평일 08:00-21:00, 주말 08:00-20:00",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.5636921,
    "lng": 126.9782375,
    "imageUrl": "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260212_119%2F1770879960551MdxCJ_PNG%2F%25B0%25ED%25B0%25B4%25BF%25EB_%25B8%25F0%25B4%25CF%25C5%25CD2.png",
    "summary": "칠리베이컨웜볼(8,600), 탄단지샐러디(8,900), 멕시칸랩(6,900)",
    "tip": "신선한 곡물 웜볼과 샐러드 랩. 직장인 가벼운 점심.",
    "menus": [
      {
        "name": "칠리베이컨웜볼(8",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "600)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "탄단지샐러디(8",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "900)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "멕시칸랩(6",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "900)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%83%90%EB%9F%AC%EB%94%94%20%EC%84%9C%EC%9A%B8%EC%8B%9C%EC%B2%AD%EC%A0%90",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%83%90%EB%9F%AC%EB%94%94%20%EC%84%9C%EC%9A%B8%EC%8B%9C%EC%B2%AD%EC%A0%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5636921,126.9782375",
    "images": [
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260212_119%2F1770879960551MdxCJ_PNG%2F%25B0%25ED%25B0%25B4%25BF%25EB_%25B8%25F0%25B4%25CF%25C5%25CD2.png",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260212_233%2F1770879957083lKb9z_PNG%2F%25B0%25ED%25B0%25B4%25BF%25EB_%25B8%25F0%25B4%25CF%25C5%25CD6.png",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA4MjdfNzEg%2FMDAxNzg3Nzk3MDQ3OTM3.CZ7DYwfE7gxIghIzJn95qq93PJQbWJwVeAn1GxsC9-Eg.tMRuhp4YX1injfkNr9ykR0zxOYmJ8a4bfLZWN81eD_4g.JPEG%2FIMG%25EF%25BC%25BF4254.jpg%2F900x1200",
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA4MjdfNSAg%2FMDAxNzg3Nzk3MDQ3ODE2.AHD0gr2BMQaqpTaXR2u9hu_tAzmuHbRGYwOy1rCZMCog.Rd3V22lVh_f42cY1aZV4xHfOp55IydzDTNcFIZk2ktIg.JPEG%2FIMG%25EF%25BC%25BF4249.jpg%2F900x1069"
    ]
  },
  {
    "id": 63,
    "name": "쭈담(시청북창점)",
    "category": "한식",
    "badge": "🌙 저녁가능",
    "rating": 4.4,
    "reviewCount": 268,
    "address": "서울 중구 북창동 인근 (위치 추정) (남대문로4가 17-18)",
    "building": "남대문로4가 17-18",
    "phone": "매장 확인",
    "hours": "월-금 11:00-22:00 (브레이크 15:00-17:00), 토 11:00-15:00 (일요일 휴무)",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.56345,
    "lng": 126.97818,
    "imageUrl": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA5MTZfMjIw%2FMDAxNzg5NTMyNDA2ODc1.91g-cgByEpLYnT2joOdh367t2xV1lFiAtJR6ahrTYEwg._gHeX2KN038Ojn19n8lNK9A3bI8xuj0cDYAxDwJf_qwg.JPEG%2FIMG%25A3%25DF3450.JPG%23900x420&type=ff192_192",
    "summary": "불향쭈꾸미정식(11,000), 쭈삼볶음(13,000), 도토리묵사발(무료)",
    "tip": "직화 불향 쭈꾸미 볶음에 콩나물, 무생채 넣고 슥슥 비벼먹는 별미.",
    "menus": [
      {
        "name": "불향쭈꾸미정식(11",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "쭈삼볶음(13",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "도토리묵사발",
        "price": "무료",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%AD%88%EB%8B%B4%20%EC%8B%9C%EC%B2%AD%EB%B6%81%EC%B0%BD%EC%A0%90",
    "kakaoUrl": "https://map.kakao.com/link/map/%EC%AD%88%EB%8B%B4%20%EC%8B%9C%EC%B2%AD%EB%B6%81%EC%B0%BD%EC%A0%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.56345,126.97818",
    "buildingLat": 37.56135,
    "buildingLng": 126.9783,
    "buildingName": "북창동 음식거리",
    "images": [
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA5MTZfMjIw%2FMDAxNzg5NTMyNDA2ODc1.91g-cgByEpLYnT2joOdh367t2xV1lFiAtJR6ahrTYEwg._gHeX2KN038Ojn19n8lNK9A3bI8xuj0cDYAxDwJf_qwg.JPEG%2FIMG%25A3%25DF3450.JPG%23900x420&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA4MjFfMjg0%2FMDAxNzg3MzA5NDM2NDU2._zQ8N5sP5lMwiZE0oK2346DJ0w2Sx2Do7XF7LWwZWo4g.gNyN1l_pLCjU9uz9Khk3ubWHF5C_Ja34AP0qTsnNqZMg.JPEG%2FIMG%25A3%25DF4598.JPG%23899x899&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA5MDNfOTIg%2FMDAxNzg4MzkwMzc1MDIw.eyKZvY0ULt5MV3LlWvhngd5WthXf2LNPW4Y-yTatrigg.IloHR5SnauHkLcdd4FyeeYPUEnYiqnfi-hlb9Lc1RXQg.JPEG%2FIMG%25A3%25DF3084.jpg%23900x1200&type=ff192_192",
      "https://search.pstatic.net/common/?autoRotate=true&quality=100&type=f640_380&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260711_137%2F17837335905562v3OC_JPEG%2F1000017322.jpg"
    ]
  },
  {
    "id": 64,
    "name": "남경",
    "category": "중식",
    "badge": "⭐ 직장인인기",
    "rating": 4.8,
    "reviewCount": 85,
    "address": "서울 중구 북창동 11-2 (세종대로14길 일대)",
    "building": "세종대로14길 일대",
    "phone": "02-756-2286",
    "hours": "평일 운영 (식권대장 이용시간 준수)",
    "breakfast": false,
    "lunch": true,
    "dinner": false,
    "lat": 37.5634842,
    "lng": 126.9784378,
    "imageUrl": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA0MzBfMTc5%2FMDAxNzc3NTM2MTE0MDEx._jbqr1qcsrzNoG4gsrcnVCTogbSo4kbMlKglyjWUvg8g.IF4FW5jnLPSjMHDDwYvBGx2KSaDVEdT_zwqkDvPr8IMg.JPEG%2FIMG%25A3%25DF7459.jpg%23900x1200&type=ff192_192",
    "summary": "짜장면(7,000), 짬뽕(8,500), 탕수육(18,000), 삼선볶음밥(9,500)",
    "tip": "빠른 스피드와 푸짐한 양의 정통 중화요리. 점심 짬뽕 인기.",
    "menus": [
      {
        "name": "짜장면(7",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "짬뽕(8",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "탕수육(18",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "000)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "삼선볶음밥(9",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%EC%8B%9C%EC%B2%AD%EC%97%AD%20%EB%B6%81%EC%B0%BD%EB%8F%99%20%EB%82%A8%EA%B2%BD",
    "kakaoUrl": "https://map.kakao.com/link/map/%EB%82%A8%EA%B2%BD%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5634842,126.9784378",
    "buildingLat": 37.56135,
    "buildingLng": 126.9783,
    "buildingName": "북창동 음식거리",
    "images": [
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA0MzBfMTc5%2FMDAxNzc3NTM2MTE0MDEx._jbqr1qcsrzNoG4gsrcnVCTogbSo4kbMlKglyjWUvg8g.IF4FW5jnLPSjMHDDwYvBGx2KSaDVEdT_zwqkDvPr8IMg.JPEG%2FIMG%25A3%25DF7459.jpg%23900x1200&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA0MjNfNTUg%2FMDAxNzc2OTAwNTgyMjA5.JomCuZE8VV5VTS4-lo6NzXTHInB_uqdVL_zYEA0yucIg.8hVYAP-5GXk3rPvgozxQ_jjG1XBu5v4g8FBCXad3FZ0g.PNG%2F%25C1%25F8%25C1%25D6%25C7%25F6%25C1%25F6%25B8%25C0%25C1%25FD_%25B3%25B2%25B0%25E6%25C3%25DF%25BE%25EE%25C5%25C1.png%231080x1080&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA3MTZfMTIw%2FMDAxNzg0MTY4MDk5OTAx.r1k7q7KIm56lLYvx21AZP1aK1ujp8vyz7t6oEo-oE_8g.UtVO0IWvRg6wn28p4R_BLN5_gECpeSn5sXD9S5c2HFEg.PNG%2F%25BC%25B6%25B3%25D7%25C0%25CF.png%23960x960&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA5MDlfMTU0%2FMDAxNzg4OTE5MDY3NzYw.0fT2XPzOlMqAKAM_quthMvDFxS-spK4WjwTojpMsa5Ig.dY35l--gOxu3neh0ZsWkBUMHafqo8OaVcwexNiJxA4wg.JPEG%2F20260909_093727.jpg%233000x4000&type=ff192_192"
    ]
  },
  {
    "id": 65,
    "name": "킹스빈커피 태평로점",
    "category": "카페",
    "badge": "식권대장 가맹점",
    "rating": 4.2,
    "reviewCount": 334,
    "address": "서울 중구 세종대로 73 B102, 103호 (서소문동, 태평로빌딩) (세종대로 64 1층)",
    "building": "세종대로 64 1층",
    "phone": "02-318-0337",
    "hours": "월-금 07:00-16:00 (일요일 정기휴무)",
    "breakfast": false,
    "lunch": true,
    "dinner": false,
    "lat": 37.5629405,
    "lng": 126.9759531,
    "imageUrl": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA0MjNfMjMy%2FMDAxNzc2OTIyMjE0MjI4.VR8YafiRC2F21RW2vOi4ieW9lRS2foTgrIQawtVrP_wg.OJlvr3ZIbPojcvje0lC1iBjkPrm4O_u_U-oA7tyUWMkg.JPEG%2FIMG%25A3%25DF2329.jpg%23900x1200&type=ff192_192",
    "summary": "빅아메리카노(2,500), 바닐라빈라떼(4,200), 모닝토스트(3,500)",
    "tip": "가성비 최강 대용량 커피. 점심 테이크아웃 및 식권 잔여 결제.",
    "menus": [
      {
        "name": "빅아메리카노(2",
        "price": "대표메뉴",
        "isSignature": true
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "바닐라빈라떼(4",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "200)",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "모닝토스트(3",
        "price": "대표메뉴",
        "isSignature": false
      },
      {
        "name": "500)",
        "price": "대표메뉴",
        "isSignature": false
      }
    ],
    "naverUrl": "https://map.naver.com/p/search/%ED%82%B9%EC%8A%A4%EB%B9%88%EC%BB%A4%ED%94%BC%20%ED%83%9C%ED%8F%89%EB%A1%9C%EC%A0%90",
    "kakaoUrl": "https://map.kakao.com/link/map/%ED%82%B9%EC%8A%A4%EB%B9%88%EC%BB%A4%ED%94%BC%20%ED%83%9C%ED%8F%89%EB%A1%9C%EC%A0%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5629405,126.9759531",
    "images": [
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA0MjNfMjMy%2FMDAxNzc2OTIyMjE0MjI4.VR8YafiRC2F21RW2vOi4ieW9lRS2foTgrIQawtVrP_wg.OJlvr3ZIbPojcvje0lC1iBjkPrm4O_u_U-oA7tyUWMkg.JPEG%2FIMG%25A3%25DF2329.jpg%23900x1200&type=ff192_192",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA0MjRfMTA0%2FMDAxNzc2OTk2ODczNDMw.YGw70IgcZ22MBSZJNYX7CfsdxDXZABkBrffEPHz84Gkg.abNrdgizIfv4k-7rg8SwYSpEr3cZdY0ut6pIwaCyZdwg.JPEG%2FIMG%25A3%25DF5973.jpg%23900x1200&type=f238_208",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA0MjRfMjcg%2FMDAxNzc2OTk2ODYzNDc5.97_3DR1RpOWKBObKUIYYismmkNMzovwE7xcVaaIbiEkg.JExnWjwliRvuXoScGlgPDFbfcJYv1edfsgsKRLbpkLsg.JPEG%2FIMG%25A3%25DF6007.jpg%23900x1200&type=f238_208",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNjA0MjRfMTQ1%2FMDAxNzc2OTk2ODg2MTEy.EzX7Ik4VgI5pWlupUoRUxCDGuh6bgBTwUdwv6DwWGq8g.Rrl_i8nVnC0QPDyS8wmy9IKfoi8OR53IfehQIvHmceUg.JPEG%2FIMG%25A3%25DF6008.jpg%23900x1200&type=f238_208"
    ]
  },
  {
    "id": 66,
    "name": "베이커리(씨티스퀘어점)",
    "category": "카페",
    "badge": "☀️ 점심가능 · 🌙 저녁가능",
    "rating": 4.4,
    "reviewCount": 178,
    "address": "서울 중구 서소문로 124 지하1층 B105호",
    "building": "씨티스퀘어 지하 1층",
    "buildingCluster": "씨티스퀘어",
    "phone": "02-6263-2288",
    "hours": "평일 07:30-20:30 (주말 휴무)",
    "breakfast": false,
    "lunch": true,
    "dinner": true,
    "lat": 37.5631062,
    "lng": 126.9752236,
    "imageUrl": "https://ldb-phinf.pstatic.net/20230412_222/1681265204341JtbRx_JPEG/KakaoTalk_Photo_2023-04-12-11-06-03.jpeg",
    "images": [
      "https://ldb-phinf.pstatic.net/20230412_222/1681265204341JtbRx_JPEG/KakaoTalk_Photo_2023-04-12-11-06-03.jpeg",
      "https://ldb-phinf.pstatic.net/20240307_183/17097877659773ef7S_JPEG/search.pstatic.jpg",
      "https://ldb-phinf.pstatic.net/20260402_47/1775108770422Vv1lg_PNG/10382.png"
    ],
    "summary": "크루아상(3,200), 아메리카노(2,500), 샌드위치세트(6,500)",
    "tip": "사내 공지사항 중식 21번 가맹점(더베이크 시티스퀘어점). 커피와 갓 구운 빵, 샌드위치 식권 결제 가능.",
    "naverUrl": "https://map.naver.com/p/search/%EC%94%A8%ED%8B%B0%EC%8A%A4%ED%80%98%EC%96%B4%20%EB%8D%94%EB%B2%A0%EC%9D%B4%ED%81%AC",
    "kakaoUrl": "https://map.kakao.com/link/map/%EB%B2%A0%EC%9D%B4%EC%BB%A4%EB%A6%AC%20%EC%94%A8%ED%8B%B0%EC%8A%A4%ED%80%98%EC%96%B4%EC%A0%90%20%28%EC%8B%9C%EC%B2%AD%EC%97%AD%29,37.5631062,126.9752236",
    "menus": [
      {
        "name": "샌드위치 세트 (샌드위치+아메리카노)",
        "price": "6,500원",
        "isSignature": true
      },
      {
        "name": "수제 크루아상 / 소금빵",
        "price": "3,200원",
        "isSignature": true
      },
      {
        "name": "아메리카노 (Ice/Hot)",
        "price": "2,500원",
        "isSignature": false
      },
      {
        "name": "카페라떼 / 바닐라라떼",
        "price": "3,800원",
        "isSignature": false
      }
    ]
  }
];
