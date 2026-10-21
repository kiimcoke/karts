/**
 * 한국예술종합학교(K-ARTS) 웹 앱 인터랙티브 스크립트
 * 외부 의존성 없는 순수 바닐라 자바스크립트 (ES6)
 * 더블클릭 로컬 파일 실행(file://) 완벽 지원
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. "나는 이 기관으로부터 어떤 도움을 받을 수 있을까?" 진단 설문/체크리스트
  initBenefitFinder();

  // 2. 6개 원(院) 인터랙티브 탭 전환 로직
  initSchoolTabs();

  // 3. 최신 뉴스 카테고리 필터링 로직
  initNewsFilter();

  // 4. 내비게이션 부드러운 스크롤 보조
  initSmoothScroll();
});

/* ==========================================================
   1. 국민 맞춤 혜택 진단 체크리스트 데이터 및 인터랙션
   ========================================================== */

// 4가지 국민 페르소나별 선택 항목 및 추천 혜택 데이터베이스
const BENEFIT_DATA = {
  citizen: {
    badge: '일반 시민 / 예술 애호가 맞춤 플랜',
    heading: '일반 시민을 위한 고품격 무료 문화예술 혜택',
    summary: '한예종은 국민의 세금으로 운영되는 국립기관으로서, 수준 높은 예술 공연과 전시, 무료 강좌를 국민 여러분께 활짝 열어두고 있습니다.',
    checklistItems: [
      { id: 'c1', title: '정기 오케스트라 및 실내악 음악회 무료 관람', desc: '서초동 크누아홀 등에서 열리는 교수진 및 정상급 학생들의 연주회' },
      { id: 'c2', title: '연극원 정기 제작공연 무료 티켓 예매', desc: '석관동 예술극장에서 상연되는 완성도 높은 연극 및 뮤지컬 무대' },
      { id: 'c3', title: '무용원 발레·현대무용·전통춤 기획공연 관람', desc: '세계 콩쿠르 석권 주역들의 생생한 무대 공연 무료 개방' },
      { id: 'c4', title: '미술원·조형예술 졸업전시회 및 아트페어 관람', desc: '석관동 갤러리 및 캠퍼스에서 열리는 현대 미술 기획전' },
      { id: 'c5', title: '영상원 독립영화 및 단편 애니메이션 상영회', desc: '국내외 유수 영화제 초청 단편 영화 무료 상영회 관람' },
      { id: 'c6', title: '시민 대상 문화예술 공개 특강 및 아카이브 이용', desc: '예술정보관 도서관 자료 및 예술 학술 포럼 참여' }
    ],
    defaultSelected: ['c1', 'c2'],
    recommendations: [
      {
        type: '무료 문화 향유',
        typeClass: 'type-free',
        title: 'K-ARTS 무료 공연·전시 사전 예매 혜택',
        desc: '한예종에서 열리는 정기 오케스트라, 연극, 무용 정기공연의 80% 이상은 국민 누구나 온라인 예매를 통해 무료로 관람할 수 있습니다.',
        how: '📌 이용 방법: 공식 홈페이지 [공연/전시 안내] 게시판에서 공연 1~2주 전 무료 예매 신청',
        linkText: '공식 공연/전시 일정 확인 ↗',
        linkUrl: 'https://www.karts.ac.kr/kor/board/list.do?menuId=010302000000'
      },
      {
        type: '예술 콘텐츠 개방',
        typeClass: 'type-free',
        title: '독립·예술영화 무료 상영회 & 미디어 아트 감상',
        desc: '영상원 졸업영화제 및 AT랩(아트앤테크놀로지랩)의 인터랙티브 미디어아트 쇼케이스를 일반 시민 누구나 자유롭게 관람할 수 있습니다.',
        how: '📌 이용 방법: 매년 11월~12월 영상원 졸업영화제 및 가을 미디어 전시회 현장 방문',
        linkText: '영상원 소식 바로가기 ↗',
        linkUrl: 'https://www.karts.ac.kr'
      },
      {
        type: '예술 정보 자원',
        typeClass: 'type-edu',
        title: '예술정보관(도서관) 및 학술 아카이브 열람',
        desc: '국내 최고 수준의 희귀 예술 서적, 악보, 공연 대본, 영상 아카이브 자료를 시민 열람 및 사전 신청을 통해 활용할 수 있습니다.',
        how: '📌 이용 방법: 석관동 예술정보관 방문증 발급 후 열람실 이용',
        linkText: '예술정보관 안내 ↗',
        linkUrl: 'https://lib.karts.ac.kr'
      }
    ],
    guidance: {
      title: '일반 시민 무료 티켓팅 및 관람 문의처',
      desc: '공연예술센터 및 홍보팀: 02-746-9000 | 석관동 예술극장 및 서초동 크누아홀 안내'
    }
  },

  parent: {
    badge: '학부모 / 아동·청소년 맞춤 플랜',
    heading: '국가 전액 지원 예술영재 발굴 및 조기 전문교육 혜택',
    summary: '예술적 잠재력을 지닌 자녀를 위해 대한민국 최고의 교수진이 1:1 맞춤 지도하는 국비 무료 영재교육 과정을 이용할 수 있습니다.',
    checklistItems: [
      { id: 'p1', title: '한국예술영재교육원 국비 무료 영재 선발 지원', desc: '초·중·고교 음악, 무용, 전통예술 분야 영재 조기 발굴' },
      { id: 'p2', title: '예술영재교육원 지역 캠퍼스(세종·광주 등) 파견 교육', desc: '수도권 외 지역 학생들을 위한 권역별 영재 협력 교육' },
      { id: 'p3', title: '청소년 문화예술 방학 아카데미 및 체험 캠프', desc: '창의적 연극·미술·영상 제작 체험 교실 참여' },
      { id: 'p4', title: '소외계층 및 다문화 아동 문화예술 꿈사다리 장학', desc: '사회적 배려 대상자를 위한 특별 전형 및 실기 교육 지원' },
      { id: 'p5', title: '영재원 마스터클래스 및 오픈 리허설 참관', desc: '세계적 거장 교수의 공개 레슨을 통한 진로 탐색' }
    ],
    defaultSelected: ['p1', 'p2'],
    recommendations: [
      {
        type: '국비 100% 무료',
        typeClass: 'type-edu',
        title: '한국예술영재교육원 (KNIGA) 입학 혜택',
        desc: '초·중·고 예술 영재를 선발하여 국내 최정상 한예종 교수진이 직접 1:1 레슨, 앙상블, 마스터클래스를 전액 무료(국비)로 교육합니다.',
        how: '📌 신청 시기: 매년 10월~12월 원서 접수 (음악, 무용, 전통예술 분야)',
        linkText: '한국예술영재교육원 홈페이지 ↗',
        linkUrl: 'https://kniga.karts.ac.kr'
      },
      {
        type: '지역 균형 혜택',
        typeClass: 'type-support',
        title: '예술영재 지역 거점 캠퍼스 교육 지원',
        desc: '지방에 거주하는 학생들도 서울에 올라오지 않고 세종시, 광주광역시 등 지역 거점 캠퍼스에서 동일한 수준의 영재교육을 받을 수 있습니다.',
        how: '📌 신청 대상: 세종·충청권, 광주·호남권 등 거주 초·중·고교생',
        linkText: '지역 거점 선발 요강 확인 ↗',
        linkUrl: 'https://kniga.karts.ac.kr'
      },
      {
        type: '청소년 체험',
        typeClass: 'type-free',
        title: '청소년 여름·겨울 예술창의캠프 참가',
        desc: '방학 기간 동안 청소년들이 직접 단편 영화를 만들고, 미술 작품을 창작하며 연극 무대를 경험해보는 진로 탐색 워크숍을 제공합니다.',
        how: '📌 참여 경로: 방학 전 1개월 학교 공지사항 [창작체험 캠프] 신청',
        linkText: '체험 공지사항 확인 ↗',
        linkUrl: 'https://www.karts.ac.kr'
      }
    ],
    guidance: {
      title: '예술영재교육원 입학 및 선발 상담',
      desc: '한국예술영재교육원 행정실: 02-746-9571~4 (대학로 캠퍼스 소재)'
    }
  },

  aspirant: {
    badge: '입시 준비생 / 예비 예술가 맞춤 플랜',
    heading: '대한민국 최정상 실기 교육 및 실전 창작 기회 혜택',
    summary: '실기와 창의성 중심의 선발, 1:1 도제식 집중 트레이닝, 현장 최첨단 스튜디오 및 극장 인프라를 전폭적으로 누릴 수 있습니다.',
    checklistItems: [
      { id: 'a1', title: '예술사(대학 4년 학사과정) 입학 실기 전형 응시', desc: '내신/수능 위주가 아닌 독창성과 예술적 기량을 평가하는 선발' },
      { id: 'a2', title: '예술전문사(대학원 2~3년 석사과정) 진학', desc: '전공 심화 연구 및 실전 프로젝트 제작 전문 훈련' },
      { id: 'a3', title: '입학 설명회 및 전년도 기출문제/모범답안 분석 자료 열람', desc: '각 원별(음악·연극·영상·무용·미술·전통) 공식 기출문제 제공' },
      { id: 'a4', title: '최고 수준의 프로덕션 제작비 및 장비 무상 지원', desc: '영화 제작비 지원, 극장 무대 세트 및 악기 연습실 지원' },
      { id: 'a5', title: '해외 유수 콩쿠르·영화제 출품 및 항공료 지원', desc: '재학 중 국제 무대 진출 시 공식 행정 및 경비 지원' }
    ],
    defaultSelected: ['a1', 'a3'],
    recommendations: [
      {
        type: '입학 전형 혜택',
        typeClass: 'type-edu',
        title: '수시 6회 제한 없는 자유로운 지원 기회',
        desc: '한예종은 특별법에 의한 설치 대학으로, 일반 4년제 대학교 수시 지원 6회 제한에 포함되지 않아 예술 전공생들에게 독립적인 추가 기회를 제공합니다.',
        how: '📌 일정: 8월 입시(음악·전통), 10월 입시, 11월 입시 원별 순차 진행',
        linkText: '한예종 입학처 모집요강 ↗',
        linkUrl: 'https://www.karts.ac.kr/kor/board/list.do?menuId=010201000000'
      },
      {
        type: '창작 인프라',
        typeClass: 'type-support',
        title: '세계적 수준의 스튜디오·극장·악기 연습실 이용',
        desc: '스타인웨이 피아노 수십 대, 종합 촬영 스튜디오, 모션캡처 XR 스튜디오, 500석 이상 예술극장 등 현업 수준 이상의 설비를 수업과 작업에 자유롭게 활용합니다.',
        how: '📌 입학 후 재학생에게 24시간 실습실 및 제작비 프로젝트 지원',
        linkText: '캠퍼스 시설 갤러리 둘러보기 ↗',
        linkUrl: 'https://www.karts.ac.kr'
      },
      {
        type: '글로벌 진출',
        typeClass: 'type-global',
        title: '국제 콩쿠르 및 해외 영화제 진출 원스톱 지원',
        desc: '재학생이 칸, 베니스 영화제나 쇼팽, 퀸 엘리자베스 콩쿠르 등에 진출할 경우 번역, 마케팅, 항공료, 마스터클래스 등 전폭적인 학교 차원의 지원이 주어집니다.',
        how: '📌 대외협력과 및 각 원 교학처 국제교류 장학 신청',
        linkText: '국제교류 프로그램 안내 ↗',
        linkUrl: 'https://www.karts.ac.kr'
      }
    ],
    guidance: {
      title: '입학 전형 및 입시요강 직통 안내',
      desc: '한예종 입학관리과: 02-746-9042~6 | 입시 상담 및 기출문제 자료집 배포'
    }
  },

  artist: {
    badge: '청년 예술인 / 창작자·산학협력 맞춤 플랜',
    heading: '예술 창업, AI 첨단 기술 융합, 제작 공간 및 산학 프로젝트 지원',
    summary: '독립 예술가와 스타트업, 창작자를 위한 창업 육성 센터, 첨단 XR 기술 실증 랩, 시설 공동 대관 프로그램을 운영하고 있습니다.',
    checklistItems: [
      { id: 'ar1', title: '예술창업보육센터(K-Arts 창업) 입주 및 사업화 자금 지원', desc: '문화예술 기반 벤처 및 콘텐츠 스타트업 액셀러레이팅' },
      { id: 'ar2', title: 'AT랩(아트앤테크놀로지랩) 융복합 콘텐츠 R&D 협업', desc: '생성형 AI, 버추얼 프로덕션, 실감 미디어 공동 창작 프로젝트' },
      { id: 'ar3', title: '공연장·전시장 및 촬영 스튜디오 공공 대관', desc: '민간 예술단체 및 예술인을 위한 전문 공연 시설 대관 심사' },
      { id: 'ar4', title: '아시아 청소년 예술캠프(AYAC) 및 글로벌 레지던시 참여', desc: '해외 아티스트와의 다국적 공동 창작 네트워크 참여' },
      { id: 'ar5', title: '산학협력 프로젝트 및 기업 연계 브랜디드 콘텐츠 수주', desc: '문화재단 및 지자체 문화 콘텐츠 용역 파트너십' }
    ],
    defaultSelected: ['ar1', 'ar2'],
    recommendations: [
      {
        type: '창업·비즈니스',
        typeClass: 'type-support',
        title: 'K-Arts 청년 예술창업 보육 프로그램',
        desc: '예술 분야 창업을 꿈꾸는 예비 창업자와 초기 스타트업을 위해 독립 사무공간 무상 제공, 멘토링, 시제품 제작비 및 투자 유치를 지원합니다.',
        how: '📌 모집 기간: 매년 초 산학협력단 창업보육센터 입주기업 공모',
        linkText: '산학협력단 창업 공모 확인 ↗',
        linkUrl: 'https://iacf.karts.ac.kr'
      },
      {
        type: 'AI 첨단 기술 융합',
        typeClass: 'type-global',
        title: 'AT랩(AT-Lab) 첨단 미디어 기술 R&D 지원',
        desc: '인공지능(AI), 언리얼 엔진, 볼류메트릭 캡처 등 고가의 최첨단 장비를 활용하여 차세대 미디어아트나 몰입형 콘텐츠를 공동 제작할 기회를 얻습니다.',
        how: '📌 참여 경로: 오픈 연구 프로젝트 및 글로벌 쇼케이스(아르스 일렉트로니카 등) 공모',
        linkText: 'AT랩 융합 프로젝트 소개 ↗',
        linkUrl: 'https://atlab.karts.ac.kr'
      },
      {
        type: '시설 대관 혜택',
        typeClass: 'type-free',
        title: '예술극장 및 콘서트홀 정기 공공 대관',
        desc: '민간 예술단체 및 전문 예술인들이 양질의 무대에서 작품을 올릴 수 있도록 석관동 예술극장, 서초동 크누아홀 등의 공공 대관 심사를 진행합니다.',
        how: '📌 신청 시기: 매년 상·하반기 정기 대관 공고 접수',
        linkText: '공연시설 대관 안내 ↗',
        linkUrl: 'https://www.karts.ac.kr'
      }
    ],
    guidance: {
      title: '산학협력 및 창업·기술 R&D 문의처',
      desc: '한예종 산학협력단: 02-746-9173 | 창업보육센터 및 AT랩 연구협력팀'
    }
  }
};

let currentPersona = 'citizen';

/**
 * 혜택 파인더 초기화
 */
function initBenefitFinder() {
  const personaButtons = document.querySelectorAll('#personaOptions .persona-btn');
  const checklistContainer = document.getElementById('benefitChecklist');
  const btnCalculate = document.getElementById('btnCalculateBenefit');
  const btnReset = document.getElementById('btnResetFinder');

  if (!checklistContainer || !personaButtons.length) return;

  // 1. 초기 체크리스트 렌더링
  renderChecklist(currentPersona);

  // 2. 페르소나 버튼 클릭 이벤트
  personaButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      personaButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPersona = btn.getAttribute('data-persona');
      renderChecklist(currentPersona);
      // 결과 패널 숨기기
      const resultPanel = document.getElementById('resultPanel');
      if (resultPanel) resultPanel.style.display = 'none';
    });
  });

  // 3. 진단 버튼 클릭
  if (btnCalculate) {
    btnCalculate.addEventListener('click', () => {
      displayResults(currentPersona);
    });
  }

  // 4. 초기화 버튼
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      currentPersona = 'citizen';
      personaButtons.forEach(b => {
        if (b.getAttribute('data-persona') === 'citizen') b.classList.add('active');
        else b.classList.remove('active');
      });
      renderChecklist(currentPersona);
      const resultPanel = document.getElementById('resultPanel');
      if (resultPanel) resultPanel.style.display = 'none';
    });
  }
}

/**
 * 선택된 페르소나에 따라 체크리스트 아이템 동적 생성
 */
function renderChecklist(personaKey) {
  const container = document.getElementById('benefitChecklist');
  if (!container) return;

  const data = BENEFIT_DATA[personaKey];
  if (!data) return;

  container.innerHTML = '';

  data.checklistItems.forEach(item => {
    const isDefault = data.defaultSelected.includes(item.id);
    const label = document.createElement('label');
    label.className = `check-item ${isDefault ? 'checked' : ''}`;
    label.setAttribute('for', item.id);

    label.innerHTML = `
      <input type="checkbox" id="${item.id}" value="${item.id}" ${isDefault ? 'checked' : ''}>
      <div class="check-text-group">
        <span class="check-title">${item.title}</span>
        <span class="check-desc">${item.desc}</span>
      </div>
    `;

    // 체크박스 클릭 인터랙션
    const checkbox = label.querySelector('input');
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        label.classList.add('checked');
      } else {
        label.classList.remove('checked');
      }
    });

    container.appendChild(label);
  });
}

/**
 * 맞춤 결과 렌더링 및 스크롤 이동
 */
function displayResults(personaKey) {
  const data = BENEFIT_DATA[personaKey];
  const resultPanel = document.getElementById('resultPanel');
  const badgeEl = document.getElementById('resultCategoryBadge');
  const headingEl = document.getElementById('resultHeading');
  const summaryEl = document.getElementById('resultSummaryText');
  const cardsContainer = document.getElementById('resultCardsContainer');
  const guidanceBox = document.getElementById('resultGuidanceBox');

  if (!resultPanel || !data) return;

  // 선택된 체크 항목 개수 확인
  const checkedBoxes = document.querySelectorAll('#benefitChecklist input[type="checkbox"]:checked');
  const checkedCount = checkedBoxes.length;

  badgeEl.textContent = data.badge;
  headingEl.textContent = `${data.heading} (${checkedCount}개 관심사 반영)`;
  summaryEl.textContent = data.summary;

  // 결과 카드 생성
  cardsContainer.innerHTML = '';
  data.recommendations.forEach(rec => {
    const card = document.createElement('div');
    card.className = 'benefit-card';
    card.innerHTML = `
      <div>
        <span class="benefit-badge-type ${rec.typeClass}">${rec.type}</span>
        <h4>${rec.title}</h4>
        <p>${rec.desc}</p>
        <div class="benefit-how">${rec.how}</div>
      </div>
      <div>
        <a href="${rec.linkUrl}" target="_blank" rel="noopener noreferrer" class="benefit-action-link">
          ${rec.linkText}
        </a>
      </div>
    `;
    cardsContainer.appendChild(card);
  });

  // 안내 및 문의 박스
  guidanceBox.innerHTML = `
    <div class="guidance-text">
      <strong>📞 ${data.guidance.title}</strong>
      <span>${data.guidance.desc}</span>
    </div>
    <a href="https://www.karts.ac.kr" target="_blank" rel="noopener noreferrer" class="btn-contact">
      공식 행정 창구 안내 ↗
    </a>
  `;

  // 표시 및 부드러운 스크롤
  resultPanel.style.display = 'block';

  // 살짝 스크롤 내려서 결과를 편하게 볼 수 있도록 유도
  setTimeout(() => {
    const yOffset = -70;
    const y = resultPanel.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }, 100);
}

/* ==========================================================
   2. 6개 원 탭 인터페이스
   ========================================================== */
function initSchoolTabs() {
  const tabButtons = document.querySelectorAll('#schoolTabs .tab-btn');
  const panels = document.querySelectorAll('.school-panel');

  if (!tabButtons.length || !panels.length) return;

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');

      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      panels.forEach(panel => {
        if (panel.id === targetId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
}

/* ==========================================================
   3. 뉴스 목록 필터링
   ========================================================== */
function initNewsFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const newsCards = document.querySelectorAll('.news-card');

  if (!filterButtons.length || !newsCards.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');

      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      newsCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease-in-out';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================
   4. 부드러운 스크롤
   ========================================================== */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
