# 🔥 Firebase 설정 가이드

이 프로젝트를 Firebase와 연동하여 Netlify에서 정상 작동하도록 하는 단계별 가이드입니다.

## ✅ 1단계: Firebase 프로젝트 생성

1. **Firebase Console 접속**: https://console.firebase.google.com/
2. **"프로젝트 추가"** 클릭
3. 프로젝트 이름 입력: `football-fc-pir` (또는 원하는 이름)
4. Google Analytics: **비활성화** (선택사항)
5. **"프로젝트 만들기"** 클릭

---

## ✅ 2단계: Realtime Database 활성화

1. Firebase Console → 좌측 메뉴 → **"Realtime Database"**
2. **"데이터베이스 만들기"** 클릭
3. 위치 선택: **asia-southeast1** (싱가포르 - 한국과 가까움)
4. 보안 규칙: **"테스트 모드로 시작"** 선택
5. **"사용 설정"** 클릭

---

## ✅ 3단계: Firebase 구성 정보 가져오기

1. Firebase Console → 좌측 상단 ⚙️ → **"프로젝트 설정"**
2. 하단 "내 앱" 섹션 → **웹 앱 추가** 버튼 클릭 (</> 아이콘)
3. 앱 닉네임: `FC PIR Web`
4. Firebase Hosting: **체크 안 함**
5. **"앱 등록"** 클릭
6. **"Firebase SDK 구성"** 코드 복사

아래와 같은 형식의 코드가 나타납니다:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

---

## ✅ 4단계: 프로젝트에 Firebase 설정 적용

1. 위에서 복사한 `firebaseConfig` 객체를 가지고
2. **`/js/firebase-config.js`** 파일을 엽니다
3. 기존 `firebaseConfig` 부분을 **모두 교체**합니다:

```javascript
// ❌ 이 부분을 삭제하고
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  // ...
};

// ✅ Firebase Console에서 복사한 실제 값으로 교체
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

4. 파일 저장

---

## ✅ 5단계: Firebase 보안 규칙 설정

1. Firebase Console → **Realtime Database** → **"규칙"** 탭
2. 다음 규칙을 복사하여 붙여넣기:

```json
{
  "rules": {
    ".read": true,
    ".write": true,

    "members": {
      ".indexOn": ["id", "is_active"]
    },

    "payments": {
      ".indexOn": ["id", "member_id", "year", "month", "paid"]
    },

    "teams": {
      ".indexOn": ["id", "created_at"]
    },

    "gallery": {
      ".indexOn": ["id", "created_at"]
    },

    "admin_sessions": {
      ".indexOn": ["expires"]
    }
  }
}
```

3. **"게시"** 버튼 클릭

> ⚠️ **보안 참고**: 현재는 테스트용으로 모든 읽기/쓰기를 허용합니다.
> 실제 운영 시에는 인증된 사용자만 접근하도록 규칙을 강화하세요.

---

## ✅ 6단계: 모든 HTML 파일 업데이트

프로젝트의 모든 HTML 파일에서 아래 변경이 필요합니다:

### 기존 코드 (찾기):
```html
<script src="/js/storage.js"></script>
```

### 새 코드 (교체):
```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>

<!-- Firebase 설정 -->
<script src="/js/firebase-config.js"></script>

<!-- Firebase Storage -->
<script src="/js/storage-firebase.js"></script>
```

**업데이트해야 할 파일 목록:**
- ✅ `/admin/login.html` (이미 완료)
- ⬜ `/admin/index.html`
- ⬜ `/admin/members.html`
- ⬜ `/admin/payments.html`
- ⬜ `/admin/gallery.html`
- ⬜ `/index.html`
- ⬜ `/team-generator.html`
- ⬜ `/gallery.html`
- ⬜ `/payment-status.html`

---

## ✅ 7단계: 기존 데이터 마이그레이션 (선택)

만약 로컬 `localStorage`에 이미 데이터가 있다면, Firebase로 옮길 수 있습니다:

1. 브라우저 개발자 도구 콘솔 열기 (F12)
2. 다음 명령어 실행:

```javascript
await storage.migrateFromLocalStorage();
```

3. 콘솔에 "🎉 마이그레이션 완료!" 메시지 확인

---

## ✅ 8단계: 테스트

1. **로컬 테스트**:
   ```bash
   # XAMPP에서 Apache 시작
   # http://localhost/football/admin/login.html 접속
   ```

2. **로그인 테스트**:
   - 아이디: `admin`
   - 비밀번호: `admin1234`

3. **Firebase 콘솔에서 확인**:
   - Realtime Database → 데이터 탭
   - `admin_sessions` 노드에 세션 데이터가 생성되었는지 확인

---

## ✅ 9단계: GitHub & Netlify 배포

1. **Git 커밋 & 푸시**:
   ```bash
   git add .
   git commit -m "Firebase 연동 완료"
   git push origin main
   ```

2. **Netlify 자동 배포**:
   - Netlify가 자동으로 새 코드를 감지하여 배포
   - 배포 완료 후 사이트 접속하여 테스트

3. **다른 브라우저에서 테스트**:
   - 새 시크릿 창 또는 다른 브라우저에서 접속
   - 데이터가 모든 브라우저에서 동일하게 보이는지 확인

---

## 🎉 완료!

이제 다음 기능들이 정상 작동합니다:
- ✅ 모든 브라우저에서 동일한 데이터 공유
- ✅ 새 브라우저/시크릿 모드에서도 데이터 유지
- ✅ Netlify 배포 후에도 데이터 영구 저장
- ✅ 관리자 로그인 세션 관리

---

## 📞 문제 해결

### Q: "Firebase is not defined" 오류
**A**: Firebase SDK가 로드되기 전에 코드가 실행됨. HTML에서 스크립트 순서 확인:
```html
1. Firebase SDK
2. firebase-config.js
3. storage-firebase.js
4. 나머지 스크립트
```

### Q: 데이터가 저장되지 않음
**A**: Firebase Console → Realtime Database → 규칙 탭에서 `.write: true` 확인

### Q: "Permission denied" 오류
**A**: Firebase 보안 규칙을 다시 확인하고 "게시" 버튼 클릭했는지 확인

### Q: 로그인은 되는데 다른 페이지에서 세션이 안 보임
**A**: 해당 HTML 파일에도 Firebase SDK와 storage-firebase.js가 포함되어 있는지 확인

---

## 💡 추가 개선 사항 (선택)

### 1. 환경 변수로 API Key 보호
Firebase API Key는 공개되어도 괜찮지만, 더 안전하게 하려면:
- Netlify 환경 변수 사용
- `.env` 파일 + 빌드 프로세스

### 2. Firebase 보안 규칙 강화
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

### 3. Firebase Authentication 연동
현재는 하드코딩된 관리자 계정. 실제 Firebase Auth 사용 시 더 안전함.
