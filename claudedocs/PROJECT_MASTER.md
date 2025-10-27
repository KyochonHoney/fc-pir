# 풋살 팀 자동 매칭 시스템 - 프로젝트 마스터 문서

## 📋 프로젝트 개요

### 프로젝트 명
**Futsal Team Auto-Matcher** (풋살 팀 자동 매칭 시스템)

### 프로젝트 목적
풋살 경기를 위한 자동 팀 편성 시스템으로, 공격/수비 밸런스와 실력 레벨을 고려하여 최적의 팀을 구성하고, 회비 관리 기능을 제공합니다.

### 핵심 가치
- ⚖️ **공정한 팀 편성**: 공격/수비 밸런스 및 레벨 균형
- ⚡ **빠른 처리**: 즉시 최적의 팀 구성
- 💰 **회비 관리**: 납부 여부 자동 추적
- 🎯 **간편한 사용**: 로그인 없이 대부분의 기능 사용 가능
- 🚀 **단순 구조**: DB 서버 없이 파일 기반 저장소

---

## 🎯 핵심 기능 요구사항

### 1. 자동 팀 짜기 (Auto Team Matching)

#### 기능 설명
참가 멤버 목록을 기반으로 두 팀을 자동으로 구성합니다.

#### 팀 편성 알고리즘 요구사항
- **공격/수비 밸런스**: 각 팀에 공격수와 수비수를 균등하게 배치
- **레벨 밸런스**: 각 팀의 총 실력 레벨이 비슷하도록 조정
- **공정성**: 매번 다른 조합으로 팀 구성 (랜덤 요소 포함)

#### 멤버 속성
```php
[
    'id' => 1,
    'name' => '김철수',
    'position' => 'ATT',  // ATT(공격) / DEF(수비) / ALL(올라운더)
    'level' => 8,         // 1-10
    'is_active' => true   // 활성 멤버 여부
]
```

#### 알고리즘 로직
1. 활성 멤버만 필터링
2. 레벨 합산이 비슷하도록 조합 생성
3. 각 팀의 포지션 균형 확인
4. 최적의 조합 선택

### 2. 회비 관리 (Payment Management)

#### 기능 설명
각 멤버의 회비 납부 여부를 확인하고 관리합니다.

#### 주요 기능
- 회비 납부 상태 조회 (전체 멤버)
- 회비 미납자 목록 확인
- 회비 납부 기록 (관리자만)
- 회비 금액 및 납부 기한 표시

#### 데이터 구조
```php
[
    'member_id' => 1,
    'amount' => 10000,
    'paid' => true,       // 납부 여부
    'payment_date' => '2025-10-27',
    'note' => '10월 회비'
]
```

### 3. 멤버 관리 (Member Management) - 관리자 전용

#### 기능 설명
관리자가 멤버를 추가, 수정, 삭제할 수 있습니다.

#### 주요 기능
- **멤버 추가**: 새로운 멤버 등록
- **멤버 수정**: 기존 멤버 정보 변경 (이름, 포지션, 레벨)
- **멤버 삭제**: 탈퇴한 멤버 제거 (is_active = false)
- **멤버 목록 조회**: 전체 멤버 리스트 확인

#### 권한
- 관리자만 접근 가능 (로그인 필요)

### 4. 인증 시스템 (Authentication)

#### 기능 설명
관리자 계정만 로그인하여 멤버 관리 기능을 사용합니다.

#### 주요 기능
- **관리자 로그인**: ID/PW 하드코딩 비교
- **세션 관리**: 로그인 상태 유지
- **로그아웃**: 세션 종료

#### 권한 레벨
- **관리자 (Admin)**: 모든 기능 접근 가능
- **일반 사용자 (Guest)**: 로그인 없이 팀 편성, 회비 조회만 가능

---

## 🏗️ 기술 스택 설계

### 프론트엔드
- **HTML5**: 구조
- **CSS3**: 스타일링 (반응형 디자인)
- **JavaScript (Vanilla)**: 동적 기능 구현
- **Bootstrap 5** (선택): UI 컴포넌트

### 백엔드
- **PHP 7.4.33**: 서버 사이드 로직
- **JSON 파일**: 데이터 저장소 (data/*.json)
- **Apache**: 웹 서버 (XAMPP 환경)

### 데이터 저장 방식
- **파일 기반**: JSON 파일로 데이터 저장
- **No Database**: MySQL 불필요
- **하드코딩**: 관리자 계정 정보는 config.php에 직접 저장

### 개발 환경
- **XAMPP (PHP 7.4.33)**: 로컬 개발 서버
- **Git**: 버전 관리 (선택)

---

## 🗄️ 데이터 구조 설계

### 파일 기반 저장소

#### 1. data/members.json (멤버 데이터)
```json
{
    "members": [
        {
            "id": 1,
            "name": "김철수",
            "position": "ATT",
            "level": 8,
            "is_active": true,
            "created_at": "2025-10-27 14:00:00"
        },
        {
            "id": 2,
            "name": "이영희",
            "position": "DEF",
            "level": 7,
            "is_active": true,
            "created_at": "2025-10-27 14:05:00"
        }
    ],
    "next_id": 3
}
```

#### 2. data/payments.json (회비 데이터)
```json
{
    "payments": [
        {
            "id": 1,
            "member_id": 1,
            "amount": 10000,
            "paid": true,
            "payment_date": "2025-10-27",
            "note": "10월 회비",
            "created_at": "2025-10-27 14:30:00"
        }
    ],
    "next_id": 2
}
```

#### 3. data/attendances.json (출석 데이터)
```json
{
    "attendances": [
        {
            "member_id": 1,
            "attendance_date": "2025-10-27",
            "is_attending": true
        }
    ]
}
```

#### 4. data/teams.json (팀 편성 기록 - 선택)
```json
{
    "teams": [
        {
            "id": 1,
            "match_date": "2025-10-27",
            "team_a": [1, 3, 5, 7, 9],
            "team_b": [2, 4, 6, 8, 10],
            "team_a_level": 36,
            "team_b_level": 35,
            "created_at": "2025-10-27 15:00:00"
        }
    ],
    "next_id": 2
}
```

#### 5. config/admin.php (관리자 계정 - 하드코딩)
```php
<?php
// 관리자 계정 (하드코딩)
define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD', 'admin1234'); // 실제로는 더 강력한 비밀번호 사용

// 또는 배열 방식
$admins = [
    [
        'username' => 'admin',
        'password' => 'admin1234'
    ]
];
?>
```

---

## 📁 프로젝트 구조

```
football/
├── claudedocs/                    # 프로젝트 문서
│   ├── PROJECT_MASTER.md         # 마스터 기획 문서 (현재 파일)
│   ├── API_SPEC.md               # API 명세서
│   └── DEVELOPMENT_LOG.md        # 개발 진행 로그
│
├── config/                        # 설정 파일
│   ├── config.php                # 전역 설정
│   └── admin.php                 # 관리자 계정 (하드코딩)
│
├── data/                         # JSON 데이터 파일
│   ├── members.json              # 멤버 데이터
│   ├── payments.json             # 회비 데이터
│   ├── attendances.json          # 출석 데이터
│   └── teams.json                # 팀 편성 기록
│
├── includes/                      # 공통 파일
│   ├── header.php                # 헤더
│   ├── footer.php                # 푸터
│   ├── functions.php             # 공통 함수
│   └── data_handler.php          # JSON 파일 읽기/쓰기 함수
│
├── api/                          # API 엔드포인트
│   ├── auth.php                  # 로그인/로그아웃
│   ├── members.php               # 멤버 CRUD
│   ├── payments.php              # 회비 CRUD
│   └── teams.php                 # 팀 생성 및 기록
│
├── admin/                        # 관리자 페이지
│   ├── index.php                 # 대시보드
│   ├── members.php               # 멤버 관리
│   ├── payments.php              # 회비 관리
│   └── login.php                 # 로그인
│
├── public/                       # 공개 페이지
│   ├── index.php                 # 메인 페이지
│   ├── team-generator.php        # 팀 편성 페이지
│   └── payment-status.php        # 회비 현황 페이지
│
├── assets/                       # 정적 파일
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── main.js
│   │   └── team-generator.js
│   └── images/
│
└── .htaccess                     # Apache 설정 (선택)
```

---

## 🎨 UI/UX 설계

### 페이지 구성

#### 1. 메인 페이지 (public/index.php)
- 서비스 소개
- 주요 기능 안내
- 팀 편성 바로가기
- 회비 현황 바로가기

#### 2. 팀 편성 페이지 (public/team-generator.php)
- 참가 멤버 선택 (체크박스)
- 팀 생성 버튼
- 결과 표시 (Team A vs Team B)
- 각 팀의 레벨 합계 표시
- 포지션 분포 표시

#### 3. 회비 현황 페이지 (public/payment-status.php)
- 전체 멤버 회비 상태 표
- 납부/미납 필터링
- 미납자 강조 표시

#### 4. 관리자 로그인 (admin/login.php)
- 간단한 로그인 폼
- ID/PW 입력

#### 5. 관리자 대시보드 (admin/index.php)
- 전체 멤버 수
- 회비 납부율
- 최근 팀 편성 기록
- 빠른 액션 버튼

#### 6. 멤버 관리 페이지 (admin/members.php)
- 멤버 목록 테이블
- 추가/수정/삭제 기능
- 검색 및 필터링

#### 7. 회비 관리 페이지 (admin/payments.php)
- 회비 기록 테이블
- 납부 처리 기능
- 미납자 목록

---

## 🚀 개발 로드맵

### Phase 1: 프로젝트 초기 설정 (1일)
- [ ] 프로젝트 디렉토리 구조 생성
- [ ] XAMPP 환경 설정 확인 (PHP 7.4.33)
- [ ] 기본 설정 파일 작성 (config.php, admin.php)
- [ ] JSON 데이터 파일 초기화
- [ ] .htaccess 설정 (선택)

### Phase 2: 데이터 핸들러 구현 (1일)
- [ ] JSON 파일 읽기 함수 (readJSON)
- [ ] JSON 파일 쓰기 함수 (writeJSON)
- [ ] 멤버 CRUD 함수
- [ ] 회비 CRUD 함수
- [ ] 출석 CRUD 함수
- [ ] 파일 잠금 처리 (동시성 제어)

### Phase 3: 인증 시스템 (1일)
- [ ] 관리자 계정 하드코딩 (config/admin.php)
- [ ] 로그인 페이지 UI (admin/login.php)
- [ ] 로그인 처리 로직 (api/auth.php)
- [ ] 세션 관리
- [ ] 로그아웃 기능
- [ ] 권한 검증 미들웨어

### Phase 4: 멤버 관리 기능 (2일)
- [ ] 멤버 목록 조회 API
- [ ] 멤버 추가 API
- [ ] 멤버 수정 API
- [ ] 멤버 삭제 API (is_active = false)
- [ ] 관리자 멤버 관리 페이지 UI
- [ ] 폼 유효성 검사
- [ ] AJAX 처리

### Phase 5: 회비 관리 기능 (2일)
- [ ] 회비 기록 조회 API
- [ ] 회비 납부 처리 API
- [ ] 회비 현황 공개 페이지 UI
- [ ] 관리자 회비 관리 페이지 UI
- [ ] 미납자 필터링 기능
- [ ] 납부율 계산

### Phase 6: 팀 자동 편성 알고리즘 (3일)
- [ ] 팀 편성 알고리즘 설계
  - [ ] 레벨 밸런스 로직
  - [ ] 포지션 밸런스 로직
  - [ ] 조합 생성 및 평가
- [ ] 팀 생성 API 엔드포인트
- [ ] 팀 편성 페이지 UI
- [ ] 참가자 선택 인터페이스
- [ ] 결과 표시 화면
- [ ] 팀 편성 기록 저장

### Phase 7: 프론트엔드 UI/UX (2일)
- [ ] 반응형 디자인 구현
- [ ] CSS 스타일링
- [ ] JavaScript 인터랙션
- [ ] 로딩 인디케이터
- [ ] 에러 메시지 표시
- [ ] 사용자 피드백 개선

### Phase 8: 테스트 및 디버깅 (2일)
- [ ] 기능 테스트 (각 API 엔드포인트)
- [ ] 브라우저 호환성 테스트
- [ ] 모바일 반응형 테스트
- [ ] JSON 파일 읽기/쓰기 테스트
- [ ] 동시 접근 테스트
- [ ] 버그 수정

### Phase 9: 배포 준비 (1일)
- [ ] 프로덕션 설정 확인
- [ ] JSON 파일 백업 설정
- [ ] 문서화 완료
- [ ] 사용자 가이드 작성

---

## ✅ 개발 체크리스트

### 데이터 저장소
- [ ] data/ 디렉토리 생성
- [ ] members.json 초기화
- [ ] payments.json 초기화
- [ ] attendances.json 초기화
- [ ] teams.json 초기화
- [ ] JSON 파일 권한 설정 (쓰기 가능)

### 백엔드 API
- [ ] 인증 API
  - [ ] POST /api/auth.php?action=login
  - [ ] POST /api/auth.php?action=logout
- [ ] 멤버 API
  - [ ] GET /api/members.php?action=list
  - [ ] POST /api/members.php?action=create
  - [ ] PUT /api/members.php?action=update
  - [ ] DELETE /api/members.php?action=delete
- [ ] 회비 API
  - [ ] GET /api/payments.php?action=list
  - [ ] POST /api/payments.php?action=create
  - [ ] PUT /api/payments.php?action=update
- [ ] 팀 API
  - [ ] POST /api/teams.php?action=generate
  - [ ] GET /api/teams.php?action=history

### 프론트엔드 페이지
- [ ] 공개 페이지
  - [ ] 메인 페이지
  - [ ] 팀 편성 페이지
  - [ ] 회비 현황 페이지
- [ ] 관리자 페이지
  - [ ] 로그인 페이지
  - [ ] 대시보드
  - [ ] 멤버 관리
  - [ ] 회비 관리

### 보안
- [ ] XSS 방지 (htmlspecialchars)
- [ ] CSRF 토큰 구현 (선택)
- [ ] 세션 보안 설정
- [ ] JSON 파일 직접 접근 방지 (.htaccess)
- [ ] 적절한 에러 핸들링

### 테스트
- [ ] 로그인/로그아웃 테스트
- [ ] 멤버 CRUD 테스트
- [ ] 회비 관리 테스트
- [ ] 팀 편성 알고리즘 테스트
- [ ] JSON 파일 동시 쓰기 테스트
- [ ] 권한 검증 테스트
- [ ] 브라우저 호환성 테스트
- [ ] 모바일 반응형 테스트

---

## 🔧 핵심 알고리즘: 팀 자동 편성

### 알고리즘 목표
1. 두 팀의 레벨 합산을 최대한 비슷하게
2. 각 팀의 공격/수비 비율을 균등하게
3. 공정성을 위한 랜덤 요소 포함

### 알고리즘 단계

#### Step 1: 참가자 필터링
```php
// 활성 멤버만 선택
$active_members = array_filter($members, function($m) {
    return $m['is_active'] === true;
});
```

#### Step 2: 멤버 정렬
```php
// 레벨 기준 내림차순 정렬
usort($active_members, function($a, $b) {
    return $b['level'] - $a['level'];
});
```

#### Step 3: 초기 배치
```php
$team_a = [];
$team_b = [];

foreach ($active_members as $index => $member) {
    if ($index % 2 === 0) {
        $team_a[] = $member;
    } else {
        $team_b[] = $member;
    }
}
```

#### Step 4: 밸런스 조정
```php
$max_iterations = 100;
$tolerance = 2; // 허용 레벨 차이

while ($iterations < $max_iterations) {
    $diff = abs(array_sum_level($team_a) - array_sum_level($team_b));

    if ($diff <= $tolerance) {
        break;
    }

    // 레벨 차이를 줄일 수 있는 교환 찾기
    // 교환 실행
}
```

#### Step 5: 포지션 밸런스 확인
```php
$team_a_positions = count_positions($team_a);
$team_b_positions = count_positions($team_b);

// 포지션 균형 조정 로직
```

#### Step 6: 결과 반환
```php
return [
    'team_a' => $team_a,
    'team_b' => $team_b,
    'team_a_level' => array_sum_level($team_a),
    'team_b_level' => array_sum_level($team_b),
    'level_diff' => abs(array_sum_level($team_a) - array_sum_level($team_b))
];
```

### 예제 시나리오
```
참가자 10명:
1. 김철수 (ATT, 8)
2. 이영희 (DEF, 7)
3. 박민수 (ALL, 9)
4. 정수진 (ATT, 6)
5. 최준호 (DEF, 8)
6. 강미영 (ALL, 7)
7. 임동혁 (ATT, 5)
8. 한지은 (DEF, 6)
9. 오세훈 (ALL, 8)
10. 윤하늘 (ATT, 7)

총 레벨: 71
목표: 각 팀 35-36

결과:
Team A (36): 박민수(9), 이영희(7), 정수진(6), 최준호(8), 한지은(6)
Team B (35): 김철수(8), 강미영(7), 임동혁(5), 오세훈(8), 윤하늘(7)

레벨 차이: 1 (허용)
```

---

## 💾 JSON 파일 처리 함수 (PHP 7.4.33 호환)

### 기본 함수 구조 (includes/data_handler.php)

```php
<?php
/**
 * JSON 파일 읽기
 * PHP 7.4.33 호환
 */
function readJSON($filename) {
    $filepath = __DIR__ . '/../data/' . $filename;

    if (!file_exists($filepath)) {
        return null;
    }

    $content = file_get_contents($filepath);
    return json_decode($content, true);
}

/**
 * JSON 파일 쓰기
 * PHP 7.4.33 호환
 */
function writeJSON($filename, $data) {
    $filepath = __DIR__ . '/../data/' . $filename;

    // 파일 잠금으로 동시 쓰기 방지
    $fp = fopen($filepath, 'w');
    if (flock($fp, LOCK_EX)) {
        fwrite($fp, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        flock($fp, LOCK_UN);
    }
    fclose($fp);

    return true;
}

/**
 * 멤버 목록 가져오기
 */
function getMembers() {
    $data = readJSON('members.json');
    return $data['members'] ?? [];
}

/**
 * 멤버 추가
 */
function addMember($name, $position, $level) {
    $data = readJSON('members.json');

    $new_member = [
        'id' => $data['next_id'],
        'name' => $name,
        'position' => $position,
        'level' => $level,
        'is_active' => true,
        'created_at' => date('Y-m-d H:i:s')
    ];

    $data['members'][] = $new_member;
    $data['next_id']++;

    writeJSON('members.json', $data);

    return $new_member;
}

/**
 * 멤버 수정
 */
function updateMember($id, $name, $position, $level) {
    $data = readJSON('members.json');

    foreach ($data['members'] as &$member) {
        if ($member['id'] === $id) {
            $member['name'] = $name;
            $member['position'] = $position;
            $member['level'] = $level;
            break;
        }
    }

    writeJSON('members.json', $data);
    return true;
}

/**
 * 멤버 삭제 (비활성화)
 */
function deleteMember($id) {
    $data = readJSON('members.json');

    foreach ($data['members'] as &$member) {
        if ($member['id'] === $id) {
            $member['is_active'] = false;
            break;
        }
    }

    writeJSON('members.json', $data);
    return true;
}

// 더 많은 함수들...
?>
```

---

## 📊 프로젝트 진행 현황

### 현재 상태
- **Phase**: Phase 0 - 기획 완료
- **진행률**: 0%
- **다음 단계**: 프로젝트 초기 설정

### 완료 항목
- [x] 프로젝트 요구사항 정의
- [x] 기술 스택 결정 (PHP 7.4.33 + 파일 기반 저장소)
- [x] 데이터 구조 설계 (JSON)
- [x] 프로젝트 구조 설계
- [x] 개발 로드맵 작성

### 진행 중 항목
- [ ] 없음

### 대기 항목
- [ ] Phase 1 시작

---

## 📝 개발 규칙 및 컨벤션

### 코딩 스타일
- **PHP**: PSR-12 코딩 표준
- **JavaScript**: ES6+ 문법 사용
- **파일명**: snake_case (PHP), kebab-case (CSS/JS)

### 네이밍 규칙
- **변수**: camelCase
- **상수**: UPPER_SNAKE_CASE
- **함수**: camelCase
- **JSON 파일**: snake_case.json

### JSON 파일 관리
- 모든 JSON 파일은 UTF-8 인코딩
- Pretty print로 가독성 유지
- 한글 유니코드 이스케이프 방지 (JSON_UNESCAPED_UNICODE)
- 파일 잠금으로 동시 쓰기 방지

### PHP 7.4.33 호환성
- Null 병합 연산자 (??) 사용 가능
- 화살표 함수 (fn) 사용 가능
- Typed Properties 사용 가능
- Array spread operator 사용 가능

### Git 커밋 메시지 (선택)
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
```

### 보안 체크리스트
- [ ] 모든 사용자 입력 검증
- [ ] XSS 방지 (htmlspecialchars)
- [ ] JSON 파일 직접 접근 방지
- [ ] 세션 보안 설정
- [ ] 적절한 에러 핸들링

---

## 🔍 샘플 데이터

### members.json 초기 데이터
```json
{
    "members": [
        {"id": 1, "name": "김철수", "position": "ATT", "level": 8, "is_active": true, "created_at": "2025-10-27 14:00:00"},
        {"id": 2, "name": "이영희", "position": "DEF", "level": 7, "is_active": true, "created_at": "2025-10-27 14:00:00"},
        {"id": 3, "name": "박민수", "position": "ALL", "level": 9, "is_active": true, "created_at": "2025-10-27 14:00:00"},
        {"id": 4, "name": "정수진", "position": "ATT", "level": 6, "is_active": true, "created_at": "2025-10-27 14:00:00"},
        {"id": 5, "name": "최준호", "position": "DEF", "level": 8, "is_active": true, "created_at": "2025-10-27 14:00:00"}
    ],
    "next_id": 6
}
```

### payments.json 초기 데이터
```json
{
    "payments": [
        {"id": 1, "member_id": 1, "amount": 10000, "paid": true, "payment_date": "2025-10-27", "note": "10월 회비", "created_at": "2025-10-27 14:30:00"},
        {"id": 2, "member_id": 2, "amount": 10000, "paid": false, "payment_date": null, "note": "10월 회비", "created_at": "2025-10-27 14:30:00"}
    ],
    "next_id": 3
}
```

---

**문서 버전**: 1.0.0
**최초 작성일**: 2025-10-27
**최종 수정일**: 2025-10-27
**작성자**: Claude Code
**상태**: ✅ 기획 완료 (PHP 7.4.33 + 파일 기반 저장소)
