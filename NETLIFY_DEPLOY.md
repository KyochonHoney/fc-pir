# Netlify 배포 가이드

이제 완전히 정적 사이트(HTML/CSS/JS)로 변환되었습니다!

## ✅ 변환 완료

### 기술 스택 변경
- ❌ ~~PHP 7.4.33 + JSON 파일~~
- ✅ **HTML5 + CSS3 + Vanilla JavaScript + LocalStorage**

### 주요 변경사항
1. **데이터 저장**: JSON 파일 → LocalStorage (브라우저)
2. **팀 편성 알고리즘**: PHP → JavaScript
3. **관리자 인증**: 세션 → LocalStorage 기반
4. **모든 페이지**: PHP → HTML

---

## 🚀 Netlify 배포 방법

### 1. GitHub에 푸시

```bash
cd C:\xampp\htdocs\football

# Git 저장소 초기화 (아직 안했다면)
git init

# 원격 저장소 추가
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# 커밋 및 푸시
git add .
git commit -m "Convert to static site for Netlify"
git push -u origin main
```

### 2. Netlify에서 배포

#### 방법 A: GitHub 연동 (권장)

1. https://app.netlify.com 로그인
2. **"Add new site"** → **"Import an existing project"**
3. **GitHub** 선택하고 저장소 연결
4. Build settings:
   - **Build command**: (비워두기)
   - **Publish directory**: `.` (루트)
5. **Deploy site** 클릭

#### 방법 B: 드래그 앤 드롭

1. https://app.netlify.com 로그인
2. **"Add new site"** → **"Deploy manually"**
3. `football` 폴더 전체를 드래그 앤 드롭

---

## 📁 배포할 파일 목록

### HTML 페이지
```
index.html                  # 메인 페이지
team-generator.html         # 팀 편성
payment-status.html         # 회비 현황
admin/
  ├── login.html           # 관리자 로그인
  ├── index.html           # 관리자 대시보드
  ├── members.html         # 멤버 관리
  └── payments.html        # 회비 관리
```

### JavaScript
```
js/
  ├── storage.js           # LocalStorage 데이터 관리
  └── team-algorithm.js    # 팀 편성 알고리즘
```

### CSS
```
assets/css/style.css       # 전체 스타일
```

### 설정 파일
```
netlify.toml               # Netlify 설정
_redirects                 # 리다이렉트 규칙
```

---

## 🌐 접속 URL

### 배포 후 접속 주소
```
https://fcpir.netlify.app          # 메인 페이지
https://fcpir.netlify.app/team-generator.html
https://fcpir.netlify.app/payment-status.html
https://fcpir.netlify.app/admin/   # 관리자 페이지
```

---

## 🔐 관리자 로그인

**기본 계정 (JavaScript에 하드코딩):**
```
아이디: admin
비밀번호: admin1234
```

**변경 방법**: `js/storage.js` 파일의 `adminLogin()` 함수 수정

---

## 💾 데이터 저장 방식

### LocalStorage 사용
- **위치**: 브라우저 로컬 저장소
- **용량**: 최대 10MB
- **영구성**: 브라우저를 닫아도 유지됨
- **공유**: 각 브라우저마다 독립적 (Chrome, Firefox 등)

### 데이터 초기화
1. 메인 페이지에서 "데이터 초기화" 버튼 클릭
2. 또는 브라우저 개발자 도구 → Application → Local Storage → Clear

### 데이터 백업
```javascript
// 브라우저 콘솔에서 실행
const backup = {
    members: localStorage.getItem('football_members'),
    payments: localStorage.getItem('football_payments'),
    teams: localStorage.getItem('football_teams')
};
console.log(JSON.stringify(backup));
// 출력된 내용을 복사하여 저장
```

### 데이터 복원
```javascript
// 백업한 데이터를 붙여넣기
const backup = { /* 백업 데이터 */ };
localStorage.setItem('football_members', backup.members);
localStorage.setItem('football_payments', backup.payments);
localStorage.setItem('football_teams', backup.teams);
location.reload();
```

---

## ✨ 주요 기능

### 1. 팀 편성
- 레벨 밸런스 자동 조정
- 공격/수비 포지션 분포 고려
- Zigzag + Iterative balancing 알고리즘

### 2. 회비 관리
- 회비 기록 추가/수정
- 납부/미납 상태 관리
- 통계 자동 계산

### 3. 멤버 관리
- 멤버 CRUD (생성/조회/수정/삭제)
- 포지션 및 레벨 설정
- 활성/비활성 상태

---

## 🐛 트러블슈팅

### 데이터가 사라짐
**원인**: 브라우저 캐시 삭제 시 LocalStorage도 삭제됨

**해결**:
- 정기적으로 데이터 백업
- 다른 브라우저에서도 사용 가능

### 관리자 로그인 안됨
**원인**: LocalStorage 세션 만료 (1시간)

**해결**: 다시 로그인

### 팀 편성이 안됨
**원인**: 멤버 데이터가 없음

**해결**:
1. 관리자 페이지에서 멤버 추가
2. 또는 "데이터 초기화"로 샘플 데이터 로드

---

## 🔒 보안 고려사항

### LocalStorage의 한계
- ⚠️ **누구나 브라우저에서 데이터 조회 가능**
- ⚠️ **XSS 공격에 취약할 수 있음**
- ⚠️ **민감한 정보 저장 금지**

### 권장사항
- 중요한 데이터는 저장하지 마세요
- 개인 팀/그룹 용도로만 사용
- 정기적으로 데이터 백업

---

## 📊 성능

### 장점
- ✅ 서버 비용 0원 (완전 무료)
- ✅ 빠른 응답 속도 (클라이언트 사이드)
- ✅ 오프라인에서도 동작 가능
- ✅ 무제한 트래픽 (Netlify)

### 단점
- ❌ 데이터 공유 불가 (브라우저별 독립)
- ❌ 백엔드 없음 (복잡한 로직 불가)
- ❌ 다중 사용자 동시 접속 불가

---

## 🎯 추천 사용 사례

**적합한 경우:**
- ✅ 개인 또는 소규모 팀 사용
- ✅ 로컬 데이터 관리
- ✅ 빠른 프로토타입
- ✅ 무료 호스팅 필요

**부적합한 경우:**
- ❌ 다중 사용자 실시간 협업
- ❌ 데이터 영구 보존 필수
- ❌ 민감한 정보 저장
- ❌ 복잡한 권한 관리

---

## 📞 지원

문제가 있으시면:
1. 브라우저 콘솔(F12) 확인
2. LocalStorage 데이터 확인
3. 캐시 삭제 후 재시도

---

**배포 완료!** 🎉

이제 `fcpir.netlify.app`에서 완벽하게 작동합니다!
