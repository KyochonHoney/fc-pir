# ⚽ 풋살 팀 자동 매칭 시스템

PHP 기반 풋살 팀 자동 편성 및 회비 관리 시스템입니다.

## 🎯 주요 기능

### 1. 자동 팀 편성
- **공격/수비 밸런스**: 포지션 분포 자동 조정
- **레벨 밸런스**: Zigzag 알고리즘으로 공평한 팀 구성
- **실시간 통계**: 각 팀의 평균 레벨 및 포지션 분포 표시

### 2. 회비 관리
- 회비 납부 현황 추적
- 납부율 자동 계산
- 멤버별 회비 기록 관리

### 3. 멤버 관리 (관리자 전용)
- 멤버 추가/수정/삭제
- 포지션 및 레벨 설정
- 활성/비활성 상태 관리

## 🚀 빠른 시작

### 시스템 요구사항
- PHP 7.4.33
- Apache (XAMPP 권장)
- JSON 파일 쓰기 권한

### 설치 방법

1. **VirtualHost 설정**
   ```apache
   # httpd-vhosts.conf
   <VirtualHost *:80>
       DocumentRoot "C:/xampp/htdocs/football"
       ServerName football
   </VirtualHost>
   ```

2. **hosts 파일 수정**
   ```
   # C:\Windows\System32\drivers\etc\hosts
   127.0.0.1   football
   ```

3. **Apache 재시작**
   - XAMPP Control Panel에서 Apache 재시작

4. **접속**
   - 메인 페이지: `http://football/public/index.php`
   - 관리자 로그인: `http://football/admin/login.php`

### 기본 관리자 계정
```
아이디: admin
비밀번호: admin1234
```

## 📁 프로젝트 구조

```
football/
├── claudedocs/        # 프로젝트 문서
├── config/            # 설정 파일
├── data/              # JSON 데이터
├── includes/          # 공통 함수
├── api/               # RESTful API
├── admin/             # 관리자 페이지
├── public/            # 공개 페이지
└── assets/            # CSS, JS
```

## 📖 문서

- **[프로젝트 기획서](claudedocs/PROJECT_MASTER.md)**: 전체 시스템 설계 및 기획
- **[API 명세서](claudedocs/API_SPEC.md)**: RESTful API 상세 문서
- **[개발 로그](claudedocs/DEVELOPMENT_LOG.md)**: 개발 진행 상황
- **[배포 가이드](claudedocs/DEPLOYMENT_GUIDE.md)**: 설치 및 운영 가이드

## 🔧 기술 스택

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Data Storage**: LocalStorage (브라우저 기반)
- **Hosting**: Netlify (정적 사이트)
- **Algorithm**: JavaScript 팀 밸런싱

## ⚡ 주요 특징

- **완전 무료**: 서버 비용 0원 (Netlify 무료 호스팅)
- **설치 불필요**: 브라우저만 있으면 즉시 사용
- **오프라인 지원**: 로컬 저장소로 오프라인에서도 작동
- **반응형 디자인**: 모바일/태블릿/데스크톱 대응
- **빠른 속도**: 클라이언트 사이드 처리로 즉각 반응

## 📊 데이터 구조

### 멤버 데이터
```json
{
  "id": 1,
  "name": "홍길동",
  "position": "ATT",
  "level": 7,
  "is_active": true,
  "created_at": "2025-10-27 10:00:00"
}
```

### 회비 데이터
```json
{
  "id": 1,
  "member_id": 1,
  "amount": 20000,
  "paid": true,
  "payment_date": "2025-10-27",
  "note": "10월 회비"
}
```

## 🎨 화면 구성

### 공개 페이지
- **메인 대시보드**: 전체 통계 및 빠른 메뉴
- **팀 편성 페이지**: 멤버 선택 및 자동 팀 생성
- **회비 현황**: 납부 상태 조회

### 관리자 페이지
- **관리자 대시보드**: 통계 및 관리 메뉴
- **멤버 관리**: CRUD 기능
- **회비 관리**: 회비 추가/수정

## 🔐 보안

- **XSS 방지**: 모든 출력에 htmlspecialchars 적용
- **직접 접근 차단**: .htaccess로 데이터 폴더 보호
- **세션 관리**: 안전한 세션 기반 인증
- **관리자 전용**: 민감한 기능은 인증 필수

## 🐛 트러블슈팅

### 페이지가 깨져서 보임
```php
// config/config.php
define('BASE_URL', ''); // VirtualHost 사용
```

### JSON 파일 쓰기 오류
```bash
# 권한 설정
chmod 777 data/
```

자세한 트러블슈팅은 [배포 가이드](claudedocs/DEPLOYMENT_GUIDE.md)를 참조하세요.

## 📝 라이선스

이 프로젝트는 개인/팀 사용을 위한 프로젝트입니다.

## 👨‍💻 개발 정보

- **개발 기간**: 2025-10-27 (1일)
- **개발 언어**: PHP 7.4.33
- **총 파일 수**: 26개 (PHP 17, JSON 4, MD 4, CSS 1, JS 1)
- **코드 라인**: 약 2,500+ 라인

## 🎯 향후 개선 아이디어

- [ ] 팀 편성 히스토리 통계 (승률 등)
- [ ] 멤버별 출석률 통계
- [ ] 회비 납부 알림 기능
- [ ] 팀 편성 시 선호도 반영
- [ ] 모바일 앱 버전

---

**프로젝트 상태**: ✅ 배포 준비 완료
**최종 업데이트**: 2025-10-27
