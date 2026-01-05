# 🎴 Baccarat Simulator

실제 바카라 게임처럼 플레이할 수 있는 웹 기반 바카라 시뮬레이터입니다. 8덱 셔플, 실제 바카라 규칙, 카드 쪼기 기능, 사운드 효과 등을 포함하고 있습니다.

## ✨ 주요 기능

- **실제 바카라 규칙**: 8덱 셔플, 3번째 카드 규칙, 뱅커 5% 수수료
- **카드 쪼기(Squeeze)**: 마우스/터치로 카드를 쪼면 진행률 표시
- **사운드 효과**: Web Audio API 기반 카드 뒤집기, 칩 배팅, 승리음
- **배팅 내역 추적**: 게임 기록, 승률, 수익/손실 통계
- **중국점(본매)**: 게임 결과를 시각적으로 표시
- **반응형 디자인**: PC/모바일 모두 지원
- **시작금액 설정**: 100만원~1억원 범위에서 자유롭게 설정

## 🎮 게임 규칙

### 카드 점수
- A: 1점
- 2~9: 숫자 그대로
- 10, J, Q, K: 0점
- 합이 10 이상이면 일의 자리만 계산 (예: 7+8=15 → 5점)

### 배당률
- **Player**: 1:1 (베팅액 × 2)
- **Banker**: 1:0.95 (베팅액 × 1.95, 5% 수수료)
- **Tie**: 1:8 (베팅액 × 9, Player/Banker 베팅 반환)

### 칩 값
- 1,000원
- 5,000원
- 10,000원
- 50,000원
- 100,000원
- 500,000원

## 🛠️ 설치 및 실행

### 요구사항
- Node.js 18+
- pnpm (또는 npm/yarn)

### 설치
```bash
git clone https://github.com/yourusername/baccarat-simulator.git
cd baccarat-simulator
pnpm install
```

### 개발 서버 실행
```bash
pnpm dev
```
브라우저에서 `http://localhost:3000` 접속

### 빌드
```bash
pnpm build
```

### 프로덕션 실행
```bash
pnpm start
```

## 📁 프로젝트 구조

```
client/src/
├── lib/
│   ├── baccarat-logic.ts       # 게임 로직 (카드, 점수, 승패)
│   ├── sounds.ts               # 사운드 효과 (Web Audio API)
│   └── utils.ts                # 유틸리티 함수
├── hooks/
│   └── useBaccaratGame.ts       # 게임 상태 관리
├── components/
│   ├── PlayingCard.tsx          # 카드 컴포넌트 (쪼기 기능)
│   ├── BettingHistory.tsx       # 배팅 내역 패널
│   ├── Chip.tsx                 # 칩 컴포넌트
│   ├── Roadmap.tsx              # 중국점(본매)
│   └── InitialBalanceDialog.tsx # 시작금액 설정
├── pages/
│   ├── Home.tsx                 # 메인 게임 페이지
│   └── NotFound.tsx             # 404 페이지
├── contexts/
│   └── ThemeContext.tsx         # 테마 관리
├── App.tsx                      # 라우팅
├── main.tsx                     # 진입점
└── index.css                    # 전역 스타일
```

## 🎨 기술 스택

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui
- **Animation**: Framer Motion
- **Routing**: Wouter
- **Build**: Vite
- **UI Components**: Radix UI

## 🎯 핵심 로직

### 게임 흐름
1. 초기 4장 배분 (Player 2장, Banker 2장)
2. 자연 승리 확인 (8 또는 9)
3. 플레이어 3번째 카드 규칙 적용
4. 뱅커 3번째 카드 규칙 적용
5. 승자 판정 및 배당금 지급

### 사운드 효과
- **카드 뒤집기**: 400Hz → 600Hz 톤
- **칩 배팅**: 800Hz 톤 + 노이즈
- **승리**: C5(523Hz), E5(659Hz), G5(784Hz) 화음
- **카드 쪼기**: 600Hz → 800Hz → 900Hz 진행

## 🎮 플레이 팁

1. **뱅커 선호**: 통계상 뱅커가 약간 유리 (수수료 제외 후)
2. **타이 회피**: 확률은 낮지만 배당이 높음
3. **연승 패턴**: 본매를 보며 패턴 분석
4. **자금 관리**: 장기 플레이를 위해 작은 베팅으로 시작

## 📊 배팅 전략

### Martingale (마틴게일)
- 패배 후 베팅액 2배 증가
- 승리 시 원래 베팅액으로 복귀

### Paroli (파롤리)
- 승리 후 베팅액 2배 증가
- 패배 시 원래 베팅액으로 복귀

### 1-3-2-4 (원쓰리투포)
- 고정된 베팅 수열 사용
- 손실 최소화 전략

## 🔧 커스터마이징

### 배당률 변경
`client/src/hooks/useBaccaratGame.ts`의 `winAmount` 계산 부분 수정

### 칩 값 변경
`client/src/pages/Home.tsx`의 `chipValues` 배열 수정

### 사운드 주파수 변경
`client/src/lib/sounds.ts`의 주파수 값 수정

### 색상 테마 변경
`client/src/index.css`의 CSS 변수 수정

## 📝 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

## 🤝 기여

버그 리포트, 기능 제안, 풀 리퀘스트를 환영합니다.

## 📧 연락처

문제가 있거나 제안이 있으시면 이슈를 등록해주세요.

---

**주의**: 이 시뮬레이터는 교육 목적입니다. 실제 금전 거래는 포함되지 않습니다.
