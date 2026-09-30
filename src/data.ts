import { DayItinerary } from './types';

export const precautions = {
  mustBring: [
    { id: 'must-1', text: '護照 (檢查有效期限 6 個月以上)' },
    { id: 'must-2', text: '健康的身體 愉快的心' }
  ],
  rememberBring: [
    { id: 'rem-1', text: '手機充電器 & 轉接頭 (韓國是 220v 雙圓頭插座)' },
    { id: 'rem-2', text: '行動電源 (不可托運，須放隨身行李)' },
    { id: 'rem-3', text: '個人盥洗用品 / 牙刷牙膏 (環保政策部分飯店不提供)' },
    { id: 'rem-4', text: '輕便雨具 (防夏日午後雷陣雨)' },
    { id: 'rem-5', text: '常備藥品 (感冒、腸胃藥、OK蹦)' },
    { id: 'rem-6', text: '防曬用品 (防曬乳、遮陽帽、太陽眼鏡)' }
  ],
  specialTips: [
    {
      title: '🔋 電池類物品禁托運',
      content: '有電池、鋰電池的物品（如隨身手持電風扇、行動電源、相機電池等）都「絕對不要」放在托運行李箱內，必須隨身攜帶上飛機。'
    },
    {
      title: '🧪 液體隨身攜帶限制',
      content: '超過 100ml 的液體物品（注意：是看「瓶子大小/容量規格」，而不是裡面剩多少液體）絕對不可以隨身攜帶，必須放托運行李！'
    },
    {
      title: '⚡ 國外電壓注意',
      content: '韓國電壓為 220V（插座為雙圓孔）。要帶吹風機、電棒捲等電器出國，請務必注意是否支援國際電壓（110V-240V），否則會燒壞或跳電！'
    },
    {
      title: '🧳 行李輕便原則',
      content: '每個人享有 10 公斤手提行李 + 15 公斤托運行李額度。去程帶的东西越少，行李箱空間越空，回程能塞進去的釜山戰利品就越多！'
    }
  ]
};

export const koreanPhrases = [
  { korean: '안녕하세요', romaji: 'An-nyeong-ha-se-yo', translation: '你好', usage: '萬用問候語' },
  { korean: '감사합니다', romaji: 'Gam-sa-ham-ni-da', translation: '謝謝', usage: '表達謝意' },
  { korean: '얼마예요?', romaji: 'Eol-ma-ye-yo?', translation: '多少錢？', usage: '逛街、市場購物' },
  { korean: '이거 주세요', romaji: 'I-geo ju-se-yo', translation: '我要這個', usage: '指著商品或菜單點餐' },
  { korean: '화장실 어디예요?', romaji: 'Hwa-jang-sil eo-di-ye-yo?', translation: '洗手間在哪裡？', usage: '急用必備' },
  { korean: '맛있어요!', romaji: 'Mas-is-seo-yo!', translation: '好吃！', usage: '向店員表達讚美' },
  { korean: '깎아주세요', romaji: 'Kkak-a-ju-se-yo', translation: '算便宜一點嘛', usage: '富平罐頭市場或小店討價還價' }
];

export const busanIntro = {
  title: '釜山 ‧ 湛藍夏日漫遊',
  subtitle: 'BUSAN SUMMER ESCAPE 2026',
  period: '2026 / 07 / 30 - 08 / 04',
  description: '熱情的夏日微風、閃閃發光的海雲台，與漫山遍野繽紛的甘川文化村正在等待我們！這是一份為我們量身打造的專屬旅行手冊。準備好相機、穿上最涼爽的衣服，跟著藍天與暖沙的足跡，開啟這場屬於我們的釜山探險吧！🏖️✨',
  highlights: [
    { icon: 'Train', title: '海雲台海岸膠囊列車', desc: '在蔚藍海岸線旁，搭乘可愛五彩的復古膠囊小火車' },
    { icon: 'Sparkles', title: 'Spa Land 汗蒸幕', desc: '新世界百貨頂級汗蒸幕體驗，舒緩旅途疲憊、深度放鬆' },
    { icon: 'MapPin', title: '甘川文化村 & 松島', desc: '漫步「釜山的馬丘比丘」，搭乘海上纜車橫跨蔚藍海灣' },
    { icon: 'Compass', title: '鑽石灣遊艇之旅', desc: '乘著海風在夜色中啟航，欣賞廣安大橋的璀璨燈光' },
    { icon: 'ShoppingBag', title: '樂天名牌 Outlet & Skyline Luge', desc: '極速斜坡滑車俯衝快感，配上熱血的購物行程' }
  ]
};

// 芸岑家 Itinerary
export const yunCenItinerary: DayItinerary[] = [
  {
    dayNum: 1,
    date: '2026/07/30',
    dayOfWeek: '四',
    theme: '啟程！抵達釜山湛藍之夜',
    items: [
      {
        time: '06:30',
        title: '家裡集合出發',
        description: '從溫馨的家裡出發，滿懷期待前往機場，記得再次確認護照有沒有帶喔！',
        type: 'transport',
        duration: '1.5 小時'
      },
      {
        time: '13:30 – 17:05',
        title: '搭乘飛機飛往韓國釜山',
        description: '衝上雲霄！在飛機上好好睡一覺或欣賞窗外雲海，準備降落蔚藍的港都釜山。',
        type: 'transport',
        duration: '3.5 小時',
        oathText: [
          '我宣誓：這趟旅行我一定會帶著感恩的心全力配合，',
          '絕對不說：還是台灣好，早知道留在台灣就好。',
          '絕對不說：好熱喔，還不如在家吹冷氣！',
          '絕對不說：好貴喔，不要浪費錢！',
          '絕對不說：好無聊哦，什麼時候要走？',
          '我們要做到：',
          '走路不喊累、迷路不責備',
          '有狀況不硬撐馬上報備',
          '至少兩人同行絕不脫隊',
          '遇到突發狀況平常心面對！',
          '如果違規，我就請大家吃下一頓飯！'
        ]
      },
      {
        time: '17:05',
        title: '抵達釜山金海機場 (PUS)',
        description: '完成入境手續與領取行李。跟著隊伍出關，隨後搭車前往住宿飯店（車程約 35 分鐘）。',
        type: 'other',
        duration: '35 分鐘',
        notes: ['下飛機後記得開啟網路漫遊或更換 SIM 卡', '跟隨指示排隊通關']
      },
      {
        time: '傍晚',
        title: '辦理入住：釜山站asti飯店 (ASTI Hotel Busan Station)',
        description: '辦理 Check-in 手續，放下行李、洗個臉稍作休息。ASTI 飯店地理位置超棒，交通十分便利！',
        type: 'hotel',
        notes: ['地址：釜山東區中央大路214街7-8']
      },
      {
        time: '晚上',
        title: '晚餐建議：布帳馬車美食體驗',
        description: '晚餐自由安排，強烈推薦前往住宿附近的特色「布帳馬車」（韓式大排檔路邊攤），體驗道地的釜山深夜美食氛圍！點一盤辣炒年糕、魚板與清涼的飲料，乾杯！',
        type: 'food',
        notes: ['不強制集體用餐，可依疲憊程度決定', '逛逛便利商店補充隔天所需的水分與零食']
      }
    ]
  },
  {
    dayNum: 2,
    date: '2026/07/31',
    dayOfWeek: '五',
    theme: '海雲台海線一日遊 ‧ 海風與汗蒸幕',
    items: [
      {
        time: '07:30',
        title: '元氣滿滿！集合出發',
        description: '在飯店大廳集合，千萬不要遲到囉！遲到的人可能要幫大家拿行李喔～',
        type: 'other'
      },
      {
        time: '07:30 – 08:20',
        title: '搭車前往尾浦（膠囊列車搭乘處）',
        description: '搭乘接駁交通工具前往海雲台尾浦站（車程約 50 分鐘）。沿途可以欣賞早晨的釜山市景。',
        type: 'transport',
        duration: '50 分鐘'
      },
      {
        time: '08:30 – 09:00',
        title: '搭乘海岸膠囊列車 🚃',
        description: '搭乘海岸膠囊列車，從尾浦站前往青沙浦站。抵達青沙浦後，可以散步欣賞海景，拍照打卡。',
        type: 'activity',
        duration: '30 分鐘',
        photoSpots: ['海岸膠囊列車車廂與海景', '青沙浦天空步道']
      },
      {
        time: '09:00 – 11:00',
        title: '青沙浦周邊遊玩 📸',
        description: '前往青沙浦周邊遊玩，漫步於美麗海岸邊，感受海風，享受釜山的浪漫氛圍（約停留 2 小時）。',
        type: 'activity',
        duration: '2 小時',
        notes: ['📢 集合時間：11:05'],
        photoSpots: [
          '青沙浦踏石展望台',
          '海岸步道',
          '海林烤貝（如有興趣）'
        ]
      },
      {
        time: '11:25 – 11:43',
        title: '搭乘海岸列車 🚃',
        description: '搭乘海岸列車，由青沙浦前往尾浦。',
        type: 'transport',
        duration: '18 分鐘'
      },
      {
        time: '13:00 – 15:00',
        title: '午餐時光：味贊王烤肉 🥩',
        description: '午餐安排味贊王烤肉。外酥內嫩的厚切豬五花絕對不容錯過！',
        type: 'food',
        notes: ['※ 有訂位強制一同用餐']
      },
      {
        time: '15:00 – 16:30',
        title: '搭車前往新世界百貨 (Centum City)',
        description: '搭車前往 Centum City 新世界百貨，這裡有全釜山最豪華、最頂級的 Spa Land 汗蒸幕！',
        type: 'transport',
        duration: '30 分鐘',
        notes: ['🛍️ 購物小撇步：新世界百貨 3 樓辦理會員卡享 95 折優惠！']
      },
      {
        time: '16:30 – 20:30',
        title: '放鬆行程：新世界 Spa Land 汗蒸幕 ♨️',
        description: '到 Spa Land（新世界百貨） 汗蒸幕放鬆（約 4 小時）。體驗傳統韓式汗蒸幕、多種溫度與主題的桑拿浴、溫泉足浴等。徹底釋放連日來的疲勞，恢復滿滿元氣！',
        type: 'activity',
        duration: '4 小時',
        notes: [
          '進場限制 4 小時，請掌握時間',
          '超級推薦喝甜米釀 (Sikhye) 搭配烤雞蛋！🥚🥤',
          '甜米釀與烤雞蛋需自費，可用手環感應最後結帳',
          '🛍️ 購物優惠：新世界百貨 3 樓辦理會員卡可享 95 折'
        ]
      },
      {
        time: '晚上',
        title: '晚餐與自由活動 🛍️',
        description: '晚餐自由安排，可直接在新世界百貨美食街用餐。如果還有體力，可以前往 DIAEGG 密室逃脫或雷射槍競技場。',
        type: 'free',
        notes: ['💳 新世界百貨 3 樓辦理會員卡可享 95 折優惠！']
      }
    ]
  },
  {
    dayNum: 3,
    date: '2026/08/01',
    dayOfWeek: '六',
    theme: '甘川文化村 ‧ 西面自由漫遊 ‧ 鑽石灣夜遊 🌊🛍️',
    items: [
      {
        time: '08:30',
        title: '集合出發 🚌',
        description: '大廳集合出發！搭車約 20 分鐘後，再步行約 9 分鐘前往甘川文化村。',
        type: 'other'
      },
      {
        time: '09:00 – 13:00',
        title: '童話山城：甘川文化村 🏘️',
        description: '遊樂場甘川文化村。途中可以慢慢拍照、逛特色小店，享受充滿藝術氣息與繽紛色彩的陡峭山城。',
        type: 'activity',
        duration: '4 小時',
        notes: [
          '💡 推薦行程（包含在釜山通行證中）：',
          '👕 韓服體驗',
          '📖 手翻書製作（推薦行程！為了避免稍晚的人潮擁擠，建議先去體驗）'
        ],
        photoSpots: ['小王子與狐狸雕像合照', '俯瞰彩色積木村莊全景', '穿越壁畫彩繪小徑']
      },
      {
        time: '13:00 – 14:00',
        title: '松島海上纜車 + 天空步道 🚠🌉',
        description: '前往松島海上纜車，搭乘纜車欣賞壯麗的開闊海景，並體驗漫步在松島天空步道的樂趣！（行程於 14:00 結束）',
        type: 'activity',
        duration: '1 小時',
        photoSpots: ['海上纜車車廂內全景海景', '松島海水浴場金黃沙灘', '松島天空步道與壯麗海景']
      },
      {
        time: '14:00 – 19:30',
        title: '前往西面自由活動 🛍️🍰',
        description: '松島纜車行程於 14:00 結束後，大家搭車前往熱鬧的西面商圈自由活動！可以盡情逛街購物、走訪文青咖啡廳、品嚐在地小吃與美食。',
        type: 'free',
        duration: '5.5 小時',
        notes: [
          '🛍️ 西面地下街與流行服飾商圈自由採購',
          '☕ 西面田浦咖啡廳街品嚐精緻下午茶與甜點',
          '⏰ 請務必注意時間，於 19:30 前前往鑽石灣集合'
        ]
      },
      {
        time: '19:30',
        title: '鑽石灣重新集合 ⛵',
        description: '大家於 19:30 重新在鑽石灣集合，準備辦理登船與搭乘鑽石灣夜間遊艇！',
        type: 'other',
        notes: ['⏰ 19:30 準時在鑽石灣集合地點會合']
      },
      {
        time: '20:30 – 21:30',
        title: '搭乘鑽石灣遊艇 ⛵',
        description: '搭乘鑽石灣遊艇，航行在寧靜的夜色中，近距離欣賞廣安大橋五彩繽紛的璀璨燈光與釜山無敵的海景夜色，超級浪漫！',
        type: 'activity',
        duration: '1 小時',
        notes: ['※ 現場需再加價 5,000 韓元/人。']
      },
      {
        time: '21:30 後',
        title: '搭車返回飯店 🏨',
        description: '結束浪漫的遊艇之旅，搭車返回飯店休息。',
        type: 'transport'
      }
    ]
  },
  {
    dayNum: 4,
    date: '2026/08/02',
    dayOfWeek: '日',
    theme: '速度與激情 ‧ 樂天狂歡（👕 今日請穿團服！）',
    items: [
      {
        time: '09:00',
        title: '集合出發 🎒（特勤小隊 08:30 出發）',
        description: '今日準備迎接速度感與瘋狂採購，請穿著最舒適好走的布鞋，並【務必穿上我們的專屬團服】！大廳 09:00 集合出發。',
        type: 'other',
        notes: [
          '📢 💡 重要提醒：今天大家要【穿著專屬團服】一起拍大合照喔！👕',
          '📢 所有人員 09:00 集合出發（特勤小隊 08:30 提前出發）'
        ]
      },
      {
        time: '09:00 – 09:50',
        title: '搭車前往 Skyline Luge',
        description: '搭車約 50 分鐘，前往位於機張的 Skyline Luge 斜坡滑車場。其餘人員搭乘 09:00 班次，特勤小隊已於 08:30 提前出發。',
        type: 'transport',
        duration: '50 分鐘',
        notes: ['特勤小隊 08:30 出發，其餘人員 09:00 出發']
      },
      {
        time: '09:50 – 11:50',
        title: '極速體驗：Skyline Luge 斜坡滑車 🏎️',
        description: '戴上安全帽、搭乘吊椅纜車上山，隨後駕駛專用無動力滑車，沿著曲折起伏的斜坡賽道一路高速滑行俯沖而下！重力加速度的快感超級好玩，大家穿著團服一起在滑車場大合照，超級帥氣！',
        type: 'activity',
        duration: '2 小時',
        notes: [
          '📢 記得穿著我們的團服，拍照效果一級棒！📸',
          '出發前會有親切的教練進行安全駕駛教學'
        ]
      },
      {
        time: '11:50 – 15:50',
        title: '童話樂園：釜山樂天世界 🎢 (體驗穿韓式校服！)',
        description: '前往充滿奇幻童話色彩的「釜山樂天世界」！入園前特別安排換上充滿青春氣息的「韓式高中校服」，化身韓劇主角！在華麗的城堡與夢幻旋轉木馬前拍下最青春、最亮眼的照片，隨後盡情體驗各種刺激好玩的遊樂設施！',
        type: 'activity',
        duration: '4 小時',
        notes: ['📢 特別活動：租借並體驗韓式校服（店家挑選、配件搭配）', '園區內有眾多網美打卡拍照景點，行動電源必備！📸']
      },
      {
        time: '15:50 – 18:20',
        title: '機張狂歡：機張市場 & 樂天 Outlet 🦀🛍️',
        description: '接下來靈活安排精彩行程：\n\n 🦀 機張市場：釜山最著名的海鮮聖地，以鮮甜肥美的帝王蟹、松葉蟹與現撈海鮮聞名！\n\n 🛍️ 樂天 Premium Outlet：寬敞好逛的購物中心，匯集各大品牌折扣，適合漫步尋寶。\n\n大家可以根據體力與喜好自由分配時間，隨後搭車啟程回西面。',
        type: 'shopping',
        notes: ['保持輕便，買太多的話回程行李要注意重量喔！']
      },
      {
        time: '晚上',
        title: '西面一條街：逛街購物與享用晚餐',
        description: '回到釜山最熱鬧的市中心「西面一條街」。這裡是年輕人的潮流天堂，無數服飾店、藥妝店 (Olive Young) 與特色小吃齊聚。晚餐就在西面一條街自由探尋美味，無論是傳統豬肉湯飯、辣炒年糕或是香噴噴的韓式炸雞應有盡有！',
        type: 'free',
        notes: ['西面地下街也是雨天與吹冷氣的購物好去處']
      }
    ]
  },
  {
    dayNum: 5,
    date: '2026/08/03',
    dayOfWeek: '一',
    theme: '絕美白淺灘 ‧ BIFF廣場自由活動日 🌊🛍️',
    items: [
      {
        time: '09:30 – 12:00',
        title: '集合打車前往白淺灘文化村 🌊🚕',
        description: '早上 09:30 準時集合，一同搭乘計程車前往「白淺灘文化村 (Huinnyeoul Culture Village)」。漫步在海岸懸崖小徑，欣賞絕美蔚藍大海與白色壁畫，並在此悠閒拍照、吹海風，停留至 12:00。',
        type: 'activity',
        duration: '2.5 小時',
        notes: ['09:30 集合打車出發', '12:00 前於白淺灘文化村漫步體驗']
      },
      {
        time: '12:00',
        title: '打車至 BIFF 廣場 ➔ 抵達後自由活動 🛍️🍢',
        description: '中午 12:00 集合搭乘計程車前往「BIFF 廣場」。抵達後展開自由活動！大家可以自由品嚐必吃的黑糖堅果甜餅與街頭小吃，並漫步周邊商圈。',
        type: 'free',
        notes: ['打車至 BIFF 廣場後開啟自由時間', '請注意個人安全並隨時與隊友保持聯絡']
      },
      {
        time: '下午 & 晚上建議',
        title: '周邊商圈美食與採購自由選 🛍️☕',
        description: '自由活動推薦路線選擇：\n\n🍢 富平罐頭市場 & 札嘎其市場：平民小吃與新鮮海產體驗。\n\n🐰 Miffy Café：超萌米飛兔主題咖啡廳，拍照放鬆首選。\n\n🛍️ 南浦洞商圈 / 光復路時裝街：把握最後一夜進行藥妝、服飾與伴手禮採購！',
        type: 'shopping',
        notes: ['回飯店後記得整理與打包行李，準備明日返航！']
      }
    ]
  },
  {
    dayNum: 6,
    date: '2026/08/04',
    dayOfWeek: '二',
    theme: '滿載回憶！告別美麗釜山',
    items: [
      {
        time: '08:00',
        title: '飯店大廳集合出發 🎒',
        description: '準時在飯店大廳集合辦理退房，隨後搭車前往釜山金海機場（車程約 35 分鐘）。請務必再次檢查房間，確保手機充電線、證件沒有遺落在插座或抽屜裡！',
        type: 'other',
        duration: '35 分鐘',
        notes: ['確保托運行李與手提行李重量在規定額度內']
      },
      {
        time: '10:50 – 12:35',
        title: '搭乘飛機：釜山 (PUS) ➔ 桃園 (TPE)',
        description: '搭乘班機返抵台灣桃園國際機場。在飛機上翻閱這幾天拍的滿滿美照，帶著愉快不捨的心情與伴手禮，平安回到溫暖的家！我們下次旅行再見！✈️💖',
        type: 'transport',
        duration: '1 小時 45 分鐘'
      }
    ]
  }
];

// 沛恩家 Itinerary (Only Day 1 & Day 6 have different times, and Day 4 includes parent's flights)
export const peiEnItinerary: DayItinerary[] = [
  {
    dayNum: 1,
    date: '2026/07/30',
    dayOfWeek: '四',
    theme: '啟程！抵達釜山湛藍之夜',
    items: [
      {
        time: '13:30 – 17:05',
        title: '搭乘飛機飛往韓國釜山',
        description: '衝上雲霄！在飛機上好好睡一覺或欣賞窗外雲海，準備降落蔚藍的港都釜山。',
        type: 'transport',
        duration: '3.5 小時',
        oathText: [
          '我宣誓：這趟旅行我一定會帶著感恩的心全力配合，',
          '絕對不說：還是台灣好，早知道留在台灣就好。',
          '絕對不說：好熱喔，還不如在家吹冷氣！',
          '絕對不說：好貴喔，不要浪費錢！',
          '絕對不說：好無聊哦，什麼時候要走？',
          '我們要做到：',
          '走路不喊累、迷路不責備',
          '有狀況不硬撐馬上報備',
          '至少兩人同行絕不脫隊',
          '遇到突發狀況平常心面對！',
          '如果違規，我就請大家吃下一頓飯！'
        ]
      },
      {
        time: '16:40 – 19:55',
        title: '✈️ 沛恩爸媽去程航班：桃園 (TPE) ➔ 金海 (PUS)',
        description: '沛恩爸媽搭乘此班機前往釜山！預計 19:55 抵達金海機場。',
        type: 'transport',
        duration: '3 小時 15 分鐘',
        notes: ['去程航班：16:40 - 19:55', '桃園機場到金海機場']
      },
      {
        time: '17:05',
        title: '抵達釜山金海機場 (PUS)',
        description: '完成入境手續與領取行李。跟著隊伍出關，隨後搭車前往住宿飯店（車程約 35 分鐘）。',
        type: 'other',
        duration: '35 分鐘',
        notes: ['下飛機後記得開啟網路漫遊或更換 SIM 卡', '跟隨指示排隊通關']
      },
      {
        time: '傍晚',
        title: '辦理入住：釜山站asti飯店 (ASTI Hotel Busan Station)',
        description: '辦理 Check-in 手續，放下行李、洗個臉稍作休息。ASTI 飯店地理位置超棒，交通十分便利！',
        type: 'hotel',
        notes: ['地址：釜山東區中央大路214街7-8']
      },
      {
        time: '晚上',
        title: '晚餐建議：布帳馬車美食體驗',
        description: '晚餐自由安排，強烈推薦前往住宿附近的特色「布帳馬車」（韓式大排檔路邊攤），體驗道地的釜山深夜美食氛圍！點一盤辣炒年糕、魚板與清涼的飲料，乾杯！',
        type: 'food',
        notes: ['不強制集體用餐，可依疲憊程度決定', '逛逛便利商店補充隔天所需的水分與零食']
      }
    ]
  },
  // Day 2 (7/31) & Day 3 (8/1) are identical to YunCen
  yunCenItinerary[1],
  yunCenItinerary[2],
  // Day 4 (8/2) - Included parents' return flight
  {
    ...yunCenItinerary[3],
    items: [
      ...yunCenItinerary[3].items,
      {
        time: '22:00 – 23:40',
        title: '✈️ 沛恩爸媽回程航班：金海 (PUS) ➔ 桃園 (TPE)',
        description: '沛恩爸媽今天搭乘深夜航班回台灣囉！祝爸媽一路順風，平安到家。',
        type: 'transport',
        duration: '1 小時 40 分鐘',
        notes: ['回程飛機時間：22:00 - 23:40', '金海機場到桃園機場']
      }
    ]
  },
  // Day 5 (8/3) is identical to YunCen
  yunCenItinerary[4],
  // Day 6 has different flight/assembly time
  {
    dayNum: 6,
    date: '2026/08/04',
    dayOfWeek: '二',
    theme: '滿載回憶！告別美麗釜山',
    items: [
      {
        time: '11:00',
        title: '飯店大廳集合出發 🎒',
        description: '準時在飯店大廳集合辦理退房，隨後搭車前往釜山金海機場（車程約 35 分鐘）。請務必再次檢查房間，確保手機充電線、證件沒有遺落在插座或抽屜裡！',
        type: 'other',
        duration: '35 分鐘',
        notes: ['確保托運行李與手提行李重量在規定額度內']
      },
      {
        time: '14:15 – 15:50',
        title: '搭乘飛機：釜山 (PUS) ➔ 桃園 (TPE)',
        description: '搭乘班機返抵台灣桃園國際機場。在飛機上翻閱這幾天拍的滿滿美照，帶著愉快不捨的心情與伴手禮，平安回到溫暖的家！我們下次旅行再見！✈️💖',
        type: 'transport',
        duration: '1 小時 35 分鐘'
      }
    ]
  }
];
